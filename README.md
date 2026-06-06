# Scientific Writing Assistant AI

Scientific Writing Assistant AI adalah platform berbasis web (Next.js 15, Supabase, Tailwind CSS, Shadcn UI) yang dirancang untuk membantu mahasiswa, dosen, dan peneliti dalam menyusun artikel ilmiah sesuai dengan standar akademik dan template jurnal yang digunakan secara otomatis menggunakan kecerdasan buatan (AI).

---

## Dokumentasi Proyek

Semua spesifikasi teknis dan non-teknis dipindahkan ke folder [docs/](file:///c:/penulisan-ilmiah/docs). Berikut adalah dokumen-dokumen utama yang dapat dirujuk:

*   **[Product Requirements Document (PRD.md)](file:///c:/penulisan-ilmiah/docs/PRD.md)** - Kebutuhan produk dan fungsional dasar.
*   **[Design System Guidelines (DESIGN.md)](file:///c:/penulisan-ilmiah/docs/DESIGN.md)** - Prinsip visual, sistem warna, tata letak, dan guidelines UI/UX.
*   **[Feature Specification (FEATURES.md)](file:///c:/penulisan-ilmiah/docs/FEATURES.md)** - Rincian fitur autentikasi, analisis dokumen, parsing, dan scoring.
*   **[System Architecture (ARCHITECTURE.md)](file:///c:/penulisan-ilmiah/docs/ARCHITECTURE.md)** - Arsitektur sistem Next.js App Router, layout, dan provider pattern.
*   **[Database Design (DATABASE.md)](file:///c:/penulisan-ilmiah/docs/DATABASE.md)** - Desain skema Supabase Auth, tabel `profiles`, `user_settings`, dan RLS.
*   **[AI Engine Specification (AI_ENGINE.md)](file:///c:/penulisan-ilmiah/docs/AI_ENGINE.md)** - Integrasi AI Provider Layer, prompt engineering, mencegah halusinasi AI.
*   **[User Interface Pages (UI_PAGES.md)](file:///c:/penulisan-ilmiah/docs/UI_PAGES.md)** - Struktur rute halaman dan layout untuk masing-masing URL rute.
*   **[Coding Standards & Guidelines (CODING_STANDARDS.md)](file:///c:/penulisan-ilmiah/docs/CODING_STANDARDS.md)** - Aturan TypeScript, konvensi penamaan, clean code, dan git workflow.
*   **[AI Agent Master Instruction (MASTER_PROMPT.md)](file:///c:/penulisan-ilmiah/docs/MASTER_PROMPT.md)** - Instruksi umum pengembangan asisten AI.

---

## Memulai Pengembangan

### Prerequisites

Pastikan Anda memiliki:
*   [Node.js](https://nodejs.org) v18 atau versi terbaru (direkomendasikan v20+)
*   Akun [Supabase](https://supabase.com) untuk integrasi autentikasi dan database.

### Setup Environment Variables

Salin berkas `.env.example` ke `.env.local` dan lengkapi nilai-nilai variabelnya:

```bash
cp .env.example .env.local
```

### Menjalankan Development Server

Jalankan perintah berikut untuk mengaktifkan local development server:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) melalui browser untuk melihat aplikasi.

### Melakukan Build Produksi

Untuk memvalidasi build produksi dan memeriksa kompatibilitas:

```bash
npm run build
```
