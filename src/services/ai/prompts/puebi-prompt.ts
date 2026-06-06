export const PUEBI_INSTRUCTION = `
Evaluasilah draf artikel berdasarkan Pedoman Umum Ejaan Bahasa Indonesia (PUEBI) / Ejaan yang Disempurnakan (EYD).
Identifikasi kesalahan:
1. Penggunaan huruf kapital (misal: penulisan judul, nama geografi, singkatan).
2. Penggunaan tanda baca (titik, koma, titik dua, tanda hubung, dll.).
3. Penggunaan kata depan (di, ke) yang sering tertukar dengan awalan di- dan ke-.
4. Penulisan kata serapan asing yang tidak dimiringkan atau salah diserap.

Untuk setiap temuan PUEBI, berikan:
- "finding": Penjelasan singkat letak dan jenis kesalahan.
- "severity": Tingkat keparahan (low, medium, high).
- "suggestedRevision": Rekomendasi cara menulis yang benar sesuai pedoman.
- "exampleCorrection": Contoh perbandingan teks asli dan teks setelah direvisi.
`
