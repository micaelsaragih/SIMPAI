/**
 * Template Extractor — extracts a structured template profile from a parsed document.
 * Uses section detection rules from the analysis engine to classify headings.
 */

import type { ParsedDocument, Heading } from "@/types/analysis"
import type { TemplateProfile } from "@/types/template"
import type { ExtractionResult, ExtractedSection } from "../types"
import { SECTION_RULES } from "@/features/analysis-engine/constants"
import { PUBLISHER_PATTERNS } from "../constants"

/**
 * Extracts a reusable template profile from a parsed DOCX document.
 */
export function extractTemplateProfile(document: ParsedDocument): TemplateProfile {
  const extraction = extractSections(document)
  const publisher = detectPublisher(document)

  return {
    name: extraction.templateName,
    publisher,
    description: null,
    category: "general",
    requiredSections: extraction.requiredSections,
    sectionOrder: extraction.sectionOrder,
    sectionKeywords: extraction.sectionKeywords,
    headingStructure: document.headings.map((h) => ({ level: h.level, text: h.text, index: h.index })),
  }
}

/**
 * Extracts and classifies sections from the document headings.
 */
function extractSections(document: ParsedDocument): ExtractionResult {
  const sections: ExtractedSection[] = []
  const requiredSections: string[] = []
  const sectionOrder: string[] = []
  const sectionKeywords: Record<string, string[]> = {}

  // Derive template name from document title or first H1
  const templateName = document.title || document.headings.find((h) => h.level === 1)?.text || "Template Tanpa Nama"

  for (const heading of document.headings) {
    const normalizedText = heading.text.trim().toLowerCase().replace(/\s+/g, " ")
    let matched = false

    for (const rule of SECTION_RULES) {
      for (const pattern of rule.patterns) {
        if (pattern.test(normalizedText) || pattern.test(heading.text.trim())) {
          const section: ExtractedSection = {
            name: rule.label,
            normalizedKey: rule.type,
            headingLevel: heading.level,
            headingText: heading.text,
            position: sections.length,
          }

          sections.push(section)

          if (!requiredSections.includes(rule.label)) {
            requiredSections.push(rule.label)
            sectionOrder.push(rule.type)
          }

          // Collect keywords for this section type
          if (!sectionKeywords[rule.type]) {
            sectionKeywords[rule.type] = []
          }
          if (!sectionKeywords[rule.type].includes(heading.text.trim())) {
            sectionKeywords[rule.type].push(heading.text.trim())
          }

          matched = true
          break
        }
      }
      if (matched) break
    }
  }

  return {
    templateName,
    detectedPublisher: null,
    sections,
    requiredSections,
    sectionOrder,
    sectionKeywords,
    headingStructure: document.headings.map((h) => ({ level: h.level, text: h.text })),
  }
}

/**
 * Attempts to detect the publisher from the document content.
 * Scans the first few paragraphs and the title for publisher patterns.
 */
function detectPublisher(document: ParsedDocument): string | null {
  // Search in first 5 paragraphs for publisher mentions
  const searchText = [
    document.title,
    ...document.paragraphs.slice(0, 5).map((p) => p.text),
  ].join(" ")

  for (const { pattern, publisher } of PUBLISHER_PATTERNS) {
    const match = searchText.match(pattern)
    if (match) {
      // If publisher is pre-defined (e.g., IEEE, ACM), return it
      if (publisher) return publisher

      // Otherwise, try to extract the full institutional name
      // Look for the sentence or phrase containing the match
      const contextPattern = new RegExp(
        `((?:universitas|institut\\s+teknologi|politeknik|sekolah\\s+tinggi)\\s+[\\w\\s]+?)(?:[,\\.\\n]|$)`,
        "i"
      )
      const contextMatch = searchText.match(contextPattern)
      if (contextMatch) {
        return contextMatch[1].trim()
      }
    }
  }

  return null
}
