/**
 * API Route: /api/templates/[id]
 * Handles single template operations: get, update, delete.
 */

import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/services/supabase/server"
import { updateTemplateSchema } from "@/features/template-intelligence/validators/template-validator"
import {
  getTemplateById,
  updateTemplate,
  deleteTemplate,
} from "@/features/template-intelligence/services/template-service"

interface RouteContext {
  params: Promise<{ id: string }>
}

// ─── GET /api/templates/[id] ────────────────────────────────────────────────

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
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

    const result = await getTemplateById(id, user.id)

    if (!result) {
      return NextResponse.json(
        { error: "Template tidak ditemukan." },
        { status: 404 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[API] GET /api/templates/[id] error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal mengambil detail template." },
      { status: 500 }
    )
  }
}

// ─── PATCH /api/templates/[id] ──────────────────────────────────────────────

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
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
    const parsed = updateTemplateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Data pembaruan tidak valid.", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const template = await updateTemplate(id, parsed.data, user.id)

    return NextResponse.json({ success: true, template })
  } catch (error) {
    console.error("[API] PATCH /api/templates/[id] error:", error)
    const status = error instanceof Error && error.message.includes("akses") ? 403 : 500
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal memperbarui template." },
      { status }
    )
  }
}

// ─── DELETE /api/templates/[id] ─────────────────────────────────────────────

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params
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

    await deleteTemplate(id, user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] DELETE /api/templates/[id] error:", error)
    const status = error instanceof Error && error.message.includes("akses") ? 403 : 500
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal menghapus template." },
      { status }
    )
  }
}
