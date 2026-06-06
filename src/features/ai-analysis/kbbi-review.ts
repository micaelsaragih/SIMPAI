import { KBBI_INSTRUCTION } from "@/services/ai/prompts/kbbi-prompt"
import type { ParsedDocument } from "@/types/analysis"

export function getKbbiReviewPrompt(document: ParsedDocument): string {
  const sampleText = document.rawText ? document.rawText.substring(0, 15000) : ""

  return `
=== BAGIAN 4: TINJAUAN KBBI (EJAAN BAKU) ===
${KBBI_INSTRUCTION}

Teks Naskah untuk Pemeriksaan KBBI:
"""
${sampleText}
"""
`
}
