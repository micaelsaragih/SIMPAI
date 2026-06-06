# AI_ENGINE.md

# Artificial Intelligence Engine Specification

Project:
Scientific Writing Assistant AI

Version:
2.0

---

# 1. Purpose

AI Engine bertugas memberikan:

* Analisis Artikel
* Analisis Struktur
* Analisis Bahasa
* Analisis Kesesuaian Template
* Rekomendasi Perbaikan

AI bukan chatbot umum.

AI berfungsi sebagai:

Academic Writing Assistant

---

# 2. Design Philosophy

AI harus bertindak sebagai:

Reviewer Akademik

bukan:

Chatbot Percakapan

---

AI harus:

* Objektif
* Formal
* Akademik
* Terukur
* Konsisten

---

AI tidak boleh:

* Mengarang informasi
* Membuat referensi palsu
* Membuat sitasi palsu
* Mengklaim fakta yang tidak ada

---

# 3. AI Provider Architecture

Menggunakan:

Provider Abstraction Layer

---

Application

↓

AI Provider Layer

↓

Provider

↓

Response

---

Tujuan:

Provider dapat diganti kapan saja tanpa mengubah sistem utama.

---

# 4. Supported Providers

Priority Order

---

Level 1

OpenRouter

Status:

Primary Provider

---

Level 2

DeepSeek

Status:

Recommended Free Provider

---

Level 3

Gemini

Status:

Backup Provider

---

Level 4

OpenAI

Status:

Premium Provider

---

Level 5

Llama

Status:

Optional Provider

---

# 5. Provider Selection Logic

Default

OpenRouter

---

Jika gagal

↓

DeepSeek

---

Jika gagal

↓

Gemini

---

Jika gagal

↓

Error Response

---

# 6. AI Tasks

AI hanya memiliki tugas berikut.

---

Task 1

Structure Analysis

---

Input

Draft Artikel

---

Output

* Section ditemukan
* Section hilang
* Section tidak lengkap

---

Task 2

Template Compliance Analysis

---

Input

Draft Artikel

*

Template Jurnal

---

Output

* Kesesuaian struktur
* Bagian hilang
* Bagian berbeda
* Urutan tidak sesuai

---

Task 3

Language Analysis

---

Input

Draft Artikel

---

Output

* Kata tidak baku
* Bahasa informal
* Kalimat tidak efektif
* Ketidakkonsistenan istilah

---

Task 4

Academic Improvement

---

Input

Draft Artikel

---

Output

* Kalimat yang perlu diperbaiki
* Frasa akademik yang lebih baik
* Penyempurnaan gaya penulisan

---

# 7. Prompt Engineering Rules

Semua prompt harus:

* Jelas
* Terstruktur
* Deterministik
* Mudah diparsing

---

Prompt tidak boleh:

* Terlalu panjang
* Ambigu
* Menghasilkan output bebas

---

# 8. Output Format Standard

AI wajib mengembalikan:

JSON

---

Contoh

{
"score": 85,
"structure": [],
"language": [],
"recommendations": []
}

---

Output bebas tidak diperbolehkan.

---

# 9. Structure Analysis Prompt

Role

Reviewer Artikel Ilmiah

---

Task

Periksa keberadaan:

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

Output

JSON

---

# 10. Template Compliance Prompt

Role

Reviewer Jurnal

---

Task

Bandingkan:

Artikel

vs

Template

---

Evaluasi:

* Struktur
* Urutan
* Kelengkapan

---

Output

JSON

---

# 11. Language Analysis Prompt

Role

Editor Akademik

---

Task

Identifikasi:

* Kata tidak baku
* Bahasa informal
* Kalimat tidak efektif

---

Output

JSON

---

# 12. Academic Improvement Prompt

Role

Academic Writing Expert

---

Task

Perbaiki:

* Kejelasan
* Formalitas
* Kualitas akademik

---

Output

JSON

---

# 13. Hallucination Prevention Rules

AI tidak boleh:

* Membuat referensi baru
* Membuat DOI palsu
* Membuat jurnal palsu
* Membuat kutipan palsu

---

Jika informasi tidak tersedia

AI harus menjawab:

"Informasi tidak ditemukan pada dokumen."

---

# 14. Context Rules

AI hanya boleh menggunakan:

* Artikel pengguna
* Template pengguna
* Hasil analisis sistem

---

AI tidak boleh:

* Menambahkan asumsi
* Menambahkan data luar

---

# 15. Scoring Strategy

Score Akhir

0 - 100

---

Komponen

Structure

35%

---

Template Compliance

35%

---

Language

30%

---

# 16. Recommendation Strategy

Prioritas:

1. Kesalahan fatal
2. Struktur hilang
3. Ketidaksesuaian template
4. Kesalahan bahasa
5. Penyempurnaan akademik

---

# 17. Cost Optimization

Provider utama:

DeepSeek/OpenRouter

---

Provider premium:

OpenAI

---

Tujuan:

Menekan biaya operasional.

---

# 18. Token Optimization

AI tidak menerima dokumen mentah penuh jika terlalu besar.

---

Gunakan:

* Ringkasan
* Chunking
* Section Extraction

---

untuk mengurangi biaya token.

---

# 19. Error Handling

Jika provider gagal

↓

Fallback Provider

---

Jika semua gagal

↓

Return Error JSON

---

Contoh

{
"status": "error",
"message": "AI Service Unavailable"
}

---

# 20. Security Rules

API Key hanya di:

.env.local

---

Tidak boleh:

* Hardcoded
* Diekspos ke client

---

Semua request AI dilakukan di server.

---

# 21. Future AI Features

Version 2.1

* AI Chat Assistant

---

Version 2.2

* Journal Recommendation AI

---

Version 3.0

* Citation Checker AI
* Reference Validator AI
* Plagiarism Detection AI
* Research Gap Generator AI

---

# 22. AI Engine Rules

AI Agent wajib:

* Menggunakan Provider Pattern
* Menggunakan JSON Response
* Menggunakan Retry Logic
* Menggunakan Fallback Provider

---

Tidak diperbolehkan:

* Hardcoded Provider
* Free Text Response
* Client Side AI Calls
* Direct API Calls dari UI

---

# 23. Long-Term Vision

AI Engine harus mampu berkembang menjadi:

Academic Research Assistant Platform

yang membantu:

* Menulis artikel
* Mengevaluasi artikel
* Menyesuaikan template jurnal
* Memvalidasi referensi
* Merekomendasikan jurnal
* Membantu proses publikasi ilmiah
