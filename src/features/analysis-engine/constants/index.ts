/**
 * Constants and detection rules for the SIMPAI Rule-Based Analysis Engine.
 * Defines keyword patterns for each required academic section.
 */

import type { AcademicSectionType } from "../types"

// ─── Section Detection Rules ────────────────────────────────────────────────

export interface SectionRule {
  type: AcademicSectionType
  label: string
  /** Case-insensitive patterns matched against heading text */
  patterns: RegExp[]
  /** Minimum word count to qualify as FOUND (below = PARTIAL) */
  minWordCount: number
  /** Order position in standard academic layout (1-indexed) */
  expectedOrder: number
}

export const SECTION_RULES: SectionRule[] = [
  {
    type: "title",
    label: "Judul",
    patterns: [/^title$/i, /^judul$/i],
    minWordCount: 3,
    expectedOrder: 1,
  },
  {
    type: "abstract",
    label: "Abstrak",
    patterns: [/^abstract$/i, /^abstrak$/i, /^abstraksi$/i],
    minWordCount: 50,
    expectedOrder: 2,
  },
  {
    type: "keywords",
    label: "Kata Kunci",
    patterns: [
      /^keywords?$/i,
      /^kata\s*kunci$/i,
      /^key\s*words?$/i,
    ],
    minWordCount: 3,
    expectedOrder: 3,
  },
  {
    type: "introduction",
    label: "Pendahuluan",
    patterns: [
      /^introduction$/i,
      /^pendahuluan$/i,
      /^latar\s*belakang$/i,
    ],
    minWordCount: 50,
    expectedOrder: 4,
  },
  {
    type: "methodology",
    label: "Metodologi",
    patterns: [
      /^method$/i,
      /^methods$/i,
      /^methodology$/i,
      /^metode$/i,
      /^metodologi$/i,
      /^metode\s*penelitian$/i,
      /^bahan\s*dan\s*metode$/i,
      /^materials?\s*and\s*methods?$/i,
    ],
    minWordCount: 50,
    expectedOrder: 5,
  },
  {
    type: "results",
    label: "Hasil",
    patterns: [
      /^results?$/i,
      /^hasil$/i,
      /^hasil\s*penelitian$/i,
      /^results?\s*and\s*discussions?$/i,
      /^hasil\s*dan\s*pembahasan$/i,
    ],
    minWordCount: 50,
    expectedOrder: 6,
  },
  {
    type: "discussion",
    label: "Pembahasan",
    patterns: [
      /^discussion$/i,
      /^pembahasan$/i,
      /^diskusi$/i,
    ],
    minWordCount: 50,
    expectedOrder: 7,
  },
  {
    type: "conclusion",
    label: "Kesimpulan",
    patterns: [
      /^conclusion$/i,
      /^conclusions?$/i,
      /^kesimpulan$/i,
      /^kesimpulan\s*dan\s*saran$/i,
      /^conclusion\s*and\s*recommendations?$/i,
    ],
    minWordCount: 30,
    expectedOrder: 8,
  },
  {
    type: "references",
    label: "Daftar Pustaka",
    patterns: [
      /^references?$/i,
      /^bibliography$/i,
      /^daftar\s*pustaka$/i,
      /^referensi$/i,
      /^kepustakaan$/i,
    ],
    minWordCount: 10,
    expectedOrder: 9,
  },
]

// ─── Expected Academic Section Order ────────────────────────────────────────

export const EXPECTED_SECTION_ORDER: AcademicSectionType[] = [
  "title",
  "abstract",
  "keywords",
  "introduction",
  "methodology",
  "results",
  "discussion",
  "conclusion",
  "references",
]

// ─── Scoring Weights ────────────────────────────────────────────────────────

export const SCORING_WEIGHTS = {
  structure: 0.35,
  compliance: 0.35,
  language: 0.30,
} as const

// ─── Grade Thresholds ───────────────────────────────────────────────────────

export const GRADE_THRESHOLDS = [
  { min: 90, max: 100, grade: "Excellent" as const, label: "Sangat Baik" },
  { min: 75, max: 89, grade: "Good" as const, label: "Baik" },
  { min: 60, max: 74, grade: "Fair" as const, label: "Cukup" },
  { min: 0, max: 59, grade: "Needs Improvement" as const, label: "Perlu Perbaikan" },
] as const

// ─── Compliance Penalty Points ──────────────────────────────────────────────

export const COMPLIANCE_PENALTIES = {
  missingSectionPenalty: 15,
  extraSectionPenalty: 5,
  orderMismatchPenalty: 10,
} as const

// ─── Total Required Sections ────────────────────────────────────────────────

export const TOTAL_REQUIRED_SECTIONS = EXPECTED_SECTION_ORDER.length
