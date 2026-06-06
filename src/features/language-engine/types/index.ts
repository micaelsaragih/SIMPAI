/**
 * Type definitions for the SIMPAI Indonesian Academic Language Analysis Engine.
 * All types are strongly typed — no `any` allowed.
 *
 * Layers:
 *   1. KBBI  — word-level validation
 *   2. PUEBI — spelling & grammar rules
 *   3. Academic Style — formality & tone analysis
 *   4. Scoring — composite language score
 */

// ─── Severity & Category ────────────────────────────────────────────────────

export type LanguageSeverity = "error" | "warning" | "info" | "suggestion"

export type LanguageIssueCategory = "kbbi" | "puebi" | "academic-style"

// ─── KBBI Issue Types ───────────────────────────────────────────────────────

export type KBBIIssueType =
  | "non-standard-word"
  | "informal-word"
  | "slang"
  | "regional-word"

// ─── PUEBI Issue Types ──────────────────────────────────────────────────────

export type PUEBIIssueType =
  | "capitalization"
  | "punctuation"
  | "abbreviation"
  | "number-format"
  | "prefix-suffix"
  | "compound-word"
  | "foreign-word"

// ─── Academic Style Issue Types ─────────────────────────────────────────────

export type AcademicStyleIssueType =
  | "informal-phrase"
  | "subjective-language"
  | "first-person"
  | "colloquial"
  | "redundant-phrase"
  | "weak-verb"
  | "non-academic-connector"

// ─── Location Tracking ─────────────────────────────────────────────────────

export interface IssueLocation {
  /** Section heading where the issue was found */
  sectionHeading: string | null
  /** Zero-based section index */
  sectionIndex: number
  /** Zero-based paragraph index within the section */
  paragraphIndex: number
  /** Zero-based sentence index within the paragraph */
  sentenceIndex: number
}

// ─── Base Issue Interface ───────────────────────────────────────────────────

export interface LanguageIssueBase {
  /** Unique identifier for this issue */
  id: string
  /** Which analysis layer found this issue */
  category: LanguageIssueCategory
  /** Severity of the issue */
  severity: LanguageSeverity
  /** Human-readable description of the issue */
  message: string
  /** Suggested fix or improvement */
  suggestion: string
  /** Where in the document the issue was found */
  location: IssueLocation
  /** The original text that triggered the issue */
  originalText: string
  /** The suggested replacement text */
  suggestedReplacement: string | null
}

// ─── Layer 1: KBBI Issues ───────────────────────────────────────────────────

export interface KBBIIssue extends LanguageIssueBase {
  category: "kbbi"
  /** Specific type of KBBI issue */
  issueType: KBBIIssueType
  /** The KBBI-standard form, if known */
  standardForm: string | null
}

// ─── Layer 2: PUEBI Issues ──────────────────────────────────────────────────

export interface PUEBIIssue extends LanguageIssueBase {
  category: "puebi"
  /** Specific type of PUEBI violation */
  issueType: PUEBIIssueType
  /** Identifier of the PUEBI rule violated */
  ruleId: string
  /** Description of the PUEBI rule */
  ruleDescription: string
}

// ─── Layer 3: Academic Style Issues ─────────────────────────────────────────

export interface AcademicStyleIssue extends LanguageIssueBase {
  category: "academic-style"
  /** Specific type of style issue */
  issueType: AcademicStyleIssueType
  /** The recommended academic alternative */
  academicAlternative: string
}

// ─── Layer Result Types ─────────────────────────────────────────────────────

export interface KBBICheckResult {
  /** All KBBI issues found */
  issues: KBBIIssue[]
  /** Total number of words analyzed */
  totalWordsChecked: number
  /** Number of non-standard words detected */
  nonStandardCount: number
  /** Ratio of standard words (1.0 = all standard) */
  standardWordRatio: number
}

export interface PUEBICheckResult {
  /** All PUEBI issues found */
  issues: PUEBIIssue[]
  /** Total rule checks performed */
  rulesChecked: number
  /** Number of violations detected */
  violationCount: number
  /** Compliance rate (1.0 = fully compliant) */
  complianceRate: number
}

export interface AcademicStyleResult {
  /** All academic style issues found */
  issues: AcademicStyleIssue[]
  /** Total sentences analyzed */
  totalSentencesChecked: number
  /** Number of sentences with informal markers */
  informalCount: number
  /** Academic writing quality score (0-100) */
  academicScore: number
}

// ─── Scoring Types ──────────────────────────────────────────────────────────

export type LanguageGrade = "Excellent" | "Good" | "Fair" | "Needs Improvement"

export interface LanguageScoreBreakdown {
  /** KBBI compliance sub-score (0-100) */
  kbbiScore: number
  /** PUEBI compliance sub-score (0-100) */
  puebiScore: number
  /** Academic style sub-score (0-100) */
  academicStyleScore: number
  /** Weighted final score (0-100) */
  finalScore: number
  /** Grade classification */
  grade: LanguageGrade
  /** Indonesian label for the grade */
  gradeLabel: string
  /** Individual weight values used */
  weights: {
    kbbi: number
    puebi: number
    academicStyle: number
  }
}

// ─── Summary Statistics ─────────────────────────────────────────────────────

export interface LanguageIssueSummary {
  /** Total issues across all layers */
  totalIssues: number
  /** Issues by severity */
  bySeverity: {
    error: number
    warning: number
    info: number
    suggestion: number
  }
  /** Issues by category */
  byCategory: {
    kbbi: number
    puebi: number
    academicStyle: number
  }
  /** Human-readable summary text */
  summaryText: string
  /** Key highlights for the dashboard */
  highlights: string[]
}

// ─── Composite Analysis Result ──────────────────────────────────────────────

export interface LanguageAnalysisResult {
  /** Layer 1: KBBI check results */
  kbbi: KBBICheckResult
  /** Layer 2: PUEBI check results */
  puebi: PUEBICheckResult
  /** Layer 3: Academic style check results */
  academicStyle: AcademicStyleResult
  /** Layer 4: Composite scoring */
  score: LanguageScoreBreakdown
  /** Aggregated summary */
  summary: LanguageIssueSummary
  /** ISO timestamp of when the analysis was performed */
  analyzedAt: string
}

// ─── Dataset Shapes ─────────────────────────────────────────────────────────

export interface NonStandardWordEntry {
  /** The non-standard word form */
  nonStandard: string
  /** The KBBI-standard replacement */
  standard: string
  /** Category of the non-standard usage */
  category: KBBIIssueType
}

export interface AcademicPhraseEntry {
  /** The informal or non-academic phrase */
  informal: string
  /** The recommended academic replacement */
  academic: string
  /** Type of style issue this maps to */
  issueType: AcademicStyleIssueType
}

export interface InformalMarkerEntry {
  /** Regex pattern string to detect the informal marker */
  pattern: string
  /** Regex flags (e.g., "gi") */
  flags: string
  /** The recommended replacement */
  replacement: string
  /** Type of style issue */
  issueType: AcademicStyleIssueType
  /** Human-readable description */
  description: string
}

export interface PUEBIRuleEntry {
  /** Unique rule identifier (e.g., "PUEBI-001") */
  id: string
  /** Rule name */
  name: string
  /** Rule description */
  description: string
  /** Regex pattern string */
  pattern: string
  /** Regex flags (e.g., "g", "gi") */
  flags: string
  /** Suggested replacement pattern */
  replacement: string
  /** Severity of violation */
  severity: LanguageSeverity
  /** PUEBI issue type category */
  issueType: PUEBIIssueType
}
