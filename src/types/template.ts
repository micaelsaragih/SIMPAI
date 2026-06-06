/**
 * Type definitions for the SIMPAI Template Intelligence System.
 * Feature-specific types for template profiling, search, and library.
 */

import type { TemplateCategory, JournalTemplate } from "./database"
import type { Heading } from "./analysis"

// ─── Template Source ────────────────────────────────────────────────────────

export type TemplateSource = "existing" | "new-upload"

// ─── Template Profile ───────────────────────────────────────────────────────

export interface TemplateProfile {
  name: string
  publisher: string | null
  description: string | null
  category: TemplateCategory
  requiredSections: string[]
  sectionOrder: string[]
  sectionKeywords: Record<string, string[]>
  headingStructure: Heading[]
}

// ─── Quality Metrics ────────────────────────────────────────────────────────

export interface TemplateQualityMetrics {
  overallScore: number
  sectionDetectionScore: number
  structureConsistencyScore: number
  metadataAvailabilityScore: number
  breakdown: {
    detectedSections: number
    totalExpectedSections: number
    hasConsistentLevels: boolean
    hasTitle: boolean
    hasPublisher: boolean
    hasDescription: boolean
  }
}

// ─── Search & Filter ────────────────────────────────────────────────────────

export interface TemplateSearchParams {
  query?: string
  category?: TemplateCategory
  sort?: TemplateSortOption
  page?: number
  limit?: number
}

export type TemplateSortOption =
  | "newest"
  | "oldest"
  | "name-asc"
  | "name-desc"
  | "quality-desc"

// ─── Template List Item ─────────────────────────────────────────────────────

export interface TemplateListItem {
  id: string
  name: string
  slug: string
  publisher: string | null
  category: TemplateCategory
  sectionCount: number
  qualityScore: number
  versionCount: number
  createdAt: string
  isOwner: boolean
}

// ─── API Responses ──────────────────────────────────────────────────────────

export interface TemplateListResponse {
  templates: TemplateListItem[]
  total: number
  page: number
  limit: number
}

export interface TemplateSaveResponse {
  success: boolean
  templateId?: string
  error?: string
}
