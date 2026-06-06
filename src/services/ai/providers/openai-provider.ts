import { IAIProvider, AnalysisRequest, AnalysisResponse } from "../types"
import type { StructureAnalysis, ComplianceResult } from "@/features/analysis-engine/types"

export class OpenAIProvider implements IAIProvider {
  name = "OpenAI"

  async analyzeArticle(request: AnalysisRequest): Promise<AnalysisResponse> {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error("OpenAI API key is not configured in environment variables.")
    }

    const { articleText, templateText, config = {} } = request
    const structure = config.structure as StructureAnalysis | undefined
    const compliance = config.compliance as ComplianceResult | null | undefined

    const truncatedArticleText = articleText.substring(0, 15000)
    const truncatedTemplateText = templateText ? templateText.substring(0, 10000) : ""

    const systemPrompt = `Anda adalah editor jurnal ilmiah dan reviewer di SIMPAI.
Tugas Anda adalah mengevaluasi kelayakan artikel ilmiah berdasarkan kaidah riset akademik formal.
Output Anda wajib berupa objek JSON murni tanpa hiasan markdown sesuai struktur ini:
{
  "score": 85,
  "structure": [
    { "section": "Judul", "status": "found", "feedback": "Judul artikel terstruktur dengan baik." }
  ],
  "compliance": {
    "score": 90,
    "missingSections": [],
    "wrongOrder": [],
    "additionalSections": []
  },
  "language": [
    { "word": "saya", "type": "informal", "suggestion": "penulis", "context": "...maka dari itu saya melakukan penelitian..." }
  ],
  "recommendations": [
    { "category": "structure", "priority": 1, "title": "Lengkapi Metodologi", "description": "Metodologi riset belum dijabarkan lengkap.", "suggestedFix": "Sebutkan teknik survei secara eksplisit." }
  ]
}

Aturan Ketat Pencegahan Halusinasi:
- Hanya periksa konten riset yang tertulis di draf dokumen pengguna.
- Jangan mengarang data referensi, DOI, atau jurnal yang tidak ada.`

    const userPrompt = `
DRAF ARTIKEL PENELITIAN:
${truncatedArticleText}

TEMPLATE JURNAL RUJUKAN:
${truncatedTemplateText || "Tidak ada (Draft-Only Mode)"}

PRE-ANALISIS STRUKTUR & KEPATUHAN BERBASIS ATURAN LOCAL:
${JSON.stringify({ structure, compliance }, null, 2)}

Evaluasi naskah di atas dan berikan JSON.
`

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ]
        })
      })

      if (!response.ok) {
        throw new Error(`OpenAI API responded with status ${response.status}`)
      }

      const responseData = await response.json()
      const content = responseData.choices?.[0]?.message?.content

      if (!content) {
        throw new Error("Empty response from OpenAI API.")
      }

      return this.parseJSONResponse(content)
    } catch (err) {
      console.error("OpenAI API request failed:", err)
      throw err
    }
  }

  private parseJSONResponse(text: string): AnalysisResponse {
    try {
      let cleaned = text.trim()
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```json\s*/i, "").replace(/```$/, "").trim()
      }

      const jsonStart = cleaned.indexOf("{")
      const jsonEnd = cleaned.lastIndexOf("}")

      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleaned = cleaned.substring(jsonStart, jsonEnd + 1)
      }

      return JSON.parse(cleaned) as AnalysisResponse
    } catch (err) {
      console.error("Failed to parse JSON response from OpenAI:", text, err)
      throw new Error("Gagal mengurai respon analisis dari OpenAI.")
    }
  }
}
