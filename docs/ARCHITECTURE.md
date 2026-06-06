# ARCHITECTURE.md

# System Architecture Document

Project:
Scientific Writing Assistant AI

Version:
2.0

Technology Stack:

* Next.js 15
* TypeScript
* Tailwind CSS
* Shadcn UI
* Supabase Auth
* OpenRouter
* Vercel

---

# 1. Architecture Overview

Scientific Writing Assistant AI menggunakan arsitektur modern berbasis Next.js App Router dengan pendekatan server-first.

Sistem dibangun menggunakan:

Frontend Layer

↓

Application Layer

↓

AI Layer

↓

External Services

↓

Presentation Layer

Tujuan:

* Mudah dikembangkan
* Mudah dipelihara
* Siap deployment Vercel
* Mendukung banyak AI Provider

---

# 2. High Level Architecture

User

↓

Frontend (Next.js)

↓

Server Actions

↓

Analysis Engine

↓

AI Provider Layer

↓

OpenRouter / Gemini / DeepSeek

↓

Result Renderer

---

# 3. Folder Structure

app/

components/

features/

lib/

services/

types/

hooks/

providers/

public/

docs/

---

# 4. Detailed Folder Structure

app/

Halaman utama aplikasi.

Contoh:

app/

├── page.tsx

├── login/

├── dashboard/

├── analysis/

├── settings/

└── profile/

---

components/

Reusable UI Components.

Contoh:

components/

├── ui/

├── layout/

├── dashboard/

├── analysis/

├── upload/

└── charts/

---

features/

Business Logic.

Contoh:

features/

├── auth/

├── upload/

├── parsing/

├── structure-analysis/

├── language-analysis/

├── template-analysis/

├── scoring/

└── ai-recommendation/

---

lib/

Utilities dan helper.

Contoh:

lib/

├── supabase/

├── validators/

├── constants/

├── parser/

└── utils/

---

services/

External service integration.

Contoh:

services/

├── ai/

├── document/

├── scoring/

└── analysis/

---

types/

Semua TypeScript types.

---

hooks/

Custom React Hooks.

---

providers/

Context Providers.

---

docs/

Semua file markdown project.

PRD.md

DESIGN.md

FEATURES.md

ARCHITECTURE.md

DATABASE.md

AI_ENGINE.md

MASTER_PROMPT.md

---

# 5. Authentication Architecture

Provider:

Supabase Auth

---

Supported Method

* Email Login
* Email Password
* Password Reset

---

Flow

User Login

↓

Supabase Auth

↓

JWT Session

↓

Dashboard

---

# 6. Upload Architecture

Input

Draft Artikel

*

Template Jurnal

---

Supported Format

* DOCX

---

Flow

Upload File

↓

Validation

↓

Temporary Storage

↓

Document Parser

↓

Analysis Engine

---

Tidak menyimpan file permanen.

---

# 7. Document Parsing Architecture

Purpose

Mengubah file DOCX menjadi data yang dapat dianalisis.

---

Output

Document Object

{
title,
sections,
paragraphs,
headings
}

---

Supported Content

* Heading
* Paragraph
* Section Structure

---

# 8. Analysis Engine Architecture

Analysis Engine terdiri dari beberapa modul.

---

Module 1

Structure Analyzer

Tugas:

Mendeteksi:

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

Module 2

Template Analyzer

Membandingkan:

Draft

vs

Template

---

Output

* Missing Sections
* Wrong Order
* Additional Sections

---

Module 3

Language Analyzer

Mendeteksi:

* Kata tidak baku
* Bahasa informal
* Konsistensi istilah

---

Module 4

Score Generator

Menghasilkan:

0-100

---

# 9. AI Architecture

Menggunakan Provider Layer.

Tidak boleh terikat pada satu provider.

---

Flow

Analysis Result

↓

AI Provider Layer

↓

Selected Provider

↓

Response

---

Supported Providers

Priority:

1. OpenRouter

2. DeepSeek

3. Gemini

4. OpenAI

5. Llama

---

# 10. AI Provider Interface

Semua provider wajib mengikuti interface yang sama.

Example

generateRecommendation()

↓

Provider tidak diketahui modul lain.

---

Tujuan

Mudah mengganti provider tanpa refactor besar.

---

# 11. State Management

Default:

React State

useState

useReducer

---

Tidak menggunakan Redux.

---

Jika diperlukan:

TanStack Query

---

# 12. API Architecture

Gunakan:

Server Actions

Sebagai default.

---

API Route hanya digunakan jika:

* Upload besar
* Integrasi pihak ketiga
* Webhook

---

# 13. Security Architecture

Validation

Semua upload divalidasi.

---

Sanitization

Semua input dibersihkan.

---

Rate Limiting

Mencegah spam request AI.

---

Secrets

Semua API Key:

.env.local

Tidak pernah expose ke client.

---

# 14. Error Handling

Layer

UI

↓

Feature

↓

Service

↓

Provider

---

Semua error harus memiliki:

* Error Code
* Error Message
* Recovery Suggestion

---

# 15. Logging

Development

Console Logging

---

Production

Error Tracking Service

(opsional)

---

# 16. Deployment Architecture

Platform

Vercel

---

Environment

Development

Preview

Production

---

CI/CD

GitHub

↓

Push

↓

Vercel Build

↓

Auto Deploy

---

# 17. Performance Requirements

Target

First Load < 3s

Analysis Start < 2s

AI Response < 30s

---

# 18. Scalability Plan

Version 2.1

* Riwayat Analisis

Version 2.2

* Journal Library

Version 3.0

* AI Chat Assistant
* Citation Checker
* Plagiarism Detection

---

# 19. Architecture Rules

AI Agent wajib:

* Menggunakan TypeScript Strict Mode
* Menggunakan App Router
* Menggunakan Server Components jika memungkinkan
* Menghindari duplicate logic
* Menghindari hardcoded values
* Menggunakan reusable components
* Menggunakan provider pattern untuk AI

Tidak diperbolehkan:

* Redux
* jQuery
* Inline CSS
* Hardcoded API Keys
* Direct AI Provider Calls dari UI
