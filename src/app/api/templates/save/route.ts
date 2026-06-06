/**
 * API Route: /api/templates/save
 * Saves a parsed document as a reusable template in the library.
 * Takes a ParsedDocument and runs the extraction + profiling pipeline.
 */

import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/services/supabase/server"
import { extractTemplateProfile } from "@/features/template-intelligence/extractor/template-extractor"
import { calculateTemplateQuality } from "@/features/template-intelligence/profiler/template-profiler"
import { createTemplate } from "@/features/template-intelligence/services/template-service"
import type { ParsedDocument } from "@/types/analysis"
import type { TemplateCategory } from "@/types/database"
import type { TemplateCreateInput } from "@/features/template-intelligence/types"

interface SaveTemplateBody {
  document: ParsedDocument
  name?: string
  publisher?: string
  description?: string
  category?: TemplateCategory
}

// ─── POST /api/templates/save ───────────────────────────────────────────────

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

    const body: SaveTemplateBody = await request.json()

    if (!body.document) {
      return NextResponse.json(
        { error: "Data dokumen diperlukan." },
        { status: 400 }
      )
    }

    // Step 1: Extract template profile from the parsed document
    const profile = extractTemplateProfile(body.document)

    // Step 2: Override with user-provided metadata if available
    if (body.name) profile.name = body.name
    if (body.publisher) profile.publisher = body.publisher
    if (body.description) profile.description = body.description
    if (body.category) profile.category = body.category

    // Step 3: Calculate quality metrics
    const quality = calculateTemplateQuality(profile)

    // Step 4: Build the create input
    const input: TemplateCreateInput = {
      name: profile.name,
      publisher: profile.publisher ?? undefined,
      description: profile.description ?? undefined,
      category: profile.category,
      required_sections: profile.requiredSections,
      section_order: profile.sectionOrder,
      section_keywords: profile.sectionKeywords,
      heading_structure: profile.headingStructure.map((h) => ({
        level: h.level,
        text: h.text,
      })),
      quality_score: quality.overallScore,
    }

    // Step 5: Save to database
    const template = await createTemplate(input, user.id)

    return NextResponse.json(
      {
        success: true,
        templateId: template.id,
        template,
        quality,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[API] POST /api/templates/save error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal menyimpan template." },
      { status: 500 }
    )
  }
}
