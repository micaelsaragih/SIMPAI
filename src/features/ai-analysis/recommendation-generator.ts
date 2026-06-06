import { RECOMMENDATION_INSTRUCTION } from "@/services/ai/prompts/recommendation-prompt"
import type { ParsedDocument } from "@/types/analysis"

export function getRecommendationGeneratorPrompt(document: ParsedDocument): string {
  return `
=== BAGIAN 7: REKOMENDASI UTAMA ===
${RECOMMENDATION_INSTRUCTION}

Konteks Dokumen:
- Judul: "${document.title}"
- Jumlah Kata: ${document.statistics.wordCount}
- Jumlah Seksi: ${document.statistics.sectionCount}
`
}
