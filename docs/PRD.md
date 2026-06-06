# PRD.md

# Product Requirements Document

## Project Name

Scientific Writing Assistant AI

## Version

Version 2.0

## Project Type

Web-Based Academic Writing Assistant Platform

## Project Status

Development Phase

---

# 1. Product Overview

Scientific Writing Assistant AI adalah platform berbasis web yang dirancang untuk membantu mahasiswa, dosen, dan peneliti dalam menyusun artikel ilmiah sesuai standar akademik dan template jurnal yang digunakan.

Sistem memanfaatkan Artificial Intelligence (AI), Natural Language Processing (NLP), serta analisis berbasis aturan (rule-based analysis) untuk melakukan pemeriksaan struktur artikel, kualitas bahasa, kesesuaian template jurnal, dan memberikan rekomendasi perbaikan secara otomatis.

Platform ini dikembangkan sebagai evolusi dari sistem sebelumnya yang dibangun menggunakan Laravel dan akan diimplementasikan menggunakan Next.js, Supabase, dan Vercel.

---

# 2. Problem Statement

Banyak mahasiswa mengalami kesulitan dalam:

* Menyusun artikel ilmiah sesuai struktur yang benar.
* Menyesuaikan artikel dengan template jurnal tertentu.
* Mengidentifikasi kesalahan bahasa akademik.
* Mengetahui bagian artikel yang belum lengkap.
* Memperoleh umpan balik dari dosen pembimbing secara cepat.

Selain itu, setiap jurnal memiliki format dan template yang berbeda sehingga proses penyesuaian artikel sering memakan waktu yang lama.

---

# 3. Product Vision

Membangun platform pembimbing penulisan artikel ilmiah berbasis AI yang mampu:

* Membantu penulis menyusun artikel sesuai standar akademik.
* Memastikan artikel sesuai dengan template jurnal yang digunakan.
* Memberikan evaluasi kualitas artikel secara otomatis.
* Menjadi asisten akademik digital bagi mahasiswa dan dosen.

---

# 4. Target Users

## Primary Users

### Mahasiswa

Kebutuhan:

* Menulis artikel ilmiah.
* Menyesuaikan artikel dengan template jurnal.
* Mendapatkan evaluasi otomatis.

### Peneliti Pemula

Kebutuhan:

* Memastikan artikel sesuai standar publikasi.
* Mempercepat proses revisi.

---

## Secondary Users

### Dosen

Kebutuhan:

* Membantu mahasiswa melakukan pengecekan awal.
* Mengurangi beban koreksi administratif.

---

# 5. Goals

## Business Goals

* Menyediakan platform akademik modern berbasis AI.
* Menjadi solusi pendamping penulisan artikel ilmiah.
* Dapat digunakan pada lingkungan kampus.

---

## User Goals

* Mengurangi kesalahan penulisan artikel.
* Menghemat waktu revisi.
* Meningkatkan kualitas artikel sebelum dikirim ke jurnal.

---

# 6. Core Features

## Authentication

Fitur:

* Registrasi akun.
* Login.
* Logout.
* Reset password.

Provider:

* Supabase Auth.

Role:

* Mahasiswa.

---

## Article Upload

User dapat:

* Menulis artikel secara manual.
* Mengunggah file DOCX.

Output:

* Artikel berhasil diproses oleh sistem.

---

## Journal Template Upload

User dapat mengunggah:

* Template jurnal dalam format DOCX.

Tujuan:

* Menjadi referensi struktur artikel.
* Menjadi dasar evaluasi kesesuaian artikel.

Template hanya digunakan untuk satu sesi analisis dan tidak disimpan permanen.

---

## Structure Analysis

Sistem menganalisis keberadaan:

* Judul
* Abstrak
* Kata Kunci
* Pendahuluan
* Metode Penelitian
* Hasil
* Pembahasan
* Kesimpulan
* Daftar Pustaka

Output:

* Struktur ditemukan.
* Struktur tidak ditemukan.
* Struktur tidak lengkap.

---

## Template Compliance Analysis

Sistem membandingkan:

Artikel Pengguna

dengan

Template Jurnal

Output:

* Tingkat kesesuaian.
* Bagian yang hilang.
* Bagian yang berbeda.
* Urutan struktur yang salah.

---

## Language Analysis

Sistem melakukan:

* Pemeriksaan bahasa akademik.
* Pemeriksaan istilah tidak baku.
* Pemeriksaan konsistensi istilah.
* Pemeriksaan kualitas penulisan.

Output:

* Daftar kesalahan.
* Daftar saran.

---

## AI Recommendation

Sistem memberikan:

* Rekomendasi perbaikan.
* Penyempurnaan bahasa akademik.
* Saran revisi struktur.

Output:

* Versi rekomendasi AI.

---

## Scoring System

Sistem menghasilkan skor:

0 - 100

Komponen:

* Struktur.
* Kesesuaian template.
* Bahasa.
* Kelengkapan artikel.

Output:

* Nilai akhir.
* Status kualitas.

---

# 7. User Flow

## Flow 1

Login

↓

Dashboard

↓

Upload Artikel

↓

Upload Template Jurnal

↓

Analisis

↓

Hasil Analisis

↓

Rekomendasi AI

---

# 8. Non Functional Requirements

## Performance

* Waktu analisis maksimal 30 detik.
* Respons halaman kurang dari 3 detik.

## Security

* Authentication menggunakan Supabase Auth.
* Validasi file upload.
* Sanitasi input pengguna.

## Scalability

* Mendukung penambahan AI provider baru.
* Mendukung penambahan jenis template jurnal baru.

## Availability

* Target uptime 99%.

---

# 9. AI Architecture Requirements

AI harus menggunakan Provider Layer.

Provider yang didukung:

* OpenRouter
* DeepSeek
* Gemini
* Llama
* OpenAI (opsional)

Provider dapat diganti tanpa mengubah logika aplikasi utama.

---

# 10. Technology Stack

Frontend:

* Next.js 15
* TypeScript
* Tailwind CSS
* Shadcn UI

Backend:

* Next.js Server Actions
* API Routes

Database:

* Supabase

Authentication:

* Supabase Auth

Deployment:

* Vercel

AI:

* OpenRouter
* DeepSeek
* Gemini

---

# 11. Future Roadmap

Version 2.1

* Riwayat Analisis.
* Dashboard Dosen.

Version 2.2

* Multi Journal Template Library.
* Template Repository.

Version 3.0

* Plagiarism Checker.
* Citation Checker.
* Automatic Reference Validator.
* Journal Recommendation System.
