/**
 * Template Intelligence Service — handles CRUD operations for journal templates.
 * Uses Supabase server client for all database interactions.
 */

import { createClient } from "@/services/supabase/server"
import type { JournalTemplate, TemplateVersion } from "@/types/database"
import type { TemplateListItem, TemplateSearchParams, TemplateListResponse } from "@/types/template"
import { SLUG_MAX_LENGTH, DEFAULT_PAGE_SIZE } from "../constants"
import type { TemplateCreateInput, TemplateUpdateInput, VersionCreateInput } from "../types"

// ─── Slug Utility ───────────────────────────────────────────────────────────

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, SLUG_MAX_LENGTH)
    .replace(/^-|-$/g, "")
}

async function ensureUniqueSlug(slug: string): Promise<string> {
  const supabase = await createClient()
  const { data } = await supabase
    .from("journal_templates")
    .select("slug")
    .like("slug", `${slug}%`)

  if (!data || data.length === 0) return slug

  const existingSlugs = new Set(data.map((d) => d.slug))
  if (!existingSlugs.has(slug)) return slug

  let counter = 2
  while (existingSlugs.has(`${slug}-${counter}`)) {
    counter++
  }
  return `${slug}-${counter}`
}

// ─── Create Template ────────────────────────────────────────────────────────

export async function createTemplate(
  input: TemplateCreateInput,
  userId: string
): Promise<JournalTemplate> {
  const supabase = await createClient()
  const slug = await ensureUniqueSlug(generateSlug(input.name))

  const { data, error } = await supabase
    .from("journal_templates")
    .insert({
      name: input.name,
      slug,
      publisher: input.publisher ?? null,
      description: input.description ?? null,
      category: input.category,
      required_sections: input.required_sections,
      section_order: input.section_order,
      section_keywords: input.section_keywords,
      heading_structure: input.heading_structure,
      quality_score: input.quality_score,
      created_by: userId,
    })
    .select()
    .single()

  if (error) throw new Error(`Gagal membuat template: ${error.message}`)
  return data as JournalTemplate
}

// ─── Get Templates (List) ───────────────────────────────────────────────────

export async function getTemplates(
  params: TemplateSearchParams,
  userId: string
): Promise<TemplateListResponse> {
  const supabase = await createClient()
  const page = params.page ?? 1
  const limit = params.limit ?? DEFAULT_PAGE_SIZE
  const offset = (page - 1) * limit

  let query = supabase
    .from("journal_templates")
    .select("*", { count: "exact" })

  // Search filter
  if (params.query) {
    query = query.or(
      `name.ilike.%${params.query}%,publisher.ilike.%${params.query}%`
    )
  }

  // Category filter
  if (params.category) {
    query = query.eq("category", params.category)
  }

  // Sort
  switch (params.sort) {
    case "oldest":
      query = query.order("created_at", { ascending: true })
      break
    case "name-asc":
      query = query.order("name", { ascending: true })
      break
    case "name-desc":
      query = query.order("name", { ascending: false })
      break
    case "quality-desc":
      query = query.order("quality_score", { ascending: false })
      break
    case "newest":
    default:
      query = query.order("created_at", { ascending: false })
      break
  }

  // Pagination
  query = query.range(offset, offset + limit - 1)

  const { data, error, count } = await query

  if (error) throw new Error(`Gagal mengambil daftar template: ${error.message}`)

  // Get version counts for each template
  const templateIds = (data || []).map((t) => t.id)
  let versionCounts: Record<string, number> = {}

  if (templateIds.length > 0) {
    const { data: versions } = await supabase
      .from("template_versions")
      .select("template_id")
      .in("template_id", templateIds)

    if (versions) {
      versionCounts = versions.reduce<Record<string, number>>((acc, v) => {
        acc[v.template_id] = (acc[v.template_id] || 0) + 1
        return acc
      }, {})
    }
  }

  const templates: TemplateListItem[] = (data || []).map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    publisher: t.publisher,
    category: t.category as TemplateListItem["category"],
    sectionCount: Array.isArray(t.required_sections) ? t.required_sections.length : 0,
    qualityScore: t.quality_score ?? 0,
    versionCount: versionCounts[t.id] || 0,
    createdAt: t.created_at,
    isOwner: t.created_by === userId,
  }))

  return {
    templates,
    total: count ?? 0,
    page,
    limit,
  }
}

// ─── Get Template By ID ─────────────────────────────────────────────────────

