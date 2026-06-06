/**
 * Zod validation schemas for the Template Intelligence System.
 */

import { z } from "zod"

// ─── Category Enum ──────────────────────────────────────────────────────────

const templateCategorySchema = z.enum([
  "computer-science",
  "information-systems",
  "engineering",
  "education",
  "general",
])

// ─── Create Template ────────────────────────────────────────────────────────

export const createTemplateSchema = z.object({
  name: z
    .string()
    .min(3, "Nama template minimal 3 karakter")
    .max(100, "Nama template maksimal 100 karakter")
    .trim(),
  publisher: z.string().max(200).trim().optional().nullable(),
  description: z.string().max(500).trim().optional().nullable(),
  category: templateCategorySchema.default("general"),
  required_sections: z.array(z.string()).min(1, "Minimal 1 bagian wajib diperlukan"),
  section_order: z.array(z.string()),
  section_keywords: z.record(z.string(), z.array(z.string())).default({}),
  heading_structure: z.array(
    z.object({
      level: z.number().int().min(1).max(6),
      text: z.string(),
    })
  ).default([]),
  quality_score: z.number().min(0).max(100).default(0),
})

export type CreateTemplateInput = z.infer<typeof createTemplateSchema>

// ─── Update Template ────────────────────────────────────────────────────────

export const updateTemplateSchema = z.object({
  name: z
    .string()
    .min(3, "Nama template minimal 3 karakter")
    .max(100, "Nama template maksimal 100 karakter")
    .trim()
    .optional(),
  publisher: z.string().max(200).trim().optional().nullable(),
  description: z.string().max(500).trim().optional().nullable(),
  category: templateCategorySchema.optional(),
})

export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>

// ─── Create Version ─────────────────────────────────────────────────────────

export const createVersionSchema = z.object({
  version_name: z
    .string()
    .min(1, "Nama versi tidak boleh kosong")
    .max(100)
    .trim(),
  version_number: z
    .string()
    .min(1, "Nomor versi tidak boleh kosong")
    .max(20)
    .trim(),
  notes: z.string().max(500).trim().optional().nullable(),
  section_snapshot: z.array(z.string()).default([]),
})

export type CreateVersionInput = z.infer<typeof createVersionSchema>

// ─── Search Params ──────────────────────────────────────────────────────────

export const templateSearchSchema = z.object({
  query: z.string().max(200).optional(),
  category: templateCategorySchema.optional(),
  sort: z.enum(["newest", "oldest", "name-asc", "name-desc", "quality-desc"]).default("newest"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
})
