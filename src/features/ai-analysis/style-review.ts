import { STYLE_INSTRUCTION } from "@/services/ai/prompts/style-prompt"
import type { ParsedDocument } from "@/types/analysis"

export function getStyleReviewPrompt(document: ParsedDocument): string {
  const sampleText = document.rawText ? document.rawText.substring(0, 15000) : ""

  return `
=== BAGIAN 5: TINJAUAN GAYA BAHASA AKADEMIK ===
${STYLE_INSTRUCTION}

Teks Naskah untuk Pemeriksaan Gaya Bahasa:
"""
${sampleText}
"""
`
}
