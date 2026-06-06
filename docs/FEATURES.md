# FEATURES.md

# Feature Specification Document

Project:
Scientific Writing Assistant AI

Version:
2.0

---

# 1. Authentication Module

## Purpose

Memastikan hanya pengguna terdaftar yang dapat menggunakan sistem.

---

## Feature

User Registration

### Input

* Nama Lengkap
* Email
* Password

### Validation

* Email wajib unik.
* Password minimal 8 karakter.
* Email harus valid.

### Output

* Akun berhasil dibuat.
* User diarahkan ke dashboard.

---

## Feature

User Login

### Input

* Email
* Password

### Output

* Login berhasil.
* Redirect ke dashboard.

---

## Feature

Forgot Password

### Input

* Email

### Output

* Link reset password dikirim.

---

# 2. Article Upload Module

## Purpose

Memungkinkan pengguna mengunggah draft artikel ilmiah.

---

## Supported Format

* DOCX

Versi berikutnya:

* PDF

---

## Input

File Artikel

---

## Validation

Ukuran maksimal:

20 MB

File harus:

* DOCX valid

---

## Output

Artikel berhasil dibaca sistem.

---

# 3. Journal Template Upload Module

## Purpose

Mengunggah template jurnal yang akan digunakan sebagai referensi analisis.

---

## Supported Format

* DOCX

---

## Input

Template Jurnal

---

## Validation

Ukuran maksimal:

20 MB

Template harus dapat dibaca sistem.

---

## Output

Template berhasil diproses.

---

# 4. Document Parsing Module

## Purpose

Mengubah dokumen menjadi teks yang dapat dianalisis.

---

## Process

Sistem mengekstrak:

* Heading
* Paragraf
* Struktur
* Metadata sederhana

---

## Output

Structured Document Object

---

# 5. Structure Analysis Module

## Purpose

Menganalisis kelengkapan struktur artikel.

---

## Components Checked

### Mandatory Sections

* Judul
* Abstrak
* Kata Kunci
* Pendahuluan
* Metode
* Hasil
* Pembahasan
* Kesimpulan
* Daftar Pustaka

---

## Output

Untuk setiap section:

Status:

* Found
* Missing
* Incomplete

---

## Result

Persentase kelengkapan struktur.

---

# 6. Template Compliance Module

## Purpose

Membandingkan artikel dengan template jurnal.

---

## Comparison Areas

### Section Order

Contoh:

Template:

* Abstrak
* Pendahuluan
* Metode

Artikel:

* Abstrak
* Metode
* Pendahuluan

Status:

Order Mismatch

---

### Required Sections

Mendeteksi bagian yang tidak ada.

---

### Additional Sections

Mendeteksi bagian yang tidak diperlukan.

---

## Output

Compliance Score

0-100

---

## Detailed Report

* Missing Sections
* Wrong Order
* Additional Sections

---

# 7. Language Analysis Module

## Purpose

Mengevaluasi kualitas bahasa akademik.

---

## Checks

### Non Standard Words

Mendeteksi:

* Kata tidak baku
* Istilah tidak akademik

---

### Academic Writing Style

Mendeteksi:

* Kalimat terlalu informal
* Frasa tidak ilmiah

---

### Consistency

Mendeteksi:

* Istilah yang berubah-ubah

---

## Output

Language Report

---

# 8. AI Recommendation Module

## Purpose

Memberikan rekomendasi perbaikan otomatis.

---

## Input

* Artikel
* Template
* Hasil Analisis

---

## AI Tasks

### Structure Improvement

AI memberikan saran:

* Section yang perlu ditambah
* Section yang perlu diperbaiki

---

### Language Improvement

AI memberikan:

* Revisi kalimat
* Penyempurnaan gaya akademik

---

### Compliance Improvement

AI menjelaskan:

* Bagaimana menyesuaikan artikel dengan template jurnal

---

## Output

AI Recommendation Report

---

# 9. Scoring Module

## Purpose

Memberikan penilaian keseluruhan artikel.

---

## Score Components

### Structure Score

Bobot:

35%

---

### Template Compliance Score

Bobot:

35%

---

### Language Score

Bobot:

30%

---

## Final Score

Range:

0-100

---

## Categories

90-100

Excellent

---

75-89

Good

---

60-74

Fair

---

0-59

Needs Improvement

---

# 10. Dashboard Module

## Purpose

Menampilkan ringkasan aktivitas pengguna.

---

## Dashboard Widgets

### User Information

* Nama
* Email

---

### Quick Start

* Upload Artikel
* Upload Template

---

### Recent Activity

Hanya sesi aktif.

Tidak disimpan permanen.

---

# 11. Analysis Result Module

## Purpose

Menampilkan hasil evaluasi secara visual.

---

## Sections

### Overall Score

Menampilkan:

* Skor
* Kategori

---

### Structure Analysis

Menampilkan:

* Found
* Missing
* Incomplete

---

### Template Compliance

Menampilkan:

* Tingkat kesesuaian

---

### Language Analysis

Menampilkan:

* Kesalahan bahasa

---

### AI Recommendation

Menampilkan:

* Rekomendasi lengkap

---

# 12. Error Handling Module

## Purpose

Memberikan pengalaman pengguna yang baik saat terjadi kesalahan.

---

## Errors

### Invalid File

Pesan:

"Format file tidak didukung."

---

### Parsing Failed

Pesan:

"Dokumen tidak dapat diproses."

---

### AI Service Failed

Pesan:

"Layanan AI sedang tidak tersedia."

---

### Upload Failed

Pesan:

"Gagal mengunggah dokumen."

---

# 13. Future Features

Versi 2.1

* Riwayat Analisis
* Dashboard Dosen

---

Versi 2.2

* Journal Template Library
* Multi Journal Comparison

---

Versi 3.0

* AI Chat Assistant
* Citation Checker
* Reference Validator
* Journal Recommendation Engine
* Plagiarism Checker
