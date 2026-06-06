/**
 * Analysis Service — central orchestrator for the rule-based analysis engine.
 * Coordinates section detection, structure analysis, template compliance,
 * scoring, and summary generation.
 * Fully deterministic — no AI/LLM dependencies.
 */

import type { ParsedDocument } from "@/types/analysis"
import type { AnalysisResult, AnalysisSummary, ComplianceResult } from "../types"
import { analyzeStructure } from "../detectors/section-detector"
import { compareWithTemplate } from "../comparators/template-comparator"
import { calculateScore } from "../scorers/scoring-engine"
import { SECTION_RULES } from "../constants"
import { analyzeLanguage } from "@/features/language-engine/services/language-analysis-service"

/**
 * Get the Indonesian label for an academic section type.
 */
function getSectionLabel(sectionType: string): string {
  const rule = SECTION_RULES.find((r) => r.type === sectionType)
  return rule ? rule.label : sectionType
}

/**
 * Generate a deterministic Indonesian-language analysis summary.
 */
function generateSummary(
  result: Omit<AnalysisResult, "summary">
): AnalysisSummary {
  const { structure, compliance, score } = result
  const highlights: string[] = []

  // Structure completeness statement
  const foundCount = structure.found.length + structure.partial.length + structure.uncertain.length
  highlights.push(
    `Artikel mengandung ${foundCount} dari ${structure.totalExpected} bagian akademik yang diharapkan.`
  )

  // Missing sections
  if (structure.missing.length > 0) {
    const labels = structure.missing.map(getSectionLabel)
    highlights.push(
      `Bagian yang tidak ditemukan: ${labels.join(", ")}.`
    )
  }

  // Partial sections
  if (structure.partial.length > 0) {
    const labels = structure.partial.map(getSectionLabel)
    highlights.push(
      `Bagian yang kurang lengkap: ${labels.join(", ")}.`
    )
  }

  // Uncertain sections
  if (structure.uncertain && structure.uncertain.length > 0) {
    const labels = structure.uncertain.map(getSectionLabel)
    highlights.push(
      `Bagian yang diragukan akurasinya (low confidence): ${labels.join(", ")}.`
    )
  }

  // Template compliance
  if (compliance) {
    highlights.push(
      `Skor kesesuaian template: ${compliance.compliance}%.`
    )

    if (compliance.missing.length > 0) {
      highlights.push(
        `Bagian template yang belum ada di artikel: ${compliance.missing.join(", ")}.`
      )
    }

    if (compliance.extra.length > 0) {
      highlights.push(
        `Bagian tambahan yang tidak ada di template: ${compliance.extra.join(", ")}.`
      )
    }

    if (compliance.orderIssues.length > 0) {
      highlights.push(
        `Ditemukan ${compliance.orderIssues.length} masalah urutan bagian.`
      )
    }
  }

  // Score grade
  highlights.push(
    `Skor akhir: ${score.finalScore}/100 (${score.gradeLabel}).`
  )

  // Build full summary text
  const text = highlights.join(" ")

  return { text, highlights }
}

/**
 * Run the complete rule-based analysis pipeline.
 *
 * @param draft - The parsed draft article document
 * @param template - The parsed journal template document (null for draft-only mode)
 * @returns Complete AnalysisResult with structure, compliance, scoring, and summary
 */
export function runAnalysis(
  draft: ParsedDocument,
  template: ParsedDocument | null
): AnalysisResult {
  // Step 1: Analyze structure (section detection)
  const structure = analyzeStructure(draft)

  // Step 2: Compare with template (if provided)
  let compliance: ComplianceResult | null = null
  if (template) {
    compliance = compareWithTemplate(draft, template)
  }

  // Step 3: Run deterministic language analysis
  const languageAnalysis = analyzeLanguage(draft)

  // Step 4: Calculate scores
  const score = calculateScore(structure, compliance, languageAnalysis.score.finalScore)

  // Step 5: Build partial result for summary generation
  const mode = template ? "template-based" as const : "draft-only" as const
  const partialResult = {
    mode,
    structure,
    compliance,
    score,
    documentTitle: draft.title || "Dokumen Tanpa Judul",
    documentStats: draft.statistics,
    templateTitle: template?.title || null,
    analyzedAt: new Date().toISOString(),
    languageIssues: [],
    recommendations: [],
    languageAnalysis,
  }

  // Step 6: Generate deterministic summary
  const summary = generateSummary(partialResult)

  return {
    ...partialResult,
    summary,
  }
}
