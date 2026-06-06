/**
 * Type definitions for the SIMPAI Rule-Based Analysis Engine.
 * All types are strongly typed — no `any` allowed.
 */

import type { ParsedDocument, RejectedHeading } from "@/types/analysis"
import type { LanguageIssue, AIRecommendation } from "@/services/ai/types"
import type { LanguageAnalysisResult } from "@/features/language-engine/types"
import type { AIAnalysisResult } from "@/services/ai/types"


// ─── Academic Section Types ─────────────────────────────────────────────────

export type AcademicSectionType =
  | "title"
  | "abstract"
  | "keywords"
  | "introduction"
  | "methodology"
  | "results"
  | "discussion"
  | "conclusion"
  | "references"

export type SectionStatus = "FOUND" | "MISSING" | "PARTIAL" | "UNCERTAIN"

export interface SectionDetection {
  section: AcademicSectionType
  status: SectionStatus
  label: string
  headingMatch: string | null
  wordCount: number
  confidence: number
  detectionMethod: "heading" | "keyword" | "bab" | "heuristic" | "fuzzy" | null
  charIndex?: number
}

// ─── Structure Analysis ─────────────────────────────────────────────────────

export interface StructureAnalysis {
  sections: SectionDetection[]
  found: AcademicSectionType[]
  missing: AcademicSectionType[]
  partial: AcademicSectionType[]
  uncertain: AcademicSectionType[]
  completeness: number
  totalExpected: number
  totalFound: number
}

// ─── Template Compliance ────────────────────────────────────────────────────

export interface OrderIssue {
  section: string
  expectedPosition: number
  actualPosition: number
}

export interface ComplianceResult {
  compliance: number
  missing: string[]
  extra: string[]
  orderIssues: OrderIssue[]
  templateSections: string[]
  draftSections: string[]
}

// ─── Scoring ────────────────────────────────────────────────────────────────

export type ScoreGrade = "Excellent" | "Good" | "Fair" | "Needs Improvement"

export interface ScoreBreakdown {
  structureScore: number
  complianceScore: number
  languageScore: number
  structureWeight: number
  complianceWeight: number
  languageWeight: number
}

export interface ScoreResult {
  finalScore: number
  grade: ScoreGrade
  gradeLabel: string
  breakdown: ScoreBreakdown
}

// ─── Analysis Summary ───────────────────────────────────────────────────────

export interface AnalysisSummary {
  text: string
  highlights: string[]
}

// ─── Full Analysis Result ───────────────────────────────────────────────────

export interface AnalysisResult {
  mode: "draft-only" | "template-based"
  structure: StructureAnalysis
  compliance: ComplianceResult | null
  score: ScoreResult
  summary: AnalysisSummary
  documentTitle: string
  documentStats: ParsedDocument["statistics"]
  templateTitle: string | null
  analyzedAt: string
  languageIssues: LanguageIssue[]
  recommendations: AIRecommendation[]
  languageAnalysis: LanguageAnalysisResult | null
  aiAnalysis?: AIAnalysisResult | null
  rejectedHeadings?: RejectedHeading[]
}
