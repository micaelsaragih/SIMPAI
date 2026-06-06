import { NextResponse } from "next/server"
import { createClient } from "@/services/supabase/server"
import { runFullEvaluation } from "@/features/evaluation/services/evaluation-service"
import { generateEvaluationReport } from "@/features/evaluation/reporters/report-generator"

export async function POST(): Promise<NextResponse> {
  try {
    // 1. Session Authentication Check
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

    // 2. Run the full evaluation suite
    const report = runFullEvaluation()
    const markdownReport = generateEvaluationReport(report)

    // 3. Return report data + markdown string
    return NextResponse.json({
      success: true,
      data: report,
      markdown: markdownReport
    })

  } catch (error: unknown) {
    console.error("Evaluation Route error:", error)
    const errorMsg = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      {
        success: false,
        error: "Gagal menjalankan evaluasi sistem.",
        details: errorMsg
      },
      { status: 500 }
    )
  }
}
