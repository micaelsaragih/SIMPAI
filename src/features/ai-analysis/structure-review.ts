import { STRUCTURE_ANALYSIS_INSTRUCTION } from "@/services/ai/prompts/analysis-prompt"
import type { ParsedDocument } from "@/types/analysis"

export function getStructureReviewPrompt(document: ParsedDocument): string {
  const headingsSummary = (document.headings || [])
    .slice(0, 20)
    .map(h => `Level ${h.level}: ${h.text}`)
    .join("\n")

  return `
=== BAGIAN 1: TINJAUAN STRUKTUR ===
${STRUCTURE_ANALYSIS_INSTRUCTION}

Konteks Draf Artikel Pengguna:
- Judul Dokumen: "${document.title}"
- Jumlah Heading Terdeteksi: ${document.statistics.headingCount}
- Jumlah Seksi/Bagian: ${document.statistics.sectionCount}
- Daftar Heading (20 Pertama):
${headingsSummary || "Tidak ada heading terdeteksi."}
`
}
