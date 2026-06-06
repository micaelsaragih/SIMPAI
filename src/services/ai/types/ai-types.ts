import { z } from "zod"

export interface AIReviewFinding {
  finding: string
  severity: "low" | "medium" | "high"
  suggestedRevision: string
  exampleCorrection: string
}

export const AIReviewFindingSchema = z.object({
  finding: z.string(),
  severity: z.enum(["low", "medium", "high"]),
  suggestedRevision: z.string(),
  exampleCorrection: z.string(),
})

export interface AIRecommendation {
  category: "structure" | "language" | "compliance" | "academic"
  priority: 1 | 2 | 3 | 4 | 5
  title: string
  description: string
  suggestedFix: string
}

export const AIRecommendationSchema = z.object({
  category: z.enum(["structure", "language", "compliance", "academic"]),
  priority: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  title: z.string(),
  description: z.string(),
  suggestedFix: z.string(),
})

export interface AIAnalysisResult {
  summary: string
  overallScore: number
  strengths: string[]
  weaknesses: string[]
  structureReview: AIReviewFinding[]
  languageReview: AIReviewFinding[]
  puebiReview: AIReviewFinding[]
  kbbiReview: AIReviewFinding[]
  styleReview: AIReviewFinding[]
  recommendations: AIRecommendation[]
}

export const AIAnalysisResultSchema = z.object({
  summary: z.string(),
  overallScore: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  structureReview: z.array(AIReviewFindingSchema),
  languageReview: z.array(AIReviewFindingSchema),
  puebiReview: z.array(AIReviewFindingSchema),
  kbbiReview: z.array(AIReviewFindingSchema),
  styleReview: z.array(AIReviewFindingSchema),
  recommendations: z.array(AIRecommendationSchema),
})

export interface AnalysisRequest {
  articleText: string
  templateText?: string
  config?: Record<string, unknown>
}

export interface SectionAnalysisResult {
  section: string
  status: "found" | "missing" | "incomplete"
  feedback?: string
}

export interface TemplateComplianceResult {
  score: number
  missingSections: string[]
  wrongOrder: {
    section: string
    expectedIndex: number
    actualIndex: number
  }[]
  additionalSections: string[]
}

export interface LanguageIssue {
  word: string
  type: "non-standard" | "informal" | "ineffective-sentence" | "inconsistent-term"
  suggestion: string
  context: string
}

export interface AnalysisResponse {
  score: number
  structure: SectionAnalysisResult[]
  compliance: TemplateComplianceResult
  language: LanguageIssue[]
  recommendations: AIRecommendation[]
  aiAnalysis?: AIAnalysisResult | null
}
