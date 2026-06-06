import { IAIProvider, AnalysisRequest, AnalysisResponse } from "../types"
import type { StructureAnalysis, ComplianceResult } from "@/features/analysis-engine/types"

export class DeepSeekAIProvider implements IAIProvider {
  name = "DeepSeek"

  async analyzeArticle(request: AnalysisRequest): Promise<AnalysisResponse> {
    const apiKey = process.env.DEEPSEEK_API_KEY
    if (!apiKey) {
      throw new Error("DeepSeek API key is not configured in environment variables.")
    }

    const { articleText, templateText, config = {} } = request
    const structure = config.structure as StructureAnalysis | undefined
    const compliance = config.compliance as ComplianceResult | null | undefined

    const truncatedArticleText = articleText.substring(0, 15000)
    const truncatedTemplateText = templateText ? templateText.substring(0, 10000) : ""

    const systemPrompt = `Anda adalah editor jurnal ilmiah dan reviewer di SIMPAI.
Tugas Anda adalah meninjau artikel riset berdasarkan kriteria akademik formal.
Output Anda wajib berupa objek JSON murni sesuai format ini:
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
    { "category": "structure", "priority": 1, "title": "Tambahkan Abstrak", "description": "Abstrak riset tidak ditemukan.", "suggestedFix": "Tulis abstrak ringkas." }
  ]
}

Aturan Pencegahan Halusinasi:
- Hanya rujuk data dari draf dokumen artikel pengguna.
- Jangan mengarang sitasi, DOI, atau jurnal yang tidak ada.`

    const userPrompt = `
DRAF ARTIKEL PENELITIAN:
${truncatedArticleText}

TEMPLATE JURNAL RUJUKAN:
${truncatedTemplateText || "Tidak ada (Draft-Only Mode)"}

PRE-ANALISIS STRUKTUR & KEPATUHAN BERBASIS ATURAN LOCAL:
${JSON.stringify({ structure, compliance }, null, 2)}

Evaluasi naskah di atas dan kembalikan JSON.
`

    try {
      const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ]
        })
      })

      if (!response.ok) {
        throw new Error(`DeepSeek API responded with status ${response.status}`)
      }

      const responseData = await response.json()
      const content = responseData.choices?.[0]?.message?.content

      if (!content) {
        throw new Error("Empty response from DeepSeek API.")
      }

      return this.parseJSONResponse(content)
    } catch (err) {
      console.error("DeepSeek API request failed:", err)
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
      console.error("Failed to parse JSON response from DeepSeek:", text, err)
      throw new Error("Gagal mengurai respon analisis dari DeepSeek.")
    }
  }
}
