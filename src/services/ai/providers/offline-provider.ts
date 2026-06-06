import { IAIProvider, AnalysisRequest, AnalysisResponse, LanguageIssue, AIRecommendation } from "../types"
import type { StructureAnalysis, ComplianceResult, SectionDetection } from "@/features/analysis-engine/types"

export class OfflineAIProvider implements IAIProvider {
  name = "Offline Heuristic Engine"

  async analyzeArticle(request: AnalysisRequest): Promise<AnalysisResponse> {
    const { articleText, config = {} } = request

    // Extract pre-computed rule-based results passed via config
    const structure = config.structure as StructureAnalysis | undefined
    const compliance = config.compliance as ComplianceResult | null | undefined

    const recommendations: AIRecommendation[] = []
    const languageIssues: LanguageIssue[] = []

    // 1. Structure Recommendations
    if (structure) {
      const missingSections = structure.missing || []
      const partialSections = structure.partial || []

      missingSections.forEach((section: string) => {
        const label = this.getSectionLabel(section)
        recommendations.push({
          category: "structure",
          priority: 1,
          title: `Tambahkan Bagian "${label}"`,
          description: `Bagian "${label}" tidak terdeteksi pada naskah draft artikel Anda. Bagian ini merupakan pilar wajib dalam struktur penulisan artikel ilmiah standar internasional.`,
          suggestedFix: `Buat heading baru dengan nama "${label}" di lokasi yang logis dan jabarkan isi kajian riset Anda secara akademis.`
        })
      })

      partialSections.forEach((section: string) => {
        const label = this.getSectionLabel(section)
        recommendations.push({
          category: "structure",
          priority: 2,
          title: `Kembangkan Konten Bagian "${label}"`,
          description: `Bagian "${label}" terdeteksi, namun isinya tergolong sangat singkat. Konten akademis yang terlalu ringkas mengurangi tingkat kedalaman kajian artikel Anda.`,
          suggestedFix: `Tambahkan minimal 1-2 paragraf lagi untuk memperjelas pembahasan pada bagian "${label}". Masukkan data pendukung, alur pemikiran kritis, atau pustaka acuan.`
        })
      })
    }

    // 2. Compliance Recommendations (if template-based)
    if (compliance) {
      const missingTemplate = compliance.missing || []
      const orderIssues = compliance.orderIssues || []
      const extraSections = compliance.extra || []

      missingTemplate.forEach((section: string) => {
        recommendations.push({
          category: "compliance",
          priority: 2,
          title: `Sesuaikan Struktur Template: Tambah "${section}"`,
          description: `Template jurnal target mensyaratkan adanya bagian "${section}", namun bagian ini belum terdeteksi dalam draf naskah Anda.`,
          suggestedFix: `Sisipkan heading "${section}" sesuai dengan letak yang dideklarasikan oleh dokumen template rujukan.`
        })
      })

      orderIssues.forEach((issue: { section: string; expectedPosition: number; actualPosition: number }) => {
        recommendations.push({
          category: "compliance",
          priority: 3,
          title: `Perbaiki Urutan Bagian: "${issue.section}"`,
          description: `Bagian "${issue.section}" diletakkan pada posisi ke-${issue.actualPosition} di naskah Anda, sedangkan template jurnal mensyaratkan bagian tersebut berada di posisi ke-${issue.expectedPosition}.`,
          suggestedFix: `Pindahkan secara utuh heading "${issue.section}" beserta paragraf isinya ke urutan ke-${issue.expectedPosition} agar memenuhi sistematika kelogisan template jurnal target.`
        })
      })

      extraSections.forEach((section: string) => {
        recommendations.push({
          category: "compliance",
          priority: 4,
          title: `Tinjau Bagian Tambahan: "${section}"`,
          description: `Heading "${section}" ditemukan pada draf naskah Anda, namun template jurnal acuan tidak memuat bagian ini dalam ketentuannya.`,
          suggestedFix: `Evaluasi apakah bagian "${section}" ini memang relevan untuk diletakkan sebagai sub-bagian independen. Jika tidak, gabungkan kontennya ke bagian utama yang relevan atau hapus bagian tersebut.`
        })
      })
    }

    // 3. Academic Style Checks (Heuristic Fallback)
    const wordCount = articleText.split(/\s+/).length
    if (wordCount < 1000) {
      recommendations.push({
        category: "academic",
        priority: 3,
        title: "Perluas Cakupan Naskah",
        description: "Jumlah kata draf artikel ilmiah Anda di bawah 1.000 kata. Artikel jurnal riset umumnya memiliki panjang berkisar antara 3.000 hingga 7.000 kata untuk dapat mengulas permasalahan secara mendalam.",
        suggestedFix: "Perdalam pembahasan hasil penelitian Anda, tambahkan kerangka teoritis di pendahuluan, serta jabarkan analisis komparatif dengan studi terdahulu."
      })
    }

    // Heuristics for Title & References
    if (articleText.toLowerCase().includes("mendeley") || articleText.toLowerCase().includes("zotero")) {
      // already uses reference manager
    } else {
      recommendations.push({
        category: "academic",
        priority: 5,
        title: "Gunakan Manajer Referensi",
        description: "Tidak terdeteksi adanya tanda penggunaan reference manager pada sitasi atau daftar pustaka Anda.",
        suggestedFix: "Gunakan aplikasi manajer referensi seperti Mendeley, Zotero, atau EndNote untuk mengelola kutipan dan daftar pustaka agar terhindar dari ketidaksesuaian penulisan."
      })
    }

    // 4. Indonesian Informal/Non-Standard Word Scanner
    const informalWordsMap = [
      { regex: /\bsaya\b/gi, replacement: "penulis / peneliti", type: "informal" as const },
      { regex: /\baku\b/gi, replacement: "penulis", type: "informal" as const },
      { regex: /\bbisa\b/gi, replacement: "dapat", type: "non-standard" as const },
      { regex: /\bbuat\b/gi, replacement: "membuat / bagi", type: "non-standard" as const },
      { regex: /\bkarna\b/gi, replacement: "karena", type: "non-standard" as const },
      { regex: /\btapi\b/gi, replacement: "namun / tetapi", type: "non-standard" as const },
      { regex: /\bkasih\b/gi, replacement: "memberikan / memberi", type: "non-standard" as const },
      { regex: /\bbanget\b/gi, replacement: "sangat", type: "informal" as const },
      { regex: /\bgimana\b/gi, replacement: "bagaimana", type: "informal" as const },
      { regex: /\bdapet\b/gi, replacement: "mendapatkan", type: "non-standard" as const },
      { regex: /\bnulis\b/gi, replacement: "menulis", type: "non-standard" as const },
      { regex: /\bkami\b/gi, replacement: "penulis", type: "informal" as const },
      { regex: /\bkita\b/gi, replacement: "peneliti", type: "informal" as const }
    ]

    let issueCount = 0
    const maxIssues = 15

    for (const rule of informalWordsMap) {
      if (issueCount >= maxIssues) break

      let match
      // Find all occurrences of the pattern
      const regexGlobal = new RegExp(rule.regex.source, "gi")
      while ((match = regexGlobal.exec(articleText)) !== null) {
        if (issueCount >= maxIssues) break

        const index = match.index
        const matchedWord = match[0]

        // Extract context (35 chars before and after)
        const start = Math.max(0, index - 35)
        const end = Math.min(articleText.length, index + matchedWord.length + 35)
        let contextSnippet = articleText.substring(start, end).replace(/\n/g, " ")

        // Clean up boundary snippets
        if (start > 0) contextSnippet = "..." + contextSnippet
        if (end < articleText.length) contextSnippet = contextSnippet + "..."

        languageIssues.push({
          word: matchedWord,
          type: rule.type,
          suggestion: rule.replacement,
          context: contextSnippet
        })

        issueCount++
      }
    }

    // Add generalized language recommendation if issues are found
    if (languageIssues.length > 0) {
      recommendations.push({
        category: "language",
        priority: 3,
        title: "Perbaiki Kosakata Non-Akademis",
        description: `Ditemukan ${languageIssues.length} kata tidak baku atau informal (seperti "${languageIssues[0].word}") dalam draf artikel ilmiah Anda. Karya tulis ilmiah harus menggunakan bahasa formal/baku.`,
        suggestedFix: "Gunakan pencarian (Ctrl+F) untuk menemukan kata informal tersebut dan ganti dengan opsi akademis baku yang disarankan pada daftar analisis bahasa."
      })
    }

    // 5. Structure Status Map
    const structureResult = structure
      ? structure.sections.map((sec: SectionDetection) => ({
          section: sec.label,
          status: sec.status.toLowerCase() as "found" | "missing" | "incomplete",
          feedback: sec.status === "FOUND"
            ? "Bagian teridentifikasi dengan baik."
            : sec.status === "PARTIAL"
            ? "Materi terdeteksi namun isinya kurang mendalam."
            : "Bagian penting ini belum tercantum."
        }))
      : []

    // 6. Compliance Result Map
    const complianceResult = compliance
      ? {
          score: compliance.compliance,
          missingSections: compliance.missing,
          wrongOrder: compliance.orderIssues.map((issue: { section: string; expectedPosition: number; actualPosition: number }) => ({
            section: issue.section,
            expectedIndex: issue.expectedPosition - 1,
            actualIndex: issue.actualPosition - 1
          })),
          additionalSections: compliance.extra
        }
      : {
          score: 100,
          missingSections: [],
          wrongOrder: [],
          additionalSections: []
        }

    // Calculate dynamic scores based on findings
    const structureScore = structure ? structure.completeness : 0
    const complianceScore = complianceResult.score
    const languageScore = Math.max(0, 100 - languageIssues.length * 5)
    
    // Total score (Structure: 35%, Compliance: 35%, Language: 30%)
    const finalScore = Math.round(
      structureScore * 0.35 +
      complianceScore * 0.35 +
      languageScore * 0.30
    )

    return {
      score: finalScore,
      structure: structureResult,
      compliance: complianceResult,
      language: languageIssues,
      recommendations
    }
  }

  private getSectionLabel(sectionType: string): string {
    const labels: Record<string, string> = {
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
    return labels[sectionType] || sectionType
  }
}
