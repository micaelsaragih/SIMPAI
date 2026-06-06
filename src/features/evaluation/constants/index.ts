import type { UATQuestion } from "../types"

// ─── Performance Thresholds ──────────────────────────────────────────────────

export const PERFORMANCE_THRESHOLDS = {
  structureDetectionMs: 500,
  templateComplianceMs: 500,
  languageAnalysisMs: 2000,
  fullPipelineMs: 5000,
} as const

// ─── UAT Question Bank ───────────────────────────────────────────────────────

export const UAT_QUESTIONS: UATQuestion[] = [
  // Usability (Kemudahan Penggunaan)
  {
    id: "UAT-001",
    category: "usability",
    question: "Antarmuka SIMPAI mudah dipahami oleh pengguna baru.",
    description: "Menilai kesederhanaan dan kejelasan desain UI SIMPAI bagi pengguna awam."
  },
  {
    id: "UAT-002",
    category: "usability",
    question: "Alur pengunggahan draf artikel dan template jurnal intuitif dan terarah.",
    description: "Menilai kelancaran wizard step-by-step dalam mengunggah berkas."
  },
  {
    id: "UAT-003",
    category: "usability",
    question: "Warna, tipografi, dan elemen visual nyaman dilihat dan konsisten.",
    description: "Menilai kenyamanan visual dan keterbacaan teks di seluruh sistem."
  },
  {
    id: "UAT-004",
    category: "usability",
    question: "Hasil analisis disajikan secara sistematis melalui tabel dan grafik yang jelas.",
    description: "Menilai kegunaan visualisasi skor dan temuan analisis di tab hasil."
  },
  {
    id: "UAT-005",
    category: "usability",
    question: "Pesan kesalahan (error message) informatif dan membantu menyelesaikan masalah.",
    description: "Menilai kejelasan pesan ketika terjadi masalah format berkas atau kegagalan koneksi."
  },

  // Functionality (Fungsionalitas)
  {
    id: "UAT-006",
    category: "functionality",
    question: "Sistem mendeteksi keberadaan sembilan bagian akademik dengan akurat.",
    description: "Menilai keandalan deteksi bagian seperti Abstrak, Pendahuluan, Metode, dll."
  },
  {
    id: "UAT-007",
    category: "functionality",
    question: "Analisis kepatuhan struktur terhadap template jurnal berjalan dengan benar.",
    description: "Menilai kebenaran perbandingan urutan heading draf dengan template."
  },
  {
    id: "UAT-008",
    category: "functionality",
    question: "Koreksi kata tidak baku sesuai KBBI mendeteksi kesalahan kosakata dengan tepat.",
    description: "Menilai kegunaan dari daftar kata tidak baku yang diidentifikasi."
  },
  {
    id: "UAT-009",
    category: "functionality",
    question: "Aturan ejaan dan tanda baca PUEBI diterapkan dengan baik pada artikel.",
    description: "Menilai deteksi kesalahan penulisan kapital, spasi, dan tanda baca."
  },
  {
    id: "UAT-010",
    category: "functionality",
    question: "Identifikasi gaya bahasa non-akademik membantu memperbaiki nada tulisan ilmiah.",
    description: "Menilai akurasi deteksi kata ganti orang pertama dan bahasa tidak formal."
  },

  // Performance (Performa dan Kecepatan)
  {
    id: "UAT-011",
    category: "performance",
    question: "Waktu respons perpindahan halaman di dashboard sangat cepat.",
    description: "Menilai latensi navigasi antar modul SIMPAI."
  },
  {
    id: "UAT-012",
    category: "performance",
    question: "Proses parsing dokumen DOCX selesai dalam waktu yang wajar.",
    description: "Menilai durasi ekstraksi teks dari draf artikel."
  },
  {
    id: "UAT-013",
    category: "performance",
    question: "Mesin analisis kebahasaan memberikan hasil secara instan.",
    description: "Menilai kecepatan deteksi lokal KBBI, PUEBI, dan Style."
  },
  {
    id: "UAT-014",
    category: "performance",
    question: "Rekomendasi perbaikan AI muncul tanpa penundaan waktu yang lama.",
    description: "Menilai latensi pemanggilan API AI eksternal/offline."
  },
  {
    id: "UAT-015",
    category: "performance",
    question: "Aplikasi berjalan dengan stabil tanpa crash atau pembekuan (freezing).",
    description: "Menilai stabilitas sistem secara keseluruhan selama pengujian."
  },

  // Academic Value (Nilai Akademik)
  {
    id: "UAT-016",
    category: "academic-value",
    question: "SIMPAI membantu penulis mempersiapkan draf artikel sebelum dikirim ke jurnal.",
    description: "Menilai signifikansi manfaat SIMPAI dalam pra-pengajuan jurnal."
  },
  {
    id: "UAT-017",
    category: "academic-value",
    question: "Skor penilaian (0-100) mencerminkan kualitas struktur dan tata bahasa secara realistis.",
    description: "Menilai validitas formula pembobotan skor SIMPAI."
  },
  {
    id: "UAT-018",
    category: "academic-value",
    question: "Rekomendasi perbaikan AI relevan dan mudah ditindaklanjuti secara akademis.",
    description: "Menilai kualitas saran penyuntingan yang diberikan AI."
  },
  {
    id: "UAT-019",
    category: "academic-value",
    question: "Fitur pencocokan template mengurangi risiko penolakan administratif oleh jurnal.",
    description: "Menilai efektivitas visualisasi kepatuhan template."
  },
  {
    id: "UAT-020",
    category: "academic-value",
    question: "SIMPAI layak direkomendasikan kepada mahasiswa dan rekan peneliti lainnya.",
    description: "Menilai kepuasan akhir dan nilai rekomendasi pengguna."
  }
]
