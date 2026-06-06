# DATABASE.md

# Database Design Document

Project:
Scientific Writing Assistant AI

Version:
2.0

Database Provider:

Supabase PostgreSQL

---

# 1. Database Philosophy

Database digunakan hanya untuk:

* Authentication
* User Profile
* Application Settings

Sistem tidak menyimpan:

* Draft Artikel
* Template Jurnal
* Hasil Analisis

Semua analisis bersifat sementara (session-based).

---

# 2. Database Architecture

Supabase Auth

↓

Users

↓

Profiles

↓

Settings

---

# 3. Authentication Schema

Provider:

Supabase Auth

Tabel bawaan:

auth.users

Dikelola langsung oleh Supabase.

Tidak boleh dimodifikasi secara langsung.

---

# 4. Profiles Table

Purpose:

Menyimpan informasi tambahan pengguna.

---

Table Name

profiles

---

Columns

id

Type:

UUID

Reference:

auth.users.id

Primary Key

---

full_name

Type:

TEXT

Required:

Yes

---

email

Type:

TEXT

Required:

Yes

---

avatar_url

Type:

TEXT

Required:

No

---

role

Type:

TEXT

Default:

student

Allowed Values:

* student
* lecturer
* admin

---

created_at

Type:

TIMESTAMP

Default:

now()

---

updated_at

Type:

TIMESTAMP

Default:

now()

---

# 5. Profiles Table SQL Concept

profiles

id

full_name

email

avatar_url

role

created_at

updated_at

---

# 6. User Settings Table

Purpose

Menyimpan preferensi pengguna.

---

Table Name

user_settings

---

Columns

id

UUID

Primary Key

---

user_id

UUID

Reference:

profiles.id

---

theme

TEXT

Values:

* light
* dark
* system

Default:

system

---

preferred_ai_provider

TEXT

Default:

openrouter

---

created_at

TIMESTAMP

---

updated_at

TIMESTAMP

---

# 7. Relationship Diagram

auth.users

↓

profiles

↓

user_settings

---

# 8. Row Level Security (RLS)

Status

Required

---

Policy

User hanya boleh:

* membaca datanya sendiri
* mengubah datanya sendiri

---

Tidak boleh:

* membaca data user lain
* mengubah data user lain

---

# 9. Access Control

Role

student

Permission

* login
* upload artikel
* upload template
* analisis artikel

---

Role

lecturer

Future Feature

---

Role

admin

Future Feature

---

# 10. Session Management

Provider

Supabase Auth

---

Storage

Secure Cookies

---

Authentication Type

JWT

---

# 11. Future Tables

Versi 2.1

analysis_history

Purpose:

Menyimpan riwayat analisis.

---

Columns

id

user_id

score

summary

created_at

---

Status

Belum digunakan.

---

# 12. Future Tables

journal_templates

Purpose:

Repository template jurnal.

---

Status

Belum digunakan.

Karena versi 2.0 menggunakan upload template manual.

---

# 13. Future Tables

lecturer_feedback

Purpose

Menyimpan komentar dosen.

---

Status

Belum digunakan.

---

# 14. Future Tables

citation_reports

Purpose

Pemeriksaan sitasi.

---

Status

Belum digunakan.

---

# 15. Database Rules

AI Agent wajib:

* Menggunakan UUID
* Menggunakan Foreign Key
* Menggunakan RLS
* Menggunakan Timestamp

---

Tidak diperbolehkan:

* Integer Auto Increment
* Hardcoded User ID
* Menyimpan Password Manual
* Menonaktifkan RLS

---

# 16. Database Constraints

Email

Unique

---

Profile

1 User = 1 Profile

---

User Settings

1 User = 1 Settings

---

# 17. Scalability Plan

Version 2.0

profiles

user_settings

---

Version 2.1

analysis_history

---

Version 2.2

journal_templates

---

Version 3.0

citation_reports

lecturer_feedback

journal_recommendations

---

# 18. Final Database Scope

Current Active Tables

1. auth.users

2. profiles

3. user_settings

Semua tabel lain masih berada pada roadmap pengembangan.
