/**
 * Type definitions for the SIMPAI Analysis Workflow.
 * Covers analysis modes, parsed document structure, wizard state, and step progression.
 */

// ─── Analysis Mode ──────────────────────────────────────────────────────────

export type AnalysisMode = "draft-only" | "template-based"

// ─── Parsed Document Types ──────────────────────────────────────────────────

export type HeadingDetectionMethod = "native" | "bold" | "uppercase" | "keyword" | "heuristic"

export interface Heading {
  level: number
  text: string
  index: number
  charIndex?: number
  detectionMethod?: HeadingDetectionMethod
  confidence?: number
}

export interface Paragraph {
  text: string
  index: number
  wordCount: number
  charIndex?: number
}

export interface Section {
  heading: string
  level: number
  content: string
  wordCount: number
  paragraphCount: number
}

export interface DocumentStatistics {
  wordCount: number
  paragraphCount: number
  sectionCount: number
  headingCount: number
  characterCount: number
}

export interface RejectedHeading {
  text: string
  reason: string
}

export interface ParsedDocument {
  title: string
  headings: Heading[]
  paragraphs: Paragraph[]
  sections: Section[]
  rawText: string
  statistics: DocumentStatistics
  rejectedHeadings?: RejectedHeading[]
}

// ─── Wizard Step Types ──────────────────────────────────────────────────────

export type WizardStep = "mode" | "template" | "draft" | "preview" | "ready"

export type TemplateSource = "existing" | "new-upload"

export interface AnalysisWizardState {
  mode: AnalysisMode | null
  currentStep: WizardStep
  templateSource: TemplateSource | null
  existingTemplateId: string | null
  templateFile: File | null
  templateData: ParsedDocument | null
  draftFile: File | null
  draftData: ParsedDocument | null
  isProcessing: boolean
  error: string | null
}

// ─── Wizard Actions ─────────────────────────────────────────────────────────

export type AnalysisWizardAction =
  | { type: "SET_MODE"; payload: AnalysisMode }
  | { type: "SET_STEP"; payload: WizardStep }
  | { type: "SET_TEMPLATE_SOURCE"; payload: TemplateSource | null }
  | { type: "SET_EXISTING_TEMPLATE"; payload: string | null }
  | { type: "SET_TEMPLATE_FILE"; payload: File | null }
  | { type: "SET_TEMPLATE_DATA"; payload: ParsedDocument | null }
  | { type: "SET_DRAFT_FILE"; payload: File | null }
  | { type: "SET_DRAFT_DATA"; payload: ParsedDocument | null }
  | { type: "SET_PROCESSING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "RESET" }

// ─── File Upload Types ──────────────────────────────────────────────────────

export interface FileUploadConfig {
  accept: string
  maxSizeBytes: number
  label: string
  description: string
}

// ─── Step Configuration ─────────────────────────────────────────────────────

export interface StepConfig {
  id: WizardStep
  label: string
  description: string
  isOptional: boolean
}

// ─── API Response ───────────────────────────────────────────────────────────

export interface ParseApiResponse {
  success: boolean
  data?: ParsedDocument
  error?: string
}
