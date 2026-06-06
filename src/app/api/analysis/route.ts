import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/services/supabase/server"
import { analyzeStructure } from "@/features/analysis-engine/detectors/section-detector"
import { compareWithTemplate } from "@/features/analysis-engine/comparators/template-comparator"
import { calculateScore } from "@/features/analysis-engine/scorers/scoring-engine"
import { runAIAnalysis } from "@/services/ai/orchestrator"
import { AnalysisRequest } from "@/services/ai/types"
import type { AnalysisResult } from "@/features/analysis-engine/types"
import { analyzeLanguage } from "@/features/language-engine/services/language-analysis-service"
import { rateLimit } from "@/lib/rate-limiter"

export async function POST(request: NextRequest): Promise<NextResponse> {
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

    // 1.1 Rate Limiting Check (10 requests per minute per user)
    const rateLimitResult = await rateLimit(user.id, 10, 60 * 1000)
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Terlalu banyak permintaan analisis. Silakan coba lagi dalam ${rateLimitResult.reset} detik.` 
        },
        { 
          status: 429,
          headers: {
            "Retry-After": rateLimitResult.reset.toString(),
            "X-RateLimit-Limit": rateLimitResult.limit.toString(),
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          }
        }
      )
    }

    // 2. Parse request payload
    const body = await request.json()
    const { draftData, templateData } = body

    if (!draftData) {
      return NextResponse.json(
        { success: false, error: "Data draf artikel tidak lengkap." },
        { status: 400 }
      )
    }

    // 3. Query user's AI settings preference
    const { data: settings } = await supabase
      .from("user_settings")
      .select("preferred_ai_provider")
      .eq("user_id", user.id)
      .single()

    const preferredProvider = settings?.preferred_ai_provider || "openrouter"

    // 4. Run local deterministic evaluations
    const structure = analyzeStructure(draftData)
    let compliance = null
    if (templateData) {
      compliance = compareWithTemplate(draftData, templateData)
    }

    // 5. Invoke the AI Recommendation & Language Engine
    const aiRequest: AnalysisRequest = {
      articleText: draftData.rawText,
      templateText: templateData?.rawText || undefined,
      config: {
        structure,
        compliance,
        documentTitle: draftData.title,
        templateTitle: templateData?.title || null,
        headings: draftData.headings,
        sections: draftData.sections,
        paragraphs: draftData.paragraphs
      }
    }

    const aiResponse = await runAIAnalysis(aiRequest, preferredProvider)

    // 5.1 Run deterministic language engine
    const languageAnalysis = analyzeLanguage(draftData)
    const languageScore = languageAnalysis.score.finalScore

    // 6. Blended Scoring & Grading (Structure: 35%, Compliance: 35%, Language: 30%)
    const scoreResult = calculateScore(structure, compliance, languageScore)

    // 7. Compile text summary highlights
    const highlights: string[] = []
    const foundCount = structure.found.length + structure.partial.length + (structure.uncertain ? structure.uncertain.length : 0)
    highlights.push(
      `Artikel mengandung ${foundCount} dari ${structure.totalExpected} bagian akademik yang diharapkan.`
    )

    if (structure.missing.length > 0) {
      highlights.push(`Bagian wajib hilang: ${structure.missing.map(s => getLabel(s)).join(", ")}.`)
    }

    if (structure.uncertain && structure.uncertain.length > 0) {
      highlights.push(`Bagian diragukan (low confidence): ${structure.uncertain.map(s => getLabel(s)).join(", ")}.`)
    }

    if (compliance) {
      highlights.push(`Tingkat kesesuaian template: ${compliance.compliance}%.`)
      if (compliance.missing.length > 0) {
        highlights.push(`Template mensyaratkan bagian yang absen: ${compliance.missing.join(", ")}.`)
      }
      if (compliance.orderIssues.length > 0) {
        highlights.push(`Terdeteksi ${compliance.orderIssues.length} kesalahan tata letak urutan heading.`);
      }
    }

    if (languageAnalysis.summary.totalIssues > 0) {
      highlights.push(`Terdeteksi ${languageAnalysis.summary.totalIssues} catatan kebahasaan akademik (KBBI/PUEBI/Gaya Bahasa).`);
    } else {
      highlights.push("Kualitas tata bahasa akademik naskah dinilai sangat baik.");
    }

    highlights.push(`Skor akhir evaluasi: ${scoreResult.finalScore}/100 (${scoreResult.gradeLabel}).`)

    const result: AnalysisResult = {
      mode: templateData ? "template-based" : "draft-only",
      structure,
      compliance,
      score: scoreResult,
      summary: {
        text: highlights.join(" "),
        highlights
      },
      documentTitle: draftData.title || "Dokumen Tanpa Judul",
      documentStats: draftData.statistics,
      templateTitle: templateData?.title || null,
      analyzedAt: new Date().toISOString(),
      languageIssues: aiResponse.language,
      recommendations: aiResponse.recommendations,
      languageAnalysis,
      aiAnalysis: aiResponse.aiAnalysis || null,
      rejectedHeadings: draftData.rejectedHeadings || []
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error("Server API Analysis route failed:", error)
    const msg = error instanceof Error ? error.message : "Terjadi kesalahan sistem saat menganalisis dokumen."
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    )
  }
}

function getLabel(section: string): string {
  const map: Record<string, string> = {
    title: "Judul",
    abstract: "Abstrak",
    keywords: "Kata Kunci",
    introduction: "Pendahuluan",
    methodology: "Metodologi",
    results: "Hasil",
    discussion: "Pembahasan",
    conclusion: "Kesimpulan",
    references: "Daftar Pustaka"
  }
  return map[section] || section
}
