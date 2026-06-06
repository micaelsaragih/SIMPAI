/**
 * Template Comparator — compares draft structure against a journal template.
 * Detects missing sections, extra sections, and ordering mismatches.
 * Fully deterministic, no AI/LLM dependencies.
 */

import type { ParsedDocument } from "@/types/analysis"
import type { ComplianceResult, OrderIssue } from "../types"
import { SECTION_RULES } from "../constants"
import { COMPLIANCE_PENALTIES } from "../constants"
import { detectSections } from "../detectors/section-detector"

/**
 * Normalize a heading string for comparison: lowercase, trim, collapse whitespace.
 */
function normalizeHeading(heading: string): string {
  return heading.toLowerCase().trim().replace(/\s+/g, " ")
}

/**
 * Identify which academic section type a heading belongs to.
 * Returns the matched rule label or the raw heading if no rule matches.
 */
function classifyHeading(heading: string): string {
  const trimmed = heading.trim()
  for (const rule of SECTION_RULES) {
    if (rule.patterns.some((p) => p.test(trimmed))) {
      return rule.label
    }
  }
  // Return the normalized heading itself if no rule matches
  return normalizeHeading(heading)
}

/**
 * Extract classified section labels from a parsed document's sections.
 */
function extractSectionLabels(doc: ParsedDocument): string[] {
  const detections = detectSections(doc)
  const activeDetections = detections.filter((d) => d.status !== "MISSING")

  const matchedHeadingTexts = new Set(
    activeDetections
      .map((d) => d.headingMatch?.trim().toLowerCase())
      .filter(Boolean)
  )

  const labels: { label: string; charIndex: number }[] = []

  // Add the detected academic sections
  activeDetections.forEach((d) => {
    labels.push({
      label: d.label,
      charIndex: d.charIndex ?? 0,
    })
  })

  // Add other headings that are not matched by academic sections
  doc.headings.forEach((h) => {
    if (!matchedHeadingTexts.has(h.text.trim().toLowerCase())) {
      labels.push({
        label: classifyHeading(h.text),
        charIndex: h.charIndex ?? 0,
      })
    }
  })

  // Sort all labels by charIndex to preserve document order
  labels.sort((a, b) => a.charIndex - b.charIndex)

  return labels.map((l) => l.label)
}

/**
 * Compare draft structure against template structure.
 */
export function compareWithTemplate(
  draft: ParsedDocument,
  template: ParsedDocument
): ComplianceResult {
  const templateLabels = extractSectionLabels(template)
  const draftLabels = extractSectionLabels(draft)

  // Unique labels for set operations
  const templateSet = new Set(templateLabels)
  const draftSet = new Set(draftLabels)

  // Missing: in template but not in draft
  const missing = templateLabels.filter((label) => !draftSet.has(label))
  const uniqueMissing = [...new Set(missing)]

  // Extra: in draft but not in template
  const extra = draftLabels.filter((label) => !templateSet.has(label))
  const uniqueExtra = [...new Set(extra)]

  // Order issues: sections present in both but in wrong order
  const orderIssues: OrderIssue[] = []
  const commonInTemplate = templateLabels.filter((label) => draftSet.has(label))
  const commonInDraft = draftLabels.filter((label) => templateSet.has(label))

  // Build position maps for common sections
  for (let i = 0; i < commonInTemplate.length; i++) {
    const section = commonInTemplate[i]
    const draftPosition = commonInDraft.indexOf(section)
    if (draftPosition !== -1 && draftPosition !== i) {
      orderIssues.push({
        section,
        expectedPosition: i + 1,
        actualPosition: draftPosition + 1,
      })
    }
  }

  // Calculate compliance score
  // Start at 100, deduct penalties
  let compliance = 100
  compliance -= uniqueMissing.length * COMPLIANCE_PENALTIES.missingSectionPenalty
  compliance -= uniqueExtra.length * COMPLIANCE_PENALTIES.extraSectionPenalty
  compliance -= orderIssues.length * COMPLIANCE_PENALTIES.orderMismatchPenalty

  // Clamp to 0-100
  compliance = Math.max(0, Math.min(100, compliance))

  return {
    compliance,
    missing: uniqueMissing,
    extra: uniqueExtra,
    orderIssues,
    templateSections: templateLabels,
    draftSections: draftLabels,
  }
}
