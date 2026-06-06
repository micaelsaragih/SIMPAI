/**
 * API Route: /api/templates
 * Handles listing and creating journal templates.
 */

import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/services/supabase/server"
import { templateSearchSchema, createTemplateSchema } from "@/features/template-intelligence/validators/template-validator"
import { getTemplates, createTemplate } from "@/features/template-intelligence/services/template-service"
import type { TemplateCreateInput } from "@/features/template-intelligence/types"

// ─── GET /api/templates ─────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Autentikasi diperlukan." },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const parsed = templateSearchSchema.safeParse({
      query: searchParams.get("q") || undefined,
      category: searchParams.get("category") || undefined,
      sort: searchParams.get("sort") || undefined,
      page: searchParams.get("page") || undefined,
      limit: searchParams.get("limit") || undefined,
    })

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Parameter pencarian tidak valid.", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const result = await getTemplates(parsed.data, user.id)
    return NextResponse.json(result)
  } catch (error) {
    console.error("[API] GET /api/templates error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal mengambil daftar template." },
      { status: 500 }
    )
  }
}

// ─── POST /api/templates ────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Autentikasi diperlukan." },
        { status: 401 }
      )
    }

    const body = await request.json()
    const parsed = createTemplateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Data template tidak valid.", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const input: TemplateCreateInput = {
      name: parsed.data.name,
      publisher: parsed.data.publisher ?? undefined,
      description: parsed.data.description ?? undefined,
      category: parsed.data.category,
      required_sections: parsed.data.required_sections,
      section_order: parsed.data.section_order,
      section_keywords: parsed.data.section_keywords,
      heading_structure: parsed.data.heading_structure,
      quality_score: parsed.data.quality_score,
    }

    const template = await createTemplate(input, user.id)

    return NextResponse.json(
      { success: true, templateId: template.id, template },
      { status: 201 }
    )
  } catch (error) {
    console.error("[API] POST /api/templates error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal membuat template." },
      { status: 500 }
    )
  }
}
