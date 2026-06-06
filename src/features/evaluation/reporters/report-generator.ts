import type { EvaluationReport } from "../types"

/**
 * Generates a research-quality Markdown evaluation report from the aggregated data.
 */
export function generateEvaluationReport(report: EvaluationReport): string {
  const timestampStr = new Date(report.timestamp).toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    dateStyle: "full",
    timeStyle: "medium",
  })

  let md = ""

  // Header & Title
  md += `# Laporan Evaluasi & Pengujian Sistem SIMPAI\n\n`
  md += `> [!NOTE]\n`
  md += `> Dokumen ini berisi bukti evaluasi kualitas riset (research-quality evidence) dari fungsionalitas, akurasi metode aturan, ketepatan kebahasaan, tingkat kepatuhan template, kecepatan sistem, serta kuesioner UAT untuk SIMPAI.\n\n`

  md += `| Parameter | Detail |\n`
  md += `| :--- | :--- |\n`
  md += `| **Waktu Evaluasi** | ${timestampStr} |\n`
  md += `| **Versi Sistem** | ${report.systemVersion} |\n`
  md += `| **Akurasi Keseluruhan** | **${report.summary.overallAccuracy}%** |\n`
  md += `| **Total Kasus Uji** | ${report.summary.totalTests} |\n`
  md += `| **Kasus Uji Lolos** | ${report.summary.totalPassed} |\n`
  md += `| **Kasus Uji Gagal** | ${report.summary.totalFailed} |\n\n`

  md += `---\n\n`

  // 1. Black Box Testing Section
  md += `## 1. Pengujian Fungsional (Black Box Testing)\n\n`
  md += `Menguji modul utama sistem SIMPAI secara fungsional berdasarkan input-output tanpa dependensi internal:\n\n`
  md += `| ID | Modul | Skenario Uji | Hasil | Catatan |\n`
  md += `| :--- | :--- | :--- | :--- | :--- |\n`
  for (const res of report.blackBox.results) {
    const status = res.passed ? "✅ Lolos" : "❌ Gagal"
    md += `| ${res.id} | ${report.blackBox.results.find(r => r.id === res.id) ? "Sistem" : ""} | ${res.name} | **${status}** | ${res.message || "-"} |\n`
  }
  md += `\n*Tingkat Kelulusan Fungsional: **${report.blackBox.accuracy}%** (${report.blackBox.passed}/${report.blackBox.total} Skenario)*\n\n`

  md += `---\n\n`

  // 2. Structure Detection Accuracy Section
  md += `## 2. Evaluasi Akurasi Deteksi Struktur (9 Bagian Akademik)\n\n`
  md += `Menguji keandalan mesin deteksi struktur dokumen akademik (analyzeStructure) dengan 15 dokumen uji:\n\n`
  md += `| ID | Skenario Dokumen | Hasil | Temuan Deteksi | Penjelasan Kesalahan |\n`
  md += `| :--- | :--- | :--- | :--- | :--- |\n`
  for (const res of report.structureAccuracy.results) {
    const status = res.passed ? "✅ Lolos" : "❌ Gagal"
    md += `| ${res.id} | ${res.name} | **${status}** | \`${res.actual}\` | ${res.passed ? "Sesuai ekspektasi" : res.message} |\n`
  }
  md += `\n*Akurasi Deteksi Struktur: **${report.structureAccuracy.accuracy}%** (${report.structureAccuracy.passed}/${report.structureAccuracy.total} Kasus)*\n\n`

  md += `---\n\n`

  // 3. Template Compliance Section
  md += `## 3. Evaluasi Kepatuhan Template Jurnal\n\n`
  md += `Menguji akurasi perbandingan kemiripan draf artikel terhadap template (compareWithTemplate) dengan 10 skenario:\n\n`
  md += `| ID | Deskripsi Kasus | Hasil | Metrik (Skor, Hilang, Lebih, Salah Urut) | Detail Mismatch |\n`
  md += `| :--- | :--- | :--- | :--- | :--- |\n`
  for (const res of report.complianceAccuracy.results) {
    const status = res.passed ? "✅ Lolos" : "❌ Gagal"
    md += `| ${res.id} | ${res.name} | **${status}** | \`${res.actual}\` | ${res.passed ? "Sesuai" : res.message} |\n`
  }
  md += `\n*Akurasi Analisis Kepatuhan: **${report.complianceAccuracy.accuracy}%** (${report.complianceAccuracy.passed}/${report.complianceAccuracy.total} Kasus)*\n\n`

  md += `---\n\n`

  // 4. Language Engine Section
  md += `## 4. Evaluasi Akurasi Mesin Bahasa (KBBI, PUEBI, Style)\n\n`
  md += `Menguji efektivitas aturan pencocokan tata bahasa lokal Indonesia dengan 15 skenario kebahasaan:\n\n`
  md += `| ID | Jenis Aturan | Kalimat Uji | Hasil | Deteksi Temuan (Jumlah & Jenis) |\n`
  md += `| :--- | :--- | :--- | :--- | :--- |\n`
  for (const res of report.languageAccuracy.results) {
    const status = res.passed ? "✅ Lolos" : "❌ Gagal"
    md += `| ${res.id} | ${res.name} | *\"${report.languageAccuracy.results.find(r => r.id === res.id) ? "Teks" : ""}\"* | **${status}** | \`${res.actual}\` |\n`
  }
  md += `\n*Akurasi Mesin Bahasa: **${report.languageAccuracy.accuracy}%** (${report.languageAccuracy.passed}/${report.languageAccuracy.total} Kasus)*\n\n`

  md += `---\n\n`

  // 5. Performance Benchmarks Section
  md += `## 5. Tolok Ukur Kinerja Kecepatan (Performance Benchmarking)\n\n`
  md += `Menghitung durasi pemrosesan rata-rata pada server (3 iterasi dokumen ~600 kata):\n\n`
  md += `| Nama Operasi Pipiline | Durasi Rata-rata | Batas Ambang (Threshold) | Status Kecepatan |\n`
  md += `| :--- | :--- | :--- | :--- |\n`
  for (const bench of report.performance.benchmarks) {
    const status = bench.passed ? "⚡ Cepat (Lolos)" : "⚠️ Lambat (Gagal)"
    md += `| ${bench.operation} | ${bench.durationMs} ms | ${bench.thresholdMs} ms | **${status}** |\n`
  }
  const overallPerf = report.performance.passed ? "Lolos Seluruh Ambang Batas" : "Terdapat Bottleneck Kecepatan"
  md += `\n*Status Performa Sistem: **${overallPerf}**.*\n\n`

  md += `---\n\n`

  // 6. UAT Section
  md += `## 6. Template Kuesioner UAT (User Acceptance Testing)\n\n`
  md += `Kuesioner ini siap diekspor untuk diisi oleh pengguna (mahasiswa, dosen, dan peneliti) menggunakan Skala Likert 1-5:\n`
  md += `*1: Sangat Tidak Setuju (STS), 2: Tidak Setuju (TS), 3: Netral (N), 4: Setuju (S), 5: Sangat Setuju (SS)*\n\n`

  md += `### Kategori A: Kemudahan Penggunaan (Usability)\n`
  for (const q of report.uat.questions.filter(q => q.category === "usability")) {
    md += `- **[ ]** **${q.id}**: ${q.question}  \n  *(${q.description})*\n`
  }
  md += `\n`

  md += `### Kategori B: Ketepatan Fungsi (Functionality)\n`
  for (const q of report.uat.questions.filter(q => q.category === "functionality")) {
    md += `- **[ ]** **${q.id}**: ${q.question}  \n  *(${q.description})*\n`
  }
  md += `\n`

  md += `### Kategori C: Kecepatan Respon (Performance)\n`
  for (const q of report.uat.questions.filter(q => q.category === "performance")) {
    md += `- **[ ]** **${q.id}**: ${q.question}  \n  *(${q.description})*\n`
  }
  md += `\n`

  md += `### Kategori D: Nilai Manfaat Akademik (Academic Value)\n`
  for (const q of report.uat.questions.filter(q => q.category === "academic-value")) {
    md += `- **[ ]** **${q.id}**: ${q.question}  \n  *(${q.description})*\n`
  }
  md += `\n`

  md += `### Lembar Tanda Tangan UAT\n\n`
  md += `\`\`\`text\n`
  md += `Dengan ini menyatakan bahwa sistem SIMPAI telah diuji coba dan dievaluasi sesuai laporan di atas.\n\n`
  md += `Penguji/Responden UAT,                 Peneliti/Pengembang SIMPAI,\n\n\n\n`
  md += `(_________________________)            (_________________________)\n`
  md += `NIM/NIDN.                              NIDN.\n`
  md += `\`\`\`\n`

  return md
}
