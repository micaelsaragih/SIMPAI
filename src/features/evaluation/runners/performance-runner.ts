import type { PerformanceBenchmark } from "../types"
import { PERFORMANCE_THRESHOLDS } from "../constants"
import { buildMockParsedDocument } from "./structure-runner"
import { analyzeStructure } from "@/features/analysis-engine/detectors/section-detector"
import { compareWithTemplate } from "@/features/analysis-engine/comparators/template-comparator"
import { analyzeLanguage } from "@/features/language-engine/services/language-analysis-service"
import { runAnalysis } from "@/features/analysis-engine/services/analysis-service"

/**
 * Runs performance benchmarks for the analysis pipeline.
 */
export function runPerformanceBenchmarks(): PerformanceBenchmark[] {
  // Create a realistic sample document for benchmarking (approx 600 words)
  const headings = [
    { level: 1, text: "Judul Pengujian Performa Sistem SIMPAI" },
    { level: 1, text: "Abstrak" },
    { level: 1, text: "Kata Kunci" },
    { level: 1, text: "Pendahuluan" },
    { level: 1, text: "Metodologi" },
    { level: 1, text: "Hasil dan Pembahasan" },
    { level: 1, text: "Kesimpulan" },
    { level: 1, text: "Daftar Pustaka" }
  ]

  const paragraphs = [
    { text: "Ini adalah judul penelitian ilmiah yang sangat menarik untuk diuji." },
    { text: "Abstrak ini dibuat cukup panjang untuk mensimulasikan dokumen nyata. Abstrak adalah ringkasan singkat dari seluruh isi dokumen ilmiah yang menjelaskan latar belakang masalah, tujuan penelitian, metodologi yang digunakan, hasil temuan utama, dan kesimpulan akhir secara ringkas dan padat. Teks ini ditulis dengan gaya bahasa formal agar memenuhi ketentuan akademis. Kami memastikan kata-katanya cukup banyak." },
    { text: "performa, analisis, kebahasaan, simpai, pengujian" },
    { text: "Pendahuluan adalah bab pertama yang menjelaskan latar belakang dilakukannya penelitian ini. Di sini dipaparkan rumusan masalah, tujuan penelitian, serta signifikansi dari studi yang dilakukan. Peneliti juga memaparkan landasan teori awal dan ulasan pustaka singkat mengenai penelitian-penelitian terdahulu yang relevan dengan topik ini. Kami menulisnya secara formal." },
    { text: "Metode penelitian ini menggunakan pendekatan kuantitatif dengan survei terhadap responden. Data yang dikumpulkan kemudian dianalisis menggunakan perangkat lunak statistik untuk menguji hipotesis yang telah dirumuskan sebelumnya. Seluruh proses pengukuran dan sampling dijelaskan secara terperinci untuk menjamin replikasi studi di masa mendatang." },
    { text: "Hasil penelitian menunjukkan bahwa terdapat pengaruh signifikan dari variabel bebas terhadap variabel terikat. Temuan ini didukung oleh data statistik deskriptif dan inferensial yang disajikan dalam bentuk tabel dan gambar. Pembahasan menguraikan makna dari temuan hasil penelitian. Peneliti membandingkan hasil ini dengan temuan dari penelitian terdahulu yang ada di dalam tinjauan pustaka." },
    { text: "Kesimpulan menyimpulkan seluruh jawaban atas rumusan masalah penelitian. Saran diberikan untuk penelitian selanjutnya agar dapat mengembangkan topik ini dengan lebih baik." },
    { text: "[1] Penulis A. (2026). Judul Buku Referensi. Penerbit B.\n[2] Penulis C. (2025). Artikel Jurnal. Jurnal Ilmiah." }
  ]

  const draftDoc = buildMockParsedDocument(headings, paragraphs)
  const templateDoc = buildMockParsedDocument(headings, paragraphs) // Perfect match

  const benchmarks: PerformanceBenchmark[] = []

  // Helper to time a function over N iterations
  const timeOperation = (op: () => void, iterations = 3): number => {
    let totalDuration = 0
    for (let i = 0; i < iterations; i++) {
      const start = performance.now()
      op()
      const end = performance.now()
      totalDuration += (end - start)
    }
    return totalDuration / iterations
  }

  // 1. Structure Detection
  const durationStructure = timeOperation(() => {
    analyzeStructure(draftDoc)
  })
  benchmarks.push({
    operation: "Deteksi Struktur Dokumen (analyzeStructure)",
    durationMs: Math.round(durationStructure * 100) / 100,
    thresholdMs: PERFORMANCE_THRESHOLDS.structureDetectionMs,
    passed: durationStructure <= PERFORMANCE_THRESHOLDS.structureDetectionMs
  })

  // 2. Template Compliance
  const durationCompliance = timeOperation(() => {
    compareWithTemplate(draftDoc, templateDoc)
  })
  benchmarks.push({
    operation: "Kesesuaian Template (compareWithTemplate)",
    durationMs: Math.round(durationCompliance * 100) / 100,
    thresholdMs: PERFORMANCE_THRESHOLDS.templateComplianceMs,
    passed: durationCompliance <= PERFORMANCE_THRESHOLDS.templateComplianceMs
  })

  // 3. Language Analysis (KBBI, PUEBI, Style)
  const durationLanguage = timeOperation(() => {
    analyzeLanguage(draftDoc)
  })
  benchmarks.push({
    operation: "Analisis Kebahasaan Lokal (analyzeLanguage)",
    durationMs: Math.round(durationLanguage * 100) / 100,
    thresholdMs: PERFORMANCE_THRESHOLDS.languageAnalysisMs,
    passed: durationLanguage <= PERFORMANCE_THRESHOLDS.languageAnalysisMs
  })

  // 4. Full Analysis Pipeline
  const durationPipeline = timeOperation(() => {
    runAnalysis(draftDoc, templateDoc)
  })
  benchmarks.push({
    operation: "Alur Analisis Lengkap (runAnalysis)",
    durationMs: Math.round(durationPipeline * 100) / 100,
    thresholdMs: PERFORMANCE_THRESHOLDS.fullPipelineMs,
    passed: durationPipeline <= PERFORMANCE_THRESHOLDS.fullPipelineMs
  })

  return benchmarks
}
