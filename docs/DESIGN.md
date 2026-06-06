# DESIGN.md

# Design System & UI/UX Guidelines

## Project Name

Scientific Writing Assistant AI

Version 2.0

---

# 1. Design Vision

Scientific Writing Assistant AI harus tampil sebagai platform akademik modern yang memadukan:

* Professional Academic Platform
* AI Assistant Platform
* Modern SaaS Dashboard
* Research Productivity Tool

Inspirasi visual:

* ChatGPT
* Notion
* Grammarly
* Perplexity
* ResearchRabbit

Aplikasi tidak boleh terlihat seperti website tugas kuliah atau sistem informasi kampus tradisional.

Tujuan utama desain adalah menciptakan pengalaman yang modern, bersih, profesional, dan meningkatkan kepercayaan pengguna terhadap kualitas analisis AI yang diberikan.

---

# 2. Design Principles

## Clarity First

Semua informasi harus mudah dipahami.

User harus dapat mengetahui:

* Apa yang harus dilakukan.
* Apa yang sedang diproses.
* Apa hasil yang diperoleh.

dalam waktu kurang dari 5 detik.

---

## Minimal but Informative

Tampilan tidak boleh ramai.

Hanya tampilkan informasi yang relevan.

Hindari:

* Tabel panjang yang tidak perlu.
* Terlalu banyak warna.
* Efek visual berlebihan.

---

## Academic Professional

Desain harus mencerminkan:

* Dunia akademik.
* Penelitian.
* Publikasi ilmiah.
* Teknologi AI modern.

---

## AI-Centered Experience

AI adalah fitur utama.

Semua elemen desain harus menonjolkan proses analisis dan rekomendasi AI.

---

# 3. Branding

## Personality

Produk harus memiliki karakter:

* Professional
* Intelligent
* Trustworthy
* Academic
* Modern

Bukan:

* Playful
* Cartoon
* Gaming
* Casual

---

## Tone

Visual tone:

* Clean
* Elegant
* Premium
* Technology Driven

---

# 4. Color System

## Primary Color

Emerald Green

Tujuan:

* Identitas akademik.
* Kesan terpercaya.
* Mewarisi identitas visual sistem sebelumnya.

---

## Secondary Color

Teal

Digunakan untuk:

* Accent.
* Hover.
* Secondary button.

---

## Accent Color

Blue

Digunakan untuk:

* AI Features.
* Highlight informasi penting.
* Progress indicator.

---

## Success

Green

Digunakan untuk:

* Analisis berhasil.
* Struktur lengkap.
* Template sesuai.

---

## Warning

Amber

Digunakan untuk:

* Struktur kurang lengkap.
* Bagian perlu revisi.

---

## Error

Red

Digunakan untuk:

* Bagian hilang.
* Kesalahan bahasa serius.
* Validasi gagal.

---

## Neutral

Gunakan:

* White
* Slate
* Gray

Sebagai warna dominan antarmuka.

---

# 5. Typography

## Font Family

Primary:

Inter

Fallback:

sans-serif

---

## Heading

Bold

Ukuran:

* H1 : 48px
* H2 : 36px
* H3 : 30px
* H4 : 24px

---

## Body

Ukuran:

16px

Line Height:

1.6

---

## Rules

Jangan menggunakan lebih dari satu keluarga font.

---

# 6. Layout System

Gunakan:

12 Column Grid

Maximum Width:

1280px

Content Width:

1100px

---

## Spacing

Gunakan kelipatan:

* 4
* 8
* 16
* 24
* 32
* 48
* 64

Hindari spacing acak.

---

# 7. Landing Page

## Navbar

Berisi:

* Logo
* Home
* Features
* About
* Login

Navbar harus sticky.

---

## Hero Section

Berisi:

Headline utama.

Contoh:

"Analisis Artikel Ilmiah Otomatis dengan Bantuan AI"

Subheadline menjelaskan manfaat sistem.

CTA utama:

* Mulai Analisis
* Login

---

## Features Section

Minimal 6 fitur utama:

* Analisis Struktur
* Analisis Bahasa
* Template Compliance
* AI Recommendation
* Scoring System
* Journal Preparation

---

## Workflow Section

Menjelaskan:

1. Upload Artikel
2. Upload Template
3. Analisis AI
4. Hasil Evaluasi

---

## Footer

Berisi:

* Tentang Sistem
* Kontak
* Hak Cipta

---

# 8. Dashboard Design

Dashboard harus menjadi pusat pengalaman pengguna.

---

## Layout

Sidebar kiri.

Content area kanan.

---

## Sidebar Menu

* Dashboard
* New Analysis
* Profile
* Settings

---

## Dashboard Cards

Gunakan card modern.

Radius:

16px

Shadow:

Soft Shadow

---

## Empty State

Jika belum ada analisis:

Tampilkan ilustrasi dan panduan.

Jangan tampilkan halaman kosong.

---

# 9. Upload Workspace

Halaman paling penting.

---

## Upload Draft

Drag and Drop Area

Mendukung:

* DOCX

---

## Upload Template

Drag and Drop Area

Mendukung:

* DOCX

---

## Analysis Button

Primary CTA.

Ukuran besar.

Selalu terlihat jelas.

---

# 10. Analysis Result Page

Hasil analisis harus dibagi menjadi beberapa section.

---

## Overall Score

Tampilkan:

0-100

Menggunakan:

* Circular Progress
  atau
* Score Card

---

## Structure Analysis

Tampilkan:

* Lengkap
* Tidak Lengkap
* Tidak Ditemukan

Gunakan indikator visual.

---

## Template Compliance

Tampilkan:

* Tingkat kesesuaian.
* Bagian yang hilang.
* Bagian yang berbeda.

---

## Language Analysis

Tampilkan:

* Kesalahan bahasa.
* Kalimat tidak efektif.
* Kata tidak baku.

---

## AI Recommendation

Tampilkan sebagai panel khusus.

Harus menjadi fokus utama halaman hasil.

---

# 11. Components

Gunakan:

Shadcn UI

Komponen wajib:

* Button
* Card
* Badge
* Tabs
* Accordion
* Sheet
* Dialog
* Toast
* Progress

---

# 12. Animations

Gunakan:

Framer Motion

---

## Allowed

* Fade In
* Slide Up
* Scale In
* Loading Animation

---

## Not Allowed

* Bounce berlebihan
* Animasi berkedip
* Efek gaming

---

# 13. Mobile Design

Mobile First.

Breakpoint:

* Mobile
* Tablet
* Desktop

Semua fitur wajib berjalan di mobile.

---

# 14. Accessibility

Minimal WCAG AA.

Pastikan:

* Kontras cukup.
* Keyboard navigation.
* Screen reader friendly.

---

# 15. Dark Mode

Wajib tersedia.

Mode:

* Light
* Dark
* System

---

# 16. UX Rules

User harus dapat memulai analisis dalam maksimal 3 langkah:

1. Login
2. Upload Artikel
3. Upload Template

Kemudian sistem melakukan analisis.

---

Tidak boleh ada:

* Halaman kosong.
* Tombol tanpa fungsi.
* Informasi yang membingungkan.
* Error message yang tidak jelas.

---

# 17. Future Design Expansion

Versi berikutnya harus dapat mendukung:

* Dashboard Dosen
* Multi User
* Riwayat Analisis
* Journal Repository
* AI Chat Assistant
* Citation Assistant
* Plagiarism Checker

tanpa mengubah design system utama.
