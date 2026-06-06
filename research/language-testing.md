# Evaluasi Akurasi Mesin Bahasa Akademik Indonesia (Indonesian Academic Language Engine)

Laporan ini mendokumentasikan hasil evaluasi kualitas dan keandalan tata bahasa lokal pada SIMPAI. Pengujian menggunakan 15 skenario kebahasaan yang dirancang khusus untuk memetakan kesalahan kosakata, ejaan PUEBI, dan kepatuhan gaya bahasa akademik.

---

## Lapisan Analisis Kebahasaan

Mesin analisis kebahasaan SIMPAI beroperasi secara deterministik melalui tiga lapisan (Layer) lokal:
1. **Layer 1: Kamus Besar Bahasa Indonesia (KBBI)** — mencocokkan kata tidak baku, slang, bahasa kedaerahan, dan kata asing pinjaman terhadap bentuk standar.
2. **Layer 2: Pedoman Umum Ejaan Bahasa Indonesia (PUEBI)** — mencocokkan kapitalisasi awal kalimat, ejaan, tanda baca, penulisan preposisi/prefiks, dan angka.
3. **Layer 3: Gaya Bahasa Akademik (Style)** — menyaring kata ganti orang pertama/kedua, subjektivitas bias opini, pleonasme, konjungsi lisan informal, dan verba lemah.

---

## Matriks Hasil Pengujian Kebahasaan

| ID | Kategori | Kalimat Uji Masukan | Hasil Ekspektasi Deteksi | Temuan Aktual | Status |
|---|---|---|---|---|---|
| **LANG-001** | KBBI | Peneliti melakukan **analisa** terhadap sampel... | Kata tidak baku: 'analisa' &rarr; 'analisis' | Baku: analisis (non-standard-word) | **PASS** |
| **LANG-002** | KBBI | **Aktifitas** pengukuran dilakukan pagi hari... | Kata tidak baku: 'aktifitas' &rarr; 'aktivitas'| Baku: aktivitas (non-standard-word) | **PASS** |
| **LANG-003** | KBBI | Pengguna dapat **download** berkas data... | Kata serapan: 'download' &rarr; 'unduh' | Baku: unduh (non-standard-word) | **PASS** |
| **LANG-004** | KBBI | Metode yang digunakan sangat **simple**... | Kata serapan: 'simple' &rarr; 'sederhana' | Baku: sederhana (non-standard) | **PASS** |
| **LANG-005** | KBBI | Penelitian berlokasi di **apotik** daerah... | Kata tidak baku: 'apotik' &rarr; 'apotek' | Baku: apotek (non-standard-word) | **PASS** |
| **LANG-006** | PUEBI | Ini  adalah pengujian spasi ganda. | Spasi ganda &rarr; spasi tunggal | Spasi ganda (punctuation) | **PASS** |
| **LANG-007** | PUEBI | Penelitian ini **di buat** pada tahun 2026. | Prefiks 'di-' terpisah &rarr; 'dibuat' | Prefiks pasif (prefix-suffix) | **PASS** |
| **LANG-008** | PUEBI | Hasil penelitian ini ** ,** menunjukkan pengaruh... | Spasi sebelum koma &rarr; ',' | Spasi tanda baca (punctuation) | **PASS** |
| **LANG-009** | PUEBI | ...sensor suhu, kelembaban, **dll** untuk data. | Singkatan 'dll' &rarr; 'dll.' | Tanpa titik akhiran (abbreviation) | **PASS** |
| **LANG-010** | PUEBI | Uji coba dilaksanakan dari jam 08:00 **s/d** 10:00... | Singkatan tidak baku 's/d' &rarr; 's.d.' | Singkatan salah (abbreviation) | **PASS** |
| **LANG-011** | Style | Dalam penelitian ini, **kami** menyusun hipotesis...| Kata ganti orang jamak 'kami' &rarr; 'penulis' | Subjektif (first-person) | **PASS** |
| **LANG-012** | Style | ...menghasilkan data yang **sangat amat** akurat. | Pleonasme 'sangat amat' &rarr; 'sangat' | Redundansi (redundant-phrase) | **PASS** |
| **LANG-013** | Style | Metode utama penelitian **yaitu adalah** metode... | Kopula ganda 'yaitu adalah' &rarr; 'yaitu' | Kopula ganda (redundant-phrase) | **PASS** |
| **LANG-014** | Style | Hasil uji statistik **nggak** menunjukkan... | Kata lisan 'nggak' &rarr; 'tidak' | Kata gaul lisan (colloquial) | **PASS** |
| **LANG-015** | Style | Kenaikan suhu **bikin** reaksi kimia berjalan... | Kata lisan 'bikin' &rarr; 'membuat' | Verba lisan (informal-phrase) | **PASS** |

---

## Analisis Statistik Pengujian

Evaluasi kebahasaan menunjukkan hasil yang sangat memuaskan:
* **Total Kasus Uji**: 15 skenario
* **Kasus Berhasil (Lolos)**: 15 kasus
* **Akurasi Kebahasaan**: **100%**
* **Sensitivitas Jenis Pelanggaran**: Sistem berhasil mengklasifikasikan kategori (KBBI, PUEBI, Style) dan menentukan tingkat keparahan (severity) secara akurat berdasarkan dataset JSON yang dipetakan di memory.

Pengujian ini membuktikan bahwa mesin kebahasaan lokal SIMPAI dapat berfungsi secara mandiri (deterministic offline) untuk menjaga mutu tata bahasa karya tulis ilmiah sesuai regulasi ejaan bahasa Indonesia resmi tanpa bergantung pada stabilitas koneksi internet.
