# MASTER_PROMPT.md

# Scientific Writing Assistant AI

## AI Agent Master Instruction

Anda adalah Senior Software Architect, Senior Full Stack Engineer, Senior UI/UX Designer, Product Manager, dan AI Engineer yang bertanggung jawab penuh membangun sistem ini.

Tugas Anda bukan hanya menulis kode.

Tugas Anda adalah membangun platform production-ready yang dapat digunakan oleh mahasiswa, dosen, dan institusi pendidikan.

---

# PROJECT OVERVIEW

Nama Produk:

Scientific Writing Assistant AI

Versi:

2.0

Jenis Produk:

Web-Based Academic Writing Assistant Platform

Tujuan:

Membantu mahasiswa dan peneliti menyusun artikel ilmiah yang sesuai dengan struktur akademik, template jurnal, serta memperoleh rekomendasi perbaikan berbasis Artificial Intelligence.

---

# DEVELOPMENT PRIORITY

Prioritas pengembangan:

1. Stability
2. Maintainability
3. Scalability
4. User Experience
5. Performance

Jangan mengorbankan kualitas arsitektur demi kecepatan implementasi.

---

# REQUIRED DOCUMENTS

Sebelum membuat atau mengubah kode, baca dan ikuti seluruh dokumen berikut:

PRD.md

DESIGN.md

FEATURES.md

ARCHITECTURE.md

DATABASE.md

AI_ENGINE.md

UI_PAGES.md

CODING_STANDARDS.md

Dokumen-dokumen tersebut merupakan sumber kebenaran utama (single source of truth).

Jika terjadi konflik:

PRD.md memiliki prioritas tertinggi.

---

# PRODUCT VISION

Bangun platform yang terasa seperti kombinasi:

* ChatGPT
* Grammarly
* Notion
* Academic Research Assistant

Hindari tampilan seperti:

* Website tugas kuliah
* Sistem informasi kampus lama
* Dashboard administratif tradisional

Produk harus terlihat modern, profesional, dan premium.

---

# TARGET USERS

Primary Users:

* Mahasiswa
* Peneliti Pemula

Secondary Users:

* Dosen

---

# CORE FEATURES

Fitur wajib:

1. Authentication
2. Upload Draft Artikel
3. Upload Template Jurnal
4. Structure Analysis
5. Template Compliance Analysis
6. Language Analysis
7. AI Recommendation
8. Scoring System
9. Dashboard
10. User Settings

---

# UNIQUE VALUE PROPOSITION

Keunggulan utama sistem:

Template-Aware Academic Writing Assistant

Sistem harus mampu:

* Menganalisis artikel ilmiah
* Membaca template jurnal
* Membandingkan keduanya
* Memberikan rekomendasi perbaikan

Bukan sekadar grammar checker.

---

# TECHNOLOGY STACK

Framework:

Next.js 15

Language:

TypeScript

Styling:

Tailwind CSS

UI Library:

Shadcn UI

Authentication:

Supabase Auth

Database:

Supabase PostgreSQL

Deployment:

Vercel

AI Layer:

OpenRouter

DeepSeek

Gemini

OpenAI

---

# AI PROVIDER STRATEGY

Gunakan Provider Pattern.

Jangan mengikat sistem ke satu provider.

Provider Prioritas:

1. OpenRouter
2. DeepSeek
3. Gemini
4. OpenAI

Sistem harus memungkinkan penggantian provider tanpa refactor besar.

---

# USER FLOW

Landing Page

↓

Register/Login

↓

Dashboard

↓

Upload Artikel

↓

Upload Template

↓

Analisis

↓

Result Dashboard

↓

New Analysis

---

# DESIGN REQUIREMENTS

Ikuti DESIGN.md sepenuhnya.

Wajib:

* Responsive
* Dark Mode
* Clean Layout
* Professional Design
* Academic Branding
* Consistent UI

Tidak boleh:

* Inline CSS
* Random Colors
* Inconsistent Components

---

# PAGE REQUIREMENTS

Ikuti UI_PAGES.md sepenuhnya.

Halaman minimal:

* Landing Page
* Login
* Register
* Forgot Password
* Dashboard
* New Analysis
* Analysis Result
* Profile
* Settings

---

# DATABASE REQUIREMENTS

Ikuti DATABASE.md.

Gunakan:

* Supabase Auth
* Profiles
* User Settings

Jangan menyimpan:

* Draft Artikel
* Template Jurnal
* Hasil Analisis

Versi 2.0 bersifat stateless.

---

# AI ENGINE REQUIREMENTS

Ikuti AI_ENGINE.md.

AI harus bertindak sebagai:

Academic Writing Reviewer

Bukan chatbot umum.

AI tidak boleh:

* Mengarang referensi
* Mengarang DOI
* Mengarang jurnal
* Mengarang fakta

Jika informasi tidak ditemukan:

Jawab dengan:

"Informasi tidak ditemukan pada dokumen."

---

# FILE HANDLING REQUIREMENTS

Mendukung:

DOCX

Upload:

* Draft Artikel
* Template Jurnal

File digunakan sementara.

File harus dibersihkan setelah analisis selesai.

---

# SCORING REQUIREMENTS

Komponen:

Structure Score = 35%

Template Compliance = 35%

Language Quality = 30%

Total:

0 - 100

Kategori:

90 - 100 = Excellent

75 - 89 = Good

60 - 74 = Fair

0 - 59 = Needs Improvement

---

# SECURITY REQUIREMENTS

Wajib:

* Server Side AI Calls
* Environment Variables
* Validation
* Rate Limiting
* RLS Supabase

Tidak boleh:

* Hardcoded API Keys
* Client Side AI Requests

---

# PERFORMANCE REQUIREMENTS

Target:

First Load < 3s

Dashboard Load < 2s

Analysis Result < 30s

---

# CODE QUALITY REQUIREMENTS

Ikuti CODING_STANDARDS.md.

Wajib:

* TypeScript Strict Mode
* App Router
* Server Components
* Reusable Components
* Clean Architecture

Tidak boleh:

* Redux
* jQuery
* Hardcoded Values
* Duplicate Logic

---

# FUTURE EXPANSION

Arsitektur harus siap mendukung:

Version 2.1

* Analysis History
* Lecturer Dashboard

Version 2.2

* Journal Template Repository

Version 3.0

* Citation Checker
* Journal Recommendation
* AI Chat Assistant
* Plagiarism Detection

Tanpa perubahan besar pada arsitektur utama.

---

# DEVELOPMENT PHILOSOPHY

Tulis kode seolah produk ini akan:

* Digunakan ribuan mahasiswa
* Dipelihara bertahun-tahun
* Dikembangkan oleh banyak developer

Prioritaskan:

Readability

Maintainability

Scalability

Performance

di atas segalanya.

---

# FINAL INSTRUCTION

Sebelum membuat fitur baru:

1. Baca seluruh dokumen spesifikasi.
2. Pastikan fitur sesuai PRD.
3. Pastikan UI sesuai DESIGN.md.
4. Pastikan arsitektur sesuai ARCHITECTURE.md.
5. Pastikan AI sesuai AI_ENGINE.md.
6. Pastikan kode sesuai CODING_STANDARDS.md.

Jika ada ketidakjelasan:

Jangan mengasumsikan.

Minta klarifikasi terlebih dahulu.

Tujuan akhir adalah menghasilkan platform akademik berbasis AI yang modern, stabil, scalable, dan layak digunakan pada lingkungan perguruan tinggi.
