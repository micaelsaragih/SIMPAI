/**
 * Template Profiler — calculates quality metrics for a template profile.
 * Scores are based on section detection completeness, structure consistency,
 * and metadata availability.
 */

import type { TemplateProfile, TemplateQualityMetrics } from "@/types/template"
import { EXPECTED_SECTION_ORDER } from "@/features/analysis-engine/constants"
import { QUALITY_WEIGHTS } from "../constants"

/**
 * Calculates quality metrics for a template profile.
 */
export function calculateTemplateQuality(profile: TemplateProfile): TemplateQualityMetrics {
  const sectionScore = calculateSectionDetectionScore(profile)
  const structureScore = calculateStructureConsistencyScore(profile)
  const metadataScore = calculateMetadataAvailabilityScore(profile)

  const overallScore = Math.round(
    sectionScore.score * QUALITY_WEIGHTS.sectionDetection +
    structureScore.score * QUALITY_WEIGHTS.structureConsistency +
    metadataScore.score * QUALITY_WEIGHTS.metadataAvailability
  )

  return {
    overallScore: Math.min(100, Math.max(0, overallScore)),
    sectionDetectionScore: sectionScore.score,
    structureConsistencyScore: structureScore.score,
    metadataAvailabilityScore: metadataScore.score,
    breakdown: {
      detectedSections: sectionScore.detected,
      totalExpectedSections: EXPECTED_SECTION_ORDER.length,
      hasConsistentLevels: structureScore.isConsistent,
      hasTitle: !!profile.name && profile.name !== "Template Tanpa Nama",
      hasPublisher: !!profile.publisher,
      hasDescription: !!profile.description,
    },
  }
}

function calculateSectionDetectionScore(profile: TemplateProfile): { score: number; detected: number } {
  const expectedCount = EXPECTED_SECTION_ORDER.length
  const detected = profile.requiredSections.length
  const score = Math.round((detected / expectedCount) * 100)
  return { score: Math.min(100, score), detected }
}

function calculateStructureConsistencyScore(profile: TemplateProfile): { score: number; isConsistent: boolean } {
  const headings = profile.headingStructure
  if (headings.length === 0) return { score: 0, isConsistent: false }

  // Check if heading levels are consistent (no jumps like H1 → H3)
  let inconsistencies = 0
  for (let i = 1; i < headings.length; i++) {
    const levelDiff = headings[i].level - headings[i - 1].level
    if (levelDiff > 1) inconsistencies++
  }

  // Check that H1 is used at most once (for the title)
  const h1Count = headings.filter((h) => h.level === 1).length
  const hasReasonableH1 = h1Count <= 2

  // Check that main sections use consistent heading level
  const mainSectionLevels = new Set(
    headings.filter((h) => h.level <= 2).map((h) => h.level)
  )
  const hasConsistentMainLevel = mainSectionLevels.size <= 2

  const isConsistent = inconsistencies === 0 && hasReasonableH1 && hasConsistentMainLevel

  let score = 100
  score -= inconsistencies * 15
  if (!hasReasonableH1) score -= 20
  if (!hasConsistentMainLevel) score -= 15

  return { score: Math.max(0, score), isConsistent }
}

function calculateMetadataAvailabilityScore(profile: TemplateProfile): { score: number } {
  let score = 0
  const checks = [
    { condition: !!profile.name && profile.name !== "Template Tanpa Nama", weight: 35 },
    { condition: !!profile.publisher, weight: 25 },
    { condition: !!profile.description, weight: 15 },
    { condition: profile.requiredSections.length > 0, weight: 15 },
    { condition: Object.keys(profile.sectionKeywords).length > 0, weight: 10 },
  ]

  for (const check of checks) {
    if (check.condition) score += check.weight
  }

  return { score: Math.min(100, score) }
}
