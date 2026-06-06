# UI_PAGES.md

# User Interface Pages Specification

Project:
Scientific Writing Assistant AI

Version:
2.0

---

# 1. Overview

Dokumen ini mendefinisikan seluruh halaman yang harus dibuat dalam sistem.

AI Agent wajib mengikuti struktur halaman ini.

Tidak diperbolehkan membuat halaman tambahan tanpa kebutuhan yang jelas.

---

# 2. Navigation Structure

Public Pages

├── Landing Page

├── Login

├── Register

└── Forgot Password

---

Protected Pages

├── Dashboard

├── New Analysis

├── Analysis Result

├── Profile

└── Settings

---

# 3. Landing Page

Route

/

---

Purpose

Memperkenalkan platform.

Mengarahkan pengguna untuk mulai menggunakan sistem.

---

Sections

Navbar

Hero

Features

Workflow

AI Capabilities

FAQ

Call To Action

Footer

---

Primary CTA

Mulai Analisis

---

Secondary CTA

Login

---

# 4. Login Page

Route

/login

---

Purpose

Autentikasi pengguna.

---

Components

Logo

Email Input

Password Input

Remember Me

Forgot Password

Login Button

Register Link

---

Success Action

Redirect ke Dashboard

---

# 5. Register Page

Route

/register

---

Purpose

Membuat akun baru.

---

Components

Nama Lengkap

Email

Password

Konfirmasi Password

Register Button

Login Link

---

Success Action

Redirect ke Dashboard

---

# 6. Forgot Password Page

Route

/forgot-password

---

Purpose

Reset password.

---

Components

Email Input

Send Reset Link Button

---

Success Action

Menampilkan notifikasi sukses.

---

# 7. Dashboard Page

Route

/dashboard

---

Purpose

Pusat aktivitas pengguna.

---

Layout

Sidebar

*

Main Content

---

Sidebar Menu

Dashboard

New Analysis

Profile

Settings

Logout

---

Main Content

Welcome Card

Quick Analysis Card

AI Status Card

System Information Card

---

Primary CTA

Mulai Analisis Baru

---

# 8. New Analysis Page

Route

/analysis/new

---

Purpose

Halaman utama untuk melakukan analisis artikel.

---

Layout

Single Workspace

---

Section 1

Upload Draft Artikel

---

Supported

DOCX

---

UI

Drag & Drop Zone

Browse Button

---

Section 2

Upload Template Jurnal

---

Supported

DOCX

---

UI

Drag & Drop Zone

Browse Button

---

Section 3

AI Provider

Default

OpenRouter

---

Options

OpenRouter

DeepSeek

Gemini

OpenAI

---

Section 4

Analysis Configuration

Future Ready

---

Section 5

Analyze Button

---

Primary CTA

Analisis Artikel

---

# 9. Analysis Processing Page

Route

/analysis/loading

---

Purpose

Menampilkan proses analisis.

---

Components

Progress Indicator

Loading Animation

Status Messages

---

Messages

Memproses Artikel

Membaca Template

Menganalisis Struktur

Menganalisis Bahasa

Menghubungi AI

Menyusun Hasil

---

User tidak boleh melihat halaman kosong.

---

# 10. Analysis Result Page

Route

/analysis/result

---

Purpose

Menampilkan hasil evaluasi.

---

Layout

Dashboard Style

---

Section 1

Overall Score

---

Components

Score Card

Circular Progress

Status Badge

---

Section 2

Structure Analysis

---

Components

Checklist Card

Status Indicator

---

Status

Found

Missing

Incomplete

---

Section 3

Template Compliance

---

Components

Compliance Score

Missing Sections

Wrong Order

Additional Sections

---

Section 4

Language Analysis

---

Components

Language Report

Issue List

Warning List

---

Section 5

AI Recommendations

---

Components

Recommendation Cards

Improvement Suggestions

---

Section 6

Action Buttons

---

New Analysis

Copy Result

Download Report

---

# 11. Profile Page

Route

/profile

---

Purpose

Mengelola profil pengguna.

---

Components

Avatar

Nama Lengkap

Email

Role

Update Profile Button

---

# 12. Settings Page

Route

/settings

---

Purpose

Mengelola preferensi sistem.

---

Components

Theme Selector

AI Provider Selector

Account Settings

Password Settings

---

Theme

Light

Dark

System

---

Default AI Provider

OpenRouter

DeepSeek

Gemini

OpenAI

---

# 13. Error Pages

404

---

Message

Halaman tidak ditemukan.

---

Button

Kembali ke Dashboard

---

500

---

Message

Terjadi kesalahan sistem.

---

Button

Coba Lagi

---

# 14. Mobile Navigation

Mobile Layout

Bottom Navigation

atau

Collapsible Sidebar

---

Required Menu

Dashboard

Analysis

Profile

Settings

---

# 15. Responsive Rules

Desktop

≥ 1024px

---

Tablet

768px - 1023px

---

Mobile

≤ 767px

---

Semua halaman wajib responsive.

---

# 16. Accessibility Rules

Keyboard Navigation

Required

---

Screen Reader

Required

---

Color Contrast

WCAG AA

---

# 17. Future Pages

Version 2.1

Analysis History

---

Version 2.2

Journal Repository

---

Version 3.0

AI Chat Assistant

Citation Checker

Journal Recommendation

Plagiarism Detection

---

# 18. UI Rules

AI Agent wajib:

* Menggunakan Layout Konsisten
* Menggunakan Design System
* Menggunakan Shadcn Components
* Menggunakan Responsive Design
* Menggunakan Dark Mode

---

Tidak diperbolehkan:

* Layout berbeda setiap halaman
* Warna acak
* Komponen tidak konsisten
* UI yang menyerupai sistem informasi lama kampus

---

# 19. User Journey

Landing Page

↓

Register/Login

↓

Dashboard

↓

New Analysis

↓

Upload Artikel

↓

Upload Template

↓

Analisis

↓

Result Page

↓

New Analysis

---

Target:

Pengguna dapat memperoleh hasil analisis lengkap dalam kurang dari 3 menit.
