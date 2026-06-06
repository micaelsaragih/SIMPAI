/**
 * Constants for the SIMPAI Template Intelligence system.
 * Category display configs, quality thresholds, and template-related mappings.
 */

import type { TemplateCategory } from "@/types/database"

// ─── Template Category Config ───────────────────────────────────────────────

export interface TemplateCategoryConfig {
  value: TemplateCategory
  label: string
  color: string
  bgColor: string
  description?: string
}

export const TEMPLATE_CATEGORIES: Record<TemplateCategory, TemplateCategoryConfig> = {
  "computer-science": {
    value: "computer-science",
    label: "Ilmu Komputer",
    color: "text-blue-700 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/40",
    description: "Jurnal bidang ilmu komputer dan informatika",
  },
  "information-systems": {
    value: "information-systems",
    label: "Sistem Informasi",
    color: "text-violet-700 dark:text-violet-400",
    bgColor: "bg-violet-50 dark:bg-violet-950/40",
    description: "Jurnal bidang sistem informasi dan manajemen",
  },
  engineering: {
    value: "engineering",
    label: "Teknik",
    color: "text-orange-700 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950/40",
    description: "Jurnal bidang teknik dan rekayasa",
  },
  education: {
    value: "education",
    label: "Pendidikan",
    color: "text-emerald-700 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/40",
    description: "Jurnal bidang pendidikan dan pengajaran",
  },
  general: {
    value: "general",
    label: "Umum",
    color: "text-slate-700 dark:text-slate-400",
    bgColor: "bg-slate-50 dark:bg-slate-950/40",
    description: "Jurnal ilmiah multidisiplin",
  },
}

// ─── Quality Score Weights ──────────────────────────────────────────────────

export const QUALITY_WEIGHTS = {
  sectionDetection: 0.40,
  structureConsistency: 0.30,
  metadataAvailability: 0.30,
} as const

// ─── Quality Thresholds ─────────────────────────────────────────────────────

export const QUALITY_THRESHOLDS = [
  { min: 80, label: "Sangat Lengkap", color: "text-emerald-600" },
  { min: 60, label: "Cukup Lengkap", color: "text-amber-600" },
  { min: 0, label: "Perlu Dilengkapi", color: "text-red-600" },
] as const

// ─── Publisher Detection Patterns ───────────────────────────────────────────

export const PUBLISHER_PATTERNS: Array<{ pattern: RegExp; publisher: string }> = [
  { pattern: /universitas/i, publisher: "" }, // Will extract full name
  { pattern: /institut\s+teknologi/i, publisher: "" },
  { pattern: /politeknik/i, publisher: "" },
  { pattern: /sekolah\s+tinggi/i, publisher: "" },
  { pattern: /ieee/i, publisher: "IEEE" },
  { pattern: /acm/i, publisher: "ACM" },
  { pattern: /springer/i, publisher: "Springer" },
  { pattern: /elsevier/i, publisher: "Elsevier" },
]

// ─── Slug Generation ────────────────────────────────────────────────────────

export const SLUG_MAX_LENGTH = 80

// ─── Pagination Defaults ────────────────────────────────────────────────────

export const DEFAULT_PAGE_SIZE = 12
export const MAX_PAGE_SIZE = 50
