/**
 * Internal types for the Template Intelligence feature module.
 */

import type { TemplateCategory } from "@/types/database"

export interface ExtractedSection {
  name: string
  normalizedKey: string
  headingLevel: number
  headingText: string
  position: number
}

export interface ExtractionResult {
  templateName: string
  detectedPublisher: string | null
  sections: ExtractedSection[]
  requiredSections: string[]
  sectionOrder: string[]
  sectionKeywords: Record<string, string[]>
  headingStructure: Array<{ level: number; text: string }>
}

export interface ProfileValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export interface TemplateCreateInput {
  name: string
  publisher?: string
  description?: string
  category: TemplateCategory
  required_sections: string[]
  section_order: string[]
  section_keywords: Record<string, string[]>
  heading_structure: Array<{ level: number; text: string }>
  quality_score: number
}

export interface TemplateUpdateInput {
  name?: string
  publisher?: string | null
  description?: string | null
  category?: TemplateCategory
}

export interface VersionCreateInput {
  version_name: string
  version_number: string
  notes?: string | null
  section_snapshot: string[]
}
