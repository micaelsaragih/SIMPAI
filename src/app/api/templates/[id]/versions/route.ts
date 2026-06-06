/**
 * API Route: /api/templates/[id]/versions
 * Handles version history retrieval and creation for a template.
 */

import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/services/supabase/server"
import { createVersionSchema } from "@/features/template-intelligence/validators/template-validator"
import {
  getTemplateVersions,
  createVersion,
} from "@/features/template-intelligence/services/template-service"

interface RouteContext {
  params: Promise<{ id: string }>
}

// ─── GET /api/templates/[id]/versions ───────────────────────────────────────

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

    const versions = await getTemplateVersions(id)
    return NextResponse.json({ versions })
  } catch (error) {
    console.error("[API] GET /api/templates/[id]/versions error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal mengambil versi template." },
      { status: 500 }
    )
  }
}

// ─── POST /api/templates/[id]/versions ──────────────────────────────────────

export async function POST(request: NextRequest, context: RouteContext) {
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
    const parsed = createVersionSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Data versi tidak valid.", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const version = await createVersion(id, parsed.data, user.id)

    return NextResponse.json(
      { success: true, version },
      { status: 201 }
    )
  } catch (error) {
    console.error("[API] POST /api/templates/[id]/versions error:", error)
    const status = error instanceof Error && error.message.includes("akses") ? 403 : 500
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal membuat versi template." },
      { status }
    )
  }
}
