# CODING_STANDARDS.md

# Development Standards & Engineering Guidelines

Project:
Scientific Writing Assistant AI

Version:
2.0

---

# 1. Purpose

Dokumen ini mendefinisikan standar pengembangan yang wajib diikuti oleh seluruh kode dalam proyek.

Semua kode harus:

* Konsisten
* Mudah dibaca
* Mudah dipelihara
* Mudah dikembangkan

---

# 2. Technology Standards

Framework

Next.js 15

---

Language

TypeScript

---

Styling

Tailwind CSS

---

UI Library

Shadcn UI

---

Authentication

Supabase Auth

---

Database

Supabase PostgreSQL

---

Deployment

Vercel

---

AI Integration

OpenRouter

DeepSeek

Gemini

OpenAI

---

# 3. TypeScript Rules

Strict Mode

Required

---

Tidak diperbolehkan:

any

kecuali benar-benar tidak bisa dihindari.

---

Gunakan:

interface

untuk object contract.

---

Gunakan:

type

untuk union type.

---

Semua function wajib memiliki type.

---

# 4. Naming Convention

## Components

PascalCase

Example

AnalysisResultCard.tsx

UploadWorkspace.tsx

DashboardSidebar.tsx

---

## Hooks

camelCase dengan prefix use

Example

useAuth.ts

useAnalysis.ts

useTheme.ts

---

## Utility Functions

camelCase

Example

calculateScore()

parseDocument()

extractSections()

---

## Constants

UPPER_SNAKE_CASE

Example

MAX_FILE_SIZE

DEFAULT_AI_PROVIDER

---

## Environment Variables

UPPER_SNAKE_CASE

Example

OPENROUTER_API_KEY

SUPABASE_URL

SUPABASE_ANON_KEY

---

# 5. Folder Rules

Tidak diperbolehkan:

Menaruh semua file dalam satu folder.

---

Harus mengikuti:

app/

components/

features/

services/

hooks/

types/

lib/

providers/

---

# 6. Component Rules

Komponen harus:

* Reusable
* Kecil
* Fokus pada satu tugas

---

Tidak diperbolehkan:

Komponen lebih dari 300 baris.

---

Jika terlalu besar:

Pecah menjadi subcomponent.

---

# 7. Server Component Rules

Gunakan:

Server Components

sebagai default.

---

Gunakan:

Client Components

hanya jika diperlukan.

---

Contoh:

* Form
* Upload
* Interactive UI

---

# 8. State Management Rules

Default:

useState

---

Kompleks:

useReducer

---

Server Data:

TanStack Query

(jika diperlukan)

---

Tidak diperbolehkan:

Redux

---

# 9. API Rules

Prioritas:

Server Actions

---

API Route hanya digunakan jika:

* Upload besar
* Webhook
* Integrasi eksternal

---

Tidak diperbolehkan:

Business Logic di UI Layer

---

# 10. Validation Rules

Gunakan:

Zod

---

Semua form wajib divalidasi.

---

Client Validation

*

Server Validation

---

# 11. Form Rules

Gunakan:

React Hook Form

*

Zod

---

Semua form harus:

* Menampilkan error jelas
* Menampilkan loading state
* Menampilkan success state

---

# 12. Error Handling Rules

Semua error wajib:

* Ditangkap
* Dicatat
* Ditampilkan dengan ramah

---

Format

User Message

Technical Message

Error Code

---

Contoh

AI Service Unavailable

Code:

AI_001

---

# 13. Logging Rules

Development

console.log()

diperbolehkan.

---

Production

hapus semua log debugging.

---

Gunakan:

structured logging.

---

# 14. Security Rules

Tidak diperbolehkan:

* Hardcoded API Key
* Hardcoded Secret
* Hardcoded User ID

---

Semua secret:

.env.local

---

Semua AI Request:

Server Side Only

---

Tidak boleh:

Client Side AI Calls

---

# 15. Supabase Rules

Gunakan:

RLS

(Row Level Security)

---

Semua query harus:

User Scoped

---

Tidak boleh:

SELECT *

tanpa kebutuhan jelas.

---

# 16. AI Provider Rules

Gunakan:

Provider Pattern

---

Jangan langsung memanggil:

Gemini

atau

DeepSeek

dari UI.

---

Semua request harus melalui:

AI Service Layer

---

# 17. Upload Rules

Supported

DOCX

---

Validation

File Size

File Type

File Integrity

---

File harus dibersihkan setelah analisis selesai.

---

Tidak boleh:

Menyimpan file permanen.

---

# 18. Accessibility Rules

Semua komponen harus:

* Keyboard Accessible
* Screen Reader Friendly

---

Gunakan:

aria-label

jika diperlukan.

---

# 19. Styling Rules

Gunakan:

Tailwind CSS

---

Tidak diperbolehkan:

Inline CSS

---

Tidak diperbolehkan:

CSS acak per halaman.

---

Gunakan:

Design System

---

# 20. Performance Rules

Gunakan:

Lazy Loading

untuk komponen berat.

---

Gunakan:

Dynamic Import

jika diperlukan.

---

Optimasi:

Bundle Size

---

# 21. Code Quality Rules

Gunakan:

ESLint

---

Gunakan:

Prettier

---

Tidak boleh:

Unused Imports

---

Tidak boleh:

Dead Code

---

# 22. Testing Rules

Minimal:

Unit Testing

untuk:

* Parser
* Scoring Engine
* AI Service

---

Gunakan:

Vitest

---

# 23. Git Rules

Branch

main

---

Commit Format

feat:

fix:

refactor:

docs:

style:

test:

---

Example

feat: add template compliance analyzer

fix: repair document parser

docs: update AI engine specification

---

# 24. Documentation Rules

Semua feature baru wajib:

* Didokumentasikan
* Memiliki type
* Memiliki komentar seperlunya

---

Tidak boleh:

Komentar berlebihan yang menjelaskan hal jelas.

---

# 25. Engineering Philosophy

Kode harus ditulis seolah proyek ini akan:

* Digunakan ribuan mahasiswa
* Dikembangkan bertahun-tahun
* Menjadi platform akademik nyata

---

Prioritas:

1. Readability
2. Maintainability
3. Scalability
4. Performance

---

# 26. Final Development Rules

AI Agent wajib:

✓ Mengikuti seluruh file .md

✓ Menggunakan TypeScript Strict Mode

✓ Menggunakan App Router

✓ Menggunakan Server Components

✓ Menggunakan Shadcn UI

✓ Menggunakan Supabase Auth

✓ Menggunakan Provider Pattern untuk AI

✓ Menggunakan Design System

✓ Menggunakan Clean Architecture

---

AI Agent tidak diperbolehkan:

✗ Mengabaikan dokumen spesifikasi

✗ Menggunakan Redux

✗ Menggunakan jQuery

✗ Menggunakan Inline CSS

✗ Menyimpan API Key di Client

✗ Membuat struktur folder sembarangan

✗ Membuat desain yang tidak sesuai DESIGN.md
