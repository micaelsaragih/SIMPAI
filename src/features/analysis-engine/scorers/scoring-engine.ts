/**
 * Scoring Engine — deterministic scoring and grade classification.
 * Computes structure score, compliance score, organization score, and final weighted score.
 * No AI/LLM dependencies.
 */

import type { StructureAnalysis, ComplianceResult, ScoreResult, ScoreGrade } from "../types"
import {
  SCORING_WEIGHTS,
  GRADE_THRESHOLDS,
  EXPECTED_SECTION_ORDER,
} from "../constants"
import type { SectionDetection } from "../types"

/**
 * Calculate structure completeness score (0–100).
 * FOUND = full points, PARTIAL = half points, MISSING = 0.
 */
export function calculateStructureScore(structure: StructureAnalysis): number {
  return structure.completeness
}

/**
 * Calculate document organization score (0–100).
 * Measures how well the found sections follow the expected academic order.
 */
export function calculateOrganizationScore(
  sections: SectionDetection[]
): number {
  // Get found/partial sections in their document order
  const presentSections = sections
    .filter((s) => s.status !== "MISSING")
    .map((s) => s.section)

  if (presentSections.length <= 1) {
    return presentSections.length === 1 ? 100 : 0
  }

  // Build expected order indices for present sections
  const expectedIndices = presentSections.map((s) =>
    EXPECTED_SECTION_ORDER.indexOf(s)
  )

  // Count how many consecutive pairs are in correct order
  let correctPairs = 0
  const totalPairs = expectedIndices.length - 1

  for (let i = 0; i < totalPairs; i++) {
    if (expectedIndices[i] < expectedIndices[i + 1]) {
      correctPairs++
    }
  }

  return totalPairs > 0 ? Math.round((correctPairs / totalPairs) * 100) : 100
}

/**
 * Determine grade from a final score.
 */
export function getGrade(score: number): { grade: ScoreGrade; label: string } {
  for (const threshold of GRADE_THRESHOLDS) {
    if (score >= threshold.min && score <= threshold.max) {
      return { grade: threshold.grade, label: threshold.label }
    }
  }
  return { grade: "Needs Improvement", label: "Perlu Perbaikan" }
}

/**
 * Compute the full scoring result.
 * When no template is provided (draft-only), compliance weight is redistributed to structure and language.
 */
export function calculateScore(
  structure: StructureAnalysis,
  compliance: ComplianceResult | null,
  languageScore: number
): ScoreResult {
  const structureScore = calculateStructureScore(structure)
  const complianceScore = compliance ? compliance.compliance : 0

  let finalScore = 0
  let structureWeight: number = SCORING_WEIGHTS.structure
  let complianceWeight: number = SCORING_WEIGHTS.compliance
  let languageWeight: number = SCORING_WEIGHTS.language

  if (compliance === null) {
    const totalWeight = SCORING_WEIGHTS.structure + SCORING_WEIGHTS.language // 0.35 + 0.30 = 0.65
    structureWeight = Number((SCORING_WEIGHTS.structure / totalWeight).toFixed(4))
    complianceWeight = 0
    languageWeight = Number((SCORING_WEIGHTS.language / totalWeight).toFixed(4))

    finalScore = Math.round(
      structureScore * structureWeight +
      languageScore * languageWeight
    )
  } else {
    finalScore = Math.round(
      structureScore * structureWeight +
      complianceScore * complianceWeight +
      languageScore * languageWeight
    )
  }

  const clampedScore = Math.max(0, Math.min(100, finalScore))
  const { grade, label } = getGrade(clampedScore)

  return {
    finalScore: clampedScore,
    grade,
    gradeLabel: label,
    breakdown: {
      structureScore,
      complianceScore,
      languageScore,
      structureWeight,
      complianceWeight,
      languageWeight,
    },
  }
}
