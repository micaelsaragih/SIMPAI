export const KBBI_INSTRUCTION = `
Lakukan pemeriksaan kosakata terhadap draf artikel berdasarkan Kamus Besar Bahasa Indonesia (KBBI).
Identifikasi:
1. Kata-kata tidak baku (misal: "karna", "tapi", "bisa", "buat", "dapet", "metodology", "analisa", "prosentase", "aktifitas").
2. Kesalahan ejaan kata/typo yang tidak memiliki entri resmi di KBBI.
3. Kata-kata percakapan sehari-hari yang tidak sesuai untuk naskah ilmiah.

Untuk setiap kesalahan KBBI, berikan:
- "finding": Kata tidak baku yang ditemukan beserta kata baku yang seharusnya.
- "severity": Tingkat keparahan (low, medium, high).
- "suggestedRevision": Penjelasan singkat mengapa kata tersebut salah dan apa alternatifnya.
- "exampleCorrection": Contoh kalimat/frasa pendek perbaikan.
`
