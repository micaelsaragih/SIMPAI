import { getStructureReviewPrompt } from "./structure-review"
import { getAcademicLanguageReviewPrompt } from "./academic-language-review"
import { getPuebiReviewPrompt } from "./puebi-review"
import { getKbbiReviewPrompt } from "./kbbi-review"
import { getStyleReviewPrompt } from "./style-review"
import { getClarityReviewPrompt } from "./clarity-review"
import { getRecommendationGeneratorPrompt } from "./recommendation-generator"
import type { ParsedDocument } from "@/types/analysis"

export function compileUnifiedAIPrompt(document: ParsedDocument): string {
  return `
Lakukan tinjauan menyeluruh terhadap draf artikel ilmiah di bawah ini menggunakan 7 modul analisis:

${getStructureReviewPrompt(document)}

${getAcademicLanguageReviewPrompt(document)}

${getPuebiReviewPrompt(document)}

${getKbbiReviewPrompt(document)}

${getStyleReviewPrompt(document)}

${getClarityReviewPrompt(document)}

${getRecommendationGeneratorPrompt(document)}

PENTING: Anda harus merangkum seluruh hasil evaluasi di atas ke dalam format JSON yang valid dan tepat sesuai spesifikasi skema berikut:

{
  "summary": "Ringkasan temuan utama artikel (1-2 paragraf pendek)",
  "overallScore": 85, // Nilai kelayakan akademik artikel dari skala 0-100
  "strengths": [
    "Kekuatan 1 dari penulisan naskah...",
    "Kekuatan 2..."
  ],
  "weaknesses": [
    "Kelemahan 1 dari penulisan naskah...",
    "Kelemahan 2..."
  ],
  "structureReview": [
    {
      "finding": "Nama bagian (misal: Abstrak) terdeteksi terlalu pendek atau tidak proporsional",
      "severity": "low" | "medium" | "high",
      "suggestedRevision": "Deskripsi detail cara memperluas bagian tersebut",
      "exampleCorrection": "Teks contoh tambahan yang disarankan"
    }
  ],
  "languageReview": [
    {
      "finding": "Ditemukan kalimat pasif yang kurang efektif",
      "severity": "low" | "medium" | "high",
      "suggestedRevision": "Ubah menjadi struktur kalimat baku yang disarankan",
      "exampleCorrection": "Sebelum: ... | Sesudah: ..."
    }
  ],
  "puebiReview": [
    {
      "finding": "Kesalahan tanda baca koma setelah konjungsi antar-kalimat",
      "severity": "low" | "medium" | "high",
      "suggestedRevision": "Gunakan koma setelah konjungsi seperti 'Namun,' dan 'Oleh karena itu,'",
      "exampleCorrection": "Namun kita harus... -> Namun, kita harus..."
    }
  ],
  "kbbiReview": [
    {
      "finding": "Kata tidak baku 'karna' digunakan sebanyak 3 kali",
      "severity": "low" | "medium" | "high",
      "suggestedRevision": "Ganti dengan kata baku 'karena'",
      "exampleCorrection": "karna -> karena"
    }
  ],
  "styleReview": [
    {
      "finding": "Penggunaan sudut pandang orang pertama 'kami melakukan'",
      "severity": "low" | "medium" | "high",
      "suggestedRevision": "Ubah menjadi pasif atau sudut pandang orang ketiga",
      "exampleCorrection": "kami melakukan pengujian -> pengujian dilakukan oleh peneliti"
    }
  ],
  "recommendations": [
    {
      "category": "structure" | "language" | "compliance" | "academic",
      "priority": 1 | 2 | 3 | 4 | 5,
      "title": "Gunakan Kata Baku KBBI",
      "description": "Naskah ilmiah menuntut penulisan formal sesuai ejaan bahasa Indonesia resmi.",
      "suggestedFix": "Ganti seluruh kata tidak baku seperti tapi, karna, dapet, buat."
    }
  ]
}

Aturan Penulisan Respon:
1. Kembalikan respon hanya dalam bentuk string JSON valid tanpa ditutup blok kode markdown (\`\`\`json).
2. Jawaban dilarang keras memuat data fiktif atau halusinasi sitasi.
3. Gunakan bahasa Indonesia akademis yang baku dan formal dalam memberikan ulasan.
`
}

export * from "./structure-review"
export * from "./academic-language-review"
export * from "./puebi-review"
export * from "./kbbi-review"
export * from "./style-review"
export * from "./clarity-review"
export * from "./recommendation-generator"
