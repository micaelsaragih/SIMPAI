/**
 * Constants for the SIMPAI Indonesian Academic Language Analysis Engine.
 * Defines scoring weights, grade thresholds, severity penalties, and utility patterns.
 */

import type { LanguageGrade, LanguageSeverity } from "../types"

// ─── Scoring Weights ────────────────────────────────────────────────────────

/** Weight distribution for the composite language score */
export const LANGUAGE_SCORING_WEIGHTS = {
  kbbi: 0.35,
  puebi: 0.35,
  academicStyle: 0.30,
} as const

// ─── Grade Thresholds ───────────────────────────────────────────────────────

export interface LanguageGradeThreshold {
  min: number
  max: number
  grade: LanguageGrade
  label: string
}

export const LANGUAGE_GRADE_THRESHOLDS: readonly LanguageGradeThreshold[] = [
  { min: 90, max: 100, grade: "Excellent", label: "Sangat Baik" },
  { min: 75, max: 89, grade: "Good", label: "Baik" },
  { min: 60, max: 74, grade: "Fair", label: "Cukup" },
  { min: 0, max: 59, grade: "Needs Improvement", label: "Perlu Perbaikan" },
] as const

// ─── Severity Penalty Points ────────────────────────────────────────────────

/** Points deducted per issue based on severity */
export const SEVERITY_PENALTY_MAP: Record<LanguageSeverity, number> = {
  error: 5,
  warning: 3,
  info: 1,
  suggestion: 0,
} as const

// ─── Performance Caps ───────────────────────────────────────────────────────

/** Maximum issues to report per category to prevent excessive output */
export const MAX_ISSUES_PER_CATEGORY = 200

// ─── Tokenization ───────────────────────────────────────────────────────────

/**
 * Pattern to split Indonesian text into word tokens.
 * Matches sequences of word characters including hyphens (for compound words).
 */
export const WORD_TOKENIZER_PATTERN = /[\w]+(?:-[\w]+)*/g

/**
 * Pattern to split text into sentences.
 * Splits on period, exclamation, or question mark followed by whitespace or end.
 */
export const SENTENCE_SPLITTER_PATTERN = /[.!?]+(?:\s+|$)/

// ─── Issue ID Prefix ────────────────────────────────────────────────────────

/** Prefix for generating unique issue IDs */
export const ISSUE_ID_PREFIX = {
  kbbi: "KBBI",
  puebi: "PUEBI",
  academicStyle: "STYLE",
} as const

// ─── Default Summary Messages ───────────────────────────────────────────────

export const SUMMARY_MESSAGES = {
  excellent: "Kualitas bahasa akademik sangat baik. Hanya ditemukan sedikit catatan minor.",
  good: "Kualitas bahasa akademik baik. Terdapat beberapa perbaikan yang disarankan.",
  fair: "Kualitas bahasa akademik cukup. Diperlukan perbaikan pada beberapa aspek kebahasaan.",
  needsImprovement: "Kualitas bahasa akademik perlu perbaikan signifikan. Ditemukan banyak kesalahan kebahasaan.",
} as const

// ─── Section-Aware Analysis ─────────────────────────────────────────────────

/** Sections that are typically excluded from strict language analysis */
export const EXCLUDED_SECTIONS_FROM_LANGUAGE_CHECK = [
  "references",
  "daftar pustaka",
  "bibliography",
  "referensi",
  "kepustakaan",
] as const
