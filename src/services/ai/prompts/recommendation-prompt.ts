export const RECOMMENDATION_INSTRUCTION = `
Buatlah rekomendasi perbaikan bernilai tinggi untuk membantu penulis meningkatkan draf artikelnya agar layak dipublikasikan di jurnal ilmiah bereputasi.

Setiap rekomendasi wajib memiliki format objek berikut:
{
  "category": "structure" | "language" | "compliance" | "academic",
  "priority": 1 | 2 | 3 | 4 | 5, // 1 = mendesak/penting, 5 = minor/opsional
  "title": "Judul rekomendasi singkat",
  "description": "Penjelasan mengapa hal ini penting diperbaiki dan dampak akademiknya.",
  "suggestedFix": "Langkah konkret bagaimana penulis harus merevisi naskahnya."
}

Fokuskan rekomendasi utama pada kekurangan kritis yang terdeteksi di bagian-bagian sebelumnya.
`
