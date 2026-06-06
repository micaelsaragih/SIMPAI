import type { ParsedDocument } from "@/types/analysis"

export function getAcademicLanguageReviewPrompt(document: ParsedDocument): string {
  // Extract a text sample for lexical style checks (up to 15000 characters)
  const sampleText = document.rawText ? document.rawText.substring(0, 15000) : ""

  return `
=== BAGIAN 2: EVALUASI BAHASA AKADEMIK ===
Analisislah bahasa akademik draf naskah. Periksalah apakah pilihan kata yang digunakan sudah bersifat formal, objektif, dan sesuai dengan standar penulisan artikel ilmiah Indonesia. 
Laporkan temuan kata yang terlalu kasual/sederhana dan berikan saran padanan kata yang lebih formal (misal: "sangat banyak" -> "signifikan/melimpah").

Teks Sampel Naskah:
"""
${sampleText}
"""
`
}
