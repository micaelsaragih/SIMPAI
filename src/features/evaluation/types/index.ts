/**
 * Type definitions for the SIMPAI Testing & Evaluation Framework.
 * All types are strongly typed.
 */

import type { AcademicSectionType, SectionStatus } from "@/features/analysis-engine/types"
import type { LanguageIssueCategory, LanguageSeverity } from "@/features/language-engine/types"

// ─── Base Evaluation Interfaces ─────────────────────────────────────────────

export interface EvalResult {
  id: string
  name: string
  passed: boolean
  message?: string
  expected: string
  actual: string
}

export interface EvalRunSummary {
  total: number
  passed: number
  failed: number
  accuracy: number // ratio of passed/total
  results: EvalResult[]
}

// ─── Phase 1: Black Box Scenarios ───────────────────────────────────────────

export interface BlackBoxScenario {
  id: string
  module: string
  name: string
  action: string
  expectedOutcome: string
  automatedVerificationCommand?: string
}

// ─── Phase 2: Functional Accuracy Test Cases ────────────────────────────────

export interface StructureTestCaseHeading {
  level: number
  text: string
}

export interface StructureTestCaseParagraph {
  text: string
}

export interface StructureTestCase {
  id: string
  name: string
  description: string
  input: {
    headings: StructureTestCaseHeading[]
    paragraphs: StructureTestCaseParagraph[]
  }
  expected: {
    sections: {
      section: AcademicSectionType
      status: SectionStatus
    }[]
    completeness: number
  }
}

export interface ComplianceTestCase {
  id: string
  name: string
  description: string
  input: {
    draftHeadings: string[]
    templateHeadings: string[]
  }
  expected: {
    compliance: number
    missingCount: number
    extraCount: number
    orderIssueCount: number
  }
}

export interface LanguageTestCase {
  id: string
  name: string
  description: string
  category: LanguageIssueCategory
  input: {
    text: string
    sectionHeading: string
  }
  expected: {
    issueCount: number
    issueTypes: string[]
    minSeverity: LanguageSeverity
  }
}

// ─── Phase 3: Performance Benchmark ─────────────────────────────────────────

export interface PerformanceBenchmark {
  operation: string
  durationMs: number
  thresholdMs: number
  passed: boolean
}

// ─── Phase 4: User Acceptance Testing ───────────────────────────────────────

export interface UATQuestion {
  id: string
  category: "usability" | "functionality" | "performance" | "academic-value"
  question: string
  description: string
}

// ─── Phase 5: AI Recommendation Evaluation ──────────────────────────────────

export interface AIProviderStats {
  provider: string
  successCount: number
  failureCount: number
  successRate: number
}

export interface AIRecommendationEval {
  jsonValidityRate: number
  completenessRate: number
  providerUsage: AIProviderStats[]
  fallbackTriggers: number
  passed: boolean
}

// ─── Composite Evaluation Report ────────────────────────────────────────────

export interface EvaluationReport {
  timestamp: string
  systemVersion: string
  summary: {
    overallAccuracy: number
    totalTests: number
    totalPassed: number
    totalFailed: number
  }
  blackBox: EvalRunSummary
  structureAccuracy: EvalRunSummary
  complianceAccuracy: EvalRunSummary
  languageAccuracy: EvalRunSummary
  aiRecommendation: AIRecommendationEval
  performance: {
    benchmarks: PerformanceBenchmark[]
    passed: boolean
  }
  uat: {
    questions: UATQuestion[]
  }
}
