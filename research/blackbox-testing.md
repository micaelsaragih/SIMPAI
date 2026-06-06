# Laporan Hasil Black Box Testing SIMPAI

Dokumen ini menyajikan hasil pengujian kotak hitam (Black Box Testing) terhadap sepuluh modul utama sistem SIMPAI. Pengujian difokuskan untuk memvalidasi kesesuaian fungsionalitas sistem berdasarkan masukan dan keluaran tanpa memperhatikan detail algoritma internal.

---

## Metodologi Pengujian

Pengujian dilakukan secara komprehensif menggunakan metode *Equivalence Partitioning* dan *Boundary Value Analysis* untuk skenario pengunggahan berkas, validasi form, dan proses navigasi sistem. Pengujian dilakukan pada lingkungan server lokal Next.js dengan basis data Supabase PostgreSQL.

---

## Matriks Hasil Pengujian

| No | Modul | Skenario Pengujian | Hasil yang Diharapkan | Status |
|---|---|---|---|---|
| 1 | **Authentication** | Login dengan email dan kata sandi terdaftar yang valid | Masuk ke sistem dan mengarahkan ke dashboard utama | **PASS** |
| 2 | **Authentication** | Login dengan kata sandi salah | Menolak login dan menampilkan pesan kesalahan kredensial | **PASS** |
| 3 | **Authentication** | Login dengan email tidak terdaftar | Menolak login dan menampilkan pesan kesalahan kredensial | **PASS** |
| 4 | **Authentication** | Registrasi pengguna baru dengan email dan kata sandi valid | Membuat akun baru, mengirim tautan verifikasi, menampilkan sukses | **PASS** |
| 5 | **Authentication** | Registrasi dengan kata sandi kurang dari 8 karakter | Menolak pendaftaran dan meminta minimal 8 karakter | **PASS** |
| 6 | **Profile** | Menampilkan profil pengguna | Menampilkan data email, nama lengkap, dan peran (Lecturer/Student) | **PASS** |
| 7 | **Profile** | Mengubah nama lengkap | Menyimpan perubahan nama ke database dan memperbarui UI | **PASS** |
| 8 | **Settings** | Menyimpan preferensi AI Provider | Menyimpan penyedia AI yang disukai ke tabel user_settings | **PASS** |
| 9 | **Settings** | Mengubah tema antarmuka (Light/Dark) | Mengubah skema warna CSS Tailwind secara real-time | **PASS** |
| 10 | **Template Library** | Menampilkan daftar template jurnal | Menampilkan daftar kartu template jurnal beserta info penerbit | **PASS** |
| 11 | **Template Library** | Mencari template berdasarkan judul/penerbit | Menyaring kartu template secara dinamis berdasarkan kata kunci | **PASS** |
| 12 | **Template Upload** | Unggah berkas template jurnal valid (.docx) | Mengurai struktur heading berkas dan memunculkan pratinjau | **PASS** |
| 13 | **Template Upload** | Unggah berkas template format tidak valid (.pdf) | Menolak unggahan berkas sebelum dikirim ke server | **PASS** |
| 14 | **Draft Upload** | Unggah berkas draf artikel valid (.docx) | Mengurai paragraf, heading, dan menghitung kata statistik | **PASS** |
| 15 | **Draft Upload** | Unggah draf berkas melebihi batas 20MB | Menolak unggahan berkas sebelum diproses ke server | **PASS** |
| 16 | **Rule-Based Analysis**| Analisis draf artikel tunggal (Draft-Only) | Menilai struktur bab berdasarkan aturan deteksi 9 bagian | **PASS** |
| 17 | **Rule-Based Analysis**| Analisis draf artikel berbasis template | Membandingkan draft terhadap template dan menghitung penalti | **PASS** |
| 18 | **Language Engine** | Analisis ejaan dan tata bahasa lokal Indonesia | Menguji tata bahasa lokal (KBBI, PUEBI, Style) pada teks draf | **PASS** |
| 19 | **AI Recommendation** | Menyajikan saran perbaikan bab dari AI | Menampilkan kartu rekomendasi perbaikan teks berdasarkan prioritas | **PASS** |
| 20 | **AI Recommendation** | Penanganan kegagalan API AI eksternal | Mengaktifkan fallback lokal otomatis agar analisis tetap selesai | **PASS** |

---

## Kesimpulan

Berdasarkan hasil pengujian di atas, tingkat kelulusan fungsionalitas sistem mencapai **100%** (20 dari 20 skenario uji berhasil lulus). Seluruh modul inti telah terintegrasi dan berfungsi sesuai dengan spesifikasi fungsionalitas yang didefinisikan dalam dokumen PRD SIMPAI.
