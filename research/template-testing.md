# Evaluasi Akurasi Kepatuhan Template Jurnal (Template Compliance Evaluation)

Dokumen ini berisi hasil pengujian dan penguraian matematis akurasi pencocokan draf artikel ilmiah terhadap struktur template jurnal pada sistem SIMPAI. Pengujian melibatkan 10 skenario perbandingan draf vs template.

---

## Logika Penilaian Kepatuhan (Scoring Model)

Kesesuaian dihitung menggunakan nilai awal **100** dengan pengurangan penalti sebagai berikut:
1. **Bagian Wajib Hilang (Missing Section)**: Penalti **-15** per bagian yang ada di template tetapi tidak ditemukan di draf.
2. **Bagian Tambahan (Extra Section)**: Penalti **-5** per bagian di draf yang tidak diharapkan oleh template.
3. **Salah Urutan (Order Mismatch)**: Penalti **-10** per bagian yang posisinya tidak sesuai urutan relatif pada template.

Semua pengujian dibatasi pada rentang nilai kelayakan **0 - 100**.

---

## Matriks Hasil Evaluasi Kepatuhan

| ID | Nama Skenario | Struktur Draft | Struktur Template | Expected Score | Actual Score | Status |
|---|---|---|---|---|---|---|
| **CMP-001** | Kepatuhan Sempurna | 9 Bagian Standar | 9 Bagian Standar | 100 | 100 | **PASS** |
| **CMP-002** | Bagian Wajib Hilang | 8 Bagian (Tanpa Pembahasan) | 9 Bagian Standar | 85 | 85 | **PASS** |
| **CMP-003** | Bagian Tambahan | 9 Bagian + Lampiran | 9 Bagian Standar | 95 | 95 | **PASS** |
| **CMP-004** | Kesalahan Urutan Ringan | Judul, Kata Kunci, Abstrak, Pendahuluan | Judul, Abstrak, Kata Kunci, Pendahuluan | 80 | 80 | **PASS** |
| **CMP-005** | Urutan Terbalik Total | Daftar Pustaka &larr; ... &larr; Judul | Judul &rarr; ... &rarr; Daftar Pustaka | 20 | 20 | **PASS** |
| **CMP-006** | Kombinasi Hilang + Lebih | 7 Bagian (Hilang Metode, Ada Terima Kasih) | 7 Bagian Standar | 80 | 80 | **PASS** |
| **CMP-007** | Draft Kosong | Kosong | 9 Bagian Standar | 0 | 0 | **PASS** |
| **CMP-008** | Template Kosong | 3 Bagian | Kosong | 85 | 85 | **PASS** |
| **CMP-009** | Perbedaan Huruf Besar-Kecil | judul, ABSTRAK, Kata Kunci | Judul, Abstrak, kata kunci | 100 | 100 | **PASS** |
| **CMP-010** | Sebagian Kacau Urutan | Kata Kunci, Abstrak | Judul, Abstrak, Kata Kunci, Pendahuluan | 50 | 50 | **PASS** |

---

## Pembahasan Temuan

* **Case Insensitivity**: Kasus **CMP-009** menunjukkan kegunaan normalisasi teks (lowercase + trim) yang berhasil mengenali bab meskipun ditulis dengan huruf besar/kecil yang tidak beraturan, menghasilkan skor kepatuhan tetap 100%.
* **Order Swapping**: Kasus **CMP-004** membuktikan bahwa jika ada dua elemen bertukar tempat, sistem akan mencatat keduanya mengalami penyimpangan urutan relatif, sehingga dikenakan potongan penalti masing-masing sebesar -10 (total potongan -20).
* **Zero Boundary**: Kasus **CMP-007** menunjukkan kepatuhan terendah dibatasi di angka 0 dan tidak bernilai negatif, menjamin stabilitas integrasi nilai ke kalkulasi skor akhir.

Berdasarkan data pengujian di atas, akurasi fungsional dari pembanding template SIMPAI adalah **100%** (10 dari 10 kasus lolos dengan hasil numerik yang presisi).
