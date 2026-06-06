import type { ParsedDocument } from "@/types/analysis"

export function getClarityReviewPrompt(document: ParsedDocument): string {
  const sampleText = document.rawText ? document.rawText.substring(0, 15000) : ""

  return `
=== BAGIAN 6: TINJAUAN KEJELASAN (CLARITY REVIEW) ===
Evaluasilah draf naskah dari segi keterbacaan, kejelasan ide, dan kelancaran alur pemikiran.
Identifikasi kalimat-kalimat yang terlalu panjang/rumit (run-on sentences), membingungkan, atau menggunakan frasa bertele-tele yang mengaburkan pesan ilmiah.
Rekomendasikan kalimat yang lebih ringkas dan tajam.

Teks Naskah untuk Pemeriksaan Kejelasan:
"""
${sampleText}
"""
`
}
