import { PUEBI_INSTRUCTION } from "@/services/ai/prompts/puebi-prompt"
import type { ParsedDocument } from "@/types/analysis"

export function getPuebiReviewPrompt(document: ParsedDocument): string {
  const sampleText = document.rawText ? document.rawText.substring(0, 15000) : ""

  return `
=== BAGIAN 3: TINJAUAN PUEBI / EYD ===
${PUEBI_INSTRUCTION}

Teks Naskah untuk Pemeriksaan PUEBI:
"""
${sampleText}
"""
`
}
