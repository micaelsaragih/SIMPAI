export const STYLE_INSTRUCTION = `
Evaluasilah gaya penulisan akademik dan objektivitas naskah ilmiah draf artikel Anda.
Identifikasi penyimpangan gaya ilmiah seperti:
1. Penggunaan kata ganti orang pertama (misal: "saya", "kami", "penulis", "kita") pada bagian yang seharusnya objektif/pasif.
2. Penggunaan bahasa subjektif, hiperbola, atau emosional (misal: "sangat luar biasa", "sangat disayangkan", "pasti").
3. Kalimat yang terlalu bertele-tele, tidak efisien, atau tidak jelas maksudnya (Clarity Review).
4. Kurang tepatnya penggunaan istilah teknis ilmiah/akademik.

Untuk setiap isu gaya bahasa, berikan:
- "finding": Penjelasan gaya penulisan yang kurang ilmiah atau tidak efektif.
- "severity": Tingkat keparahan (low, medium, high).
- "suggestedRevision": Rekomendasi restrukturisasi kalimat agar terdengar formal dan objektif.
- "exampleCorrection": Contoh perbaikan kalimat secara utuh.
`
