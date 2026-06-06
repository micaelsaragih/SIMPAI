/**
 * API Route: POST /api/analysis/parse
 *
 * Accepts a DOCX file upload, validates it, parses it using mammoth,
 * and returns structured document data (ParsedDocument).
 *
 * - Requires authentication (Supabase session check)
 * - Max file size: 20MB
 * - Accepted format: DOCX only
 * - No permanent file storage
 */

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/services/supabase/server"
import { parseDocx } from "@/services/document/docx-parser"
import { ANALYSIS_FILE_CONSTRAINTS } from "@/lib/validators/analysis"
import type { ParseApiResponse } from "@/types/analysis"

export async function POST(request: NextRequest): Promise<NextResponse<ParseApiResponse>> {
  try {
    // 1. Authentication check
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Anda harus login untuk menggunakan fitur ini." },
        { status: 401 }
      )
    }

    // 2. Extract file from form data
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File wajib diunggah." },
        { status: 400 }
      )
    }

    // 3. Validate file size
    if (file.size > ANALYSIS_FILE_CONSTRAINTS.maxSizeBytes) {
      return NextResponse.json(
        {
          success: false,
          error: `Ukuran file terlalu besar. Maksimal ${ANALYSIS_FILE_CONSTRAINTS.maxSizeMB} MB.`,
        },
        { status: 400 }
      )
    }

    // 4. Validate file type
    const isValidType = file.type === ANALYSIS_FILE_CONSTRAINTS.acceptedMimeType
    const isValidExtension = file.name.toLowerCase().endsWith(".docx")

    if (!isValidType && !isValidExtension) {
      return NextResponse.json(
        { success: false, error: "Format file tidak didukung. Gunakan file DOCX." },
        { status: 400 }
      )
    }

    // 5. Read file buffer and parse
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const parsedDocument = await parseDocx(buffer)

    return NextResponse.json({ success: true, data: parsedDocument })
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Dokumen tidak dapat diproses."

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