export async function getTemplateById(
  id: string,
  userId: string
): Promise<{ template: JournalTemplate; versions: TemplateVersion[]; isOwner: boolean } | null> {
  const supabase = await createClient()

  const { data: template, error } = await supabase
    .from("journal_templates")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !template) return null

  const { data: versions } = await supabase
    .from("template_versions")
    .select("*")
    .eq("template_id", id)
    .order("created_at", { ascending: false })

  return {
    template: template as JournalTemplate,
    versions: (versions || []) as TemplateVersion[],
    isOwner: template.created_by === userId,
  }
}

// ─── Update Template ────────────────────────────────────────────────────────

export async function updateTemplate(
  id: string,
  input: TemplateUpdateInput,
  userId: string
): Promise<JournalTemplate> {
  const supabase = await createClient()

  // Verify ownership
  const { data: existing } = await supabase
    .from("journal_templates")
    .select("created_by")
    .eq("id", id)
    .single()

  if (!existing || existing.created_by !== userId) {
    throw new Error("Anda tidak memiliki akses untuk mengubah template ini.")
  }

  const updateData: Record<string, unknown> = {}
  if (input.name !== undefined) updateData.name = input.name
  if (input.publisher !== undefined) updateData.publisher = input.publisher
  if (input.description !== undefined) updateData.description = input.description
  if (input.category !== undefined) updateData.category = input.category

  const { data, error } = await supabase
    .from("journal_templates")
    .update(updateData)
    .eq("id", id)
    .select()
    .single()

  if (error) throw new Error(`Gagal memperbarui template: ${error.message}`)
  return data as JournalTemplate
}

// ─── Delete Template ────────────────────────────────────────────────────────

export async function deleteTemplate(id: string, userId: string): Promise<void> {
  const supabase = await createClient()

  // Verify ownership
  const { data: existing } = await supabase
    .from("journal_templates")
    .select("created_by")
    .eq("id", id)
    .single()

  if (!existing || existing.created_by !== userId) {
    throw new Error("Anda tidak memiliki akses untuk menghapus template ini.")
  }

  const { error } = await supabase
    .from("journal_templates")
    .delete()
    .eq("id", id)

  if (error) throw new Error(`Gagal menghapus template: ${error.message}`)
}

// ─── Create Version ─────────────────────────────────────────────────────────

export async function createVersion(
  templateId: string,
  input: VersionCreateInput,
  userId: string
): Promise<TemplateVersion> {
  const supabase = await createClient()

  // Verify template ownership
  const { data: template } = await supabase
    .from("journal_templates")
    .select("created_by")
    .eq("id", templateId)
    .single()

  if (!template || template.created_by !== userId) {
    throw new Error("Anda tidak memiliki akses untuk membuat versi pada template ini.")
  }

  const { data, error } = await supabase
    .from("template_versions")
    .insert({
      template_id: templateId,
      version_name: input.version_name,
      version_number: input.version_number,
      notes: input.notes ?? null,
      section_snapshot: input.section_snapshot,
      created_by: userId,
    })
    .select()
    .single()

  if (error) throw new Error(`Gagal membuat versi: ${error.message}`)
  return data as TemplateVersion
}

// ─── Get Versions ───────────────────────────────────────────────────────────

export async function getTemplateVersions(templateId: string): Promise<TemplateVersion[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("template_versions")
    .select("*")
    .eq("template_id", templateId)
    .order("created_at", { ascending: false })

  if (error) throw new Error(`Gagal mengambil versi template: ${error.message}`)
  return (data || []) as TemplateVersion[]
}

// ─── Search Templates ───────────────────────────────────────────────────────

export async function searchTemplates(
  query: string,
  userId: string,
  limit: number = 10
): Promise<TemplateListItem[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("journal_templates")
    .select("*")
    .or(`name.ilike.%${query}%,publisher.ilike.%${query}%`)
    .order("quality_score", { ascending: false })
    .limit(limit)

  if (error) throw new Error(`Gagal mencari template: ${error.message}`)

  return (data || []).map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    publisher: t.publisher,
    category: t.category as TemplateListItem["category"],
    sectionCount: Array.isArray(t.required_sections) ? t.required_sections.length : 0,
    qualityScore: t.quality_score ?? 0,
    versionCount: 0, // Not needed for search results
    createdAt: t.created_at,
    isOwner: t.created_by === userId,
  }))
}
