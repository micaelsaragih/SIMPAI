"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Calendar,
  Copy,
  PlusCircle,
  FileText,
  Sparkles,
  ArrowLeft,
  AlertCircle,
  FileSpreadsheet,
  Printer,
  ChevronRight,
  TrendingUp,
  Brain
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Progress, ProgressTrack, ProgressIndicator } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { toast } from "sonner"
import type { AnalysisResult } from "@/features/analysis-engine/types"
import type { AIReviewFinding } from "@/services/ai/types"

export function AnalysisResultView() {
  const router = useRouter()
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("simpai_analysis_result")
      if (stored) {
        setResult(JSON.parse(stored))
      }
    } catch (err) {
      console.error("Error loading analysis result:", err)
      toast.error("Gagal memuat hasil analisis dari sesi.")
    } finally {
      setLoading(false)
    }
  }, [])

  const handleNewAnalysis = () => {
    router.push("/analysis/new")
  }

  const handleCopySummary = () => {
    if (!result) return
    const textToCopy = `
=== HASIL ANALISIS DOKUMEN SIMPAI ===
Judul: ${result.documentTitle}
Tanggal Analisis: ${new Date(result.analyzedAt).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    })}
Mode Analisis: ${result.mode === "template-based" ? "Analisis dengan Template" : "Analisis Draft Saja"}
Skor Akhir: ${result.score.finalScore}/100 (${result.score.gradeLabel})

RINGKASAN EVALUASI:
${result.summary.highlights.map(h => `- ${h}`).join("\n")}
====================================
    `.trim()

    navigator.clipboard.writeText(textToCopy)
      .then(() => toast.success("Ringkasan analisis disalin ke clipboard!"))
      .catch(() => toast.error("Gagal menyalin ringkasan."))
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Memuat hasil analisis...</p>
      </div>
    )
  }

  if (!result) {
    return (
      <Card className="border-dashed border-2 max-w-xl mx-auto mt-8">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-4">
          <div className="flex size-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
            <AlertCircle className="size-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold">Hasil Analisis Kosong</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Tidak ada data analisis aktif yang ditemukan di sesi Anda saat ini. Silakan mulai analisis baru.
            </p>
          </div>
          <Button onClick={handleNewAnalysis} className="gap-2 font-semibold">
            <PlusCircle className="size-4" />
            Mulai Analisis Baru
          </Button>
        </CardContent>
      </Card>
    )
  }

  const { score, structure, compliance, documentStats } = result
  const isTemplateBased = result.mode === "template-based"

  const renderFindingCard = (finding: AIReviewFinding, idx: number) => {
    let severityColor = "text-blue-500 border-blue-500/20 bg-blue-500/5 dark:bg-blue-500/10"
    if (finding.severity === "high") {
      severityColor = "text-destructive border-destructive/20 bg-destructive/5 dark:bg-destructive/10 font-bold"
    } else if (finding.severity === "medium") {
      severityColor = "text-amber-500 border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10 font-semibold"
    }

    return (
      <Card key={idx} className="border border-foreground/10 bg-card overflow-hidden hover:border-foreground/15 transition-all">
        <CardHeader className="py-3 px-4 bg-muted/20 border-b border-foreground/5 flex flex-row items-center justify-between gap-4">
          <CardTitle className="text-xs font-bold text-foreground truncate max-w-[70%]" title={finding.finding}>
            Temuan: {finding.finding}
          </CardTitle>
          <Badge variant="outline" className={`px-2 py-0.5 text-[9px] rounded-full uppercase ${severityColor}`}>
            {finding.severity}
          </Badge>
        </CardHeader>
        <CardContent className="p-4 text-xs space-y-3">
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Saran Perbaikan:</span>
            <p className="text-foreground/90 font-medium leading-relaxed">
              {finding.suggestedRevision}
            </p>
          </div>
          {finding.exampleCorrection && (
            <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border-l-2 border-emerald-500 p-3 rounded-r-xl space-y-1">
              <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                Contoh Koreksi:
              </span>
              <p className="text-foreground/90 font-mono text-[11px] whitespace-pre-wrap leading-relaxed">
                {finding.exampleCorrection}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const renderAIUnavailable = () => {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 border border-dashed border-amber-500/30 rounded-xl bg-amber-500/5 w-full">
        <div className="flex size-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
          <AlertTriangle className="size-6 animate-pulse" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-foreground">AI review is temporarily unavailable.</h4>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Analisis ulasan cerdas berbasis kecerdasan buatan sedang tidak aktif atau terhambat masalah jaringan. Evaluasi berbasis aturan tetap berjalan secara offline.
          </p>
        </div>
      </div>
    )
  }

  // Determine grade colors
  let gradeColor = "text-emerald-500 border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10"
  let circleColor = "stroke-emerald-500"
  if (score.grade === "Good") {
    gradeColor = "text-blue-500 border-blue-500/20 bg-blue-500/5 dark:bg-blue-500/10"
    circleColor = "stroke-blue-500"
  } else if (score.grade === "Fair") {
    gradeColor = "text-amber-500 border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10"
    circleColor = "stroke-amber-500"
  } else if (score.grade === "Needs Improvement") {
    gradeColor = "text-destructive border-destructive/20 bg-destructive/5 dark:bg-destructive/10"
    circleColor = "stroke-destructive"
  }

  // Radius of circular SVG indicator
  const radius = 50
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (circumference * score.finalScore) / 100

  return (
    <div className="space-y-6 print:space-y-4 print:p-0">
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          header, footer, nav, aside, button, .print\\:hidden {
            display: none !important;
          }
          .print\\:w-full {
            width: 100% !important;
            max-width: 100% !important;
          }
          .print\\:border-none {
            border: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>

      {/* Breadcrumb / Nav Back */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNewAnalysis}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Kembali ke Analisis
        </Button>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopySummary}
            className="gap-2 flex-1 sm:flex-none"
          >
            <Copy className="size-4" />
            Salin Ringkasan
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="gap-2 flex-1 sm:flex-none"
          >
            <Printer className="size-4" />
            Cetak / PDF
          </Button>
          <Button
            size="sm"
            onClick={handleNewAnalysis}
            className="gap-2 flex-1 sm:flex-none font-semibold"
          >
            <PlusCircle className="size-4" />
            Analisis Baru
          </Button>
        </div>
      </div>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-foreground/5 pb-4 print:pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-wider uppercase text-primary bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
              HASIL ANALISIS
            </span>
            <Badge variant={isTemplateBased ? "default" : "secondary"} className="text-[10px] rounded-full">
              {isTemplateBased ? "Template-Based" : "Draft-Only"}
            </Badge>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground truncate max-w-[600px] print:text-lg">
            {result.documentTitle}
          </h1>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Calendar className="size-3.5" />
            Dianalisis pada {new Date(result.analyzedAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}
          </p>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid gap-6 md:grid-cols-12">
        {/* Score Circular Badge */}
        <Card className="md:col-span-4 border border-foreground/10 bg-card overflow-hidden flex flex-col justify-between">
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Skor Keseluruhan</CardTitle>
            <CardDescription className="text-xs">Nilai kelengkapan dan kepatuhan artikel</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6 space-y-4 pt-0">
            {/* SVG Radial Progress */}
            <div className="relative flex items-center justify-center size-36">
              <svg className="size-full -rotate-90">
                {/* Track circle */}
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className="stroke-muted"
                  strokeWidth="10"
                  fill="transparent"
                />
                {/* Score indicator circle */}
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className={`${circleColor} transition-all duration-1000 ease-in-out`}
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              {/* Inner score label */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold tracking-tight tabular-nums">
                  {score.finalScore}
                </span>
                <span className="text-[10px] font-medium text-muted-foreground">
                  dari 100
                </span>
              </div>
            </div>
            {/* Grade Badge */}
            <Badge variant="outline" className={`px-4 py-1 text-xs font-bold rounded-full border ${gradeColor}`}>
              {score.gradeLabel}
            </Badge>
          </CardContent>
        </Card>

        {/* Score Breakdown Progress Bars */}
        <Card className="md:col-span-5 border border-foreground/10 bg-card flex flex-col justify-between">
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Rincian Evaluasi</CardTitle>
            <CardDescription className="text-xs">Bobot kontribusi setiap aspek nilai</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-5">
            {/* Aspek 1: Kelengkapan Struktur */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-foreground">
                  Kelengkapan Struktur
                </span>
                <span className="font-medium text-muted-foreground">
                  {score.breakdown.structureScore}/100
                </span>
              </div>
              <Progress value={score.breakdown.structureScore} className="h-2">
                <ProgressTrack>
                  <ProgressIndicator className="bg-emerald-500" />
                </ProgressTrack>
              </Progress>
              <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                <span>Evaluasi 9 bagian standar akademik</span>
                <span>Bobot: {(score.breakdown.structureWeight * 100).toFixed(0)}%</span>
              </div>
            </div>

            {/* Aspek 2: Kepatuhan Template */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-foreground">
                  Kesesuaian Template
                </span>
                <span className="font-medium text-muted-foreground">
                  {score.breakdown.complianceScore}/100
                </span>
              </div>
              <Progress value={score.breakdown.complianceScore} className="h-2">
                <ProgressTrack>
                  <ProgressIndicator className="bg-blue-500" />
                </ProgressTrack>
              </Progress>
              <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                <span>{isTemplateBased ? "Kesesuaian dengan struktur jurnal acuan" : "Diperlakukan 100% (Draft-Only)"}</span>
                <span>Bobot: {(score.breakdown.complianceWeight * 100).toFixed(0)}%</span>
              </div>
            </div>

            {/* Aspek 3: Keteraturan Bahasa */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-foreground">
                  Kualitas Bahasa
                </span>
                <span className="font-medium text-muted-foreground">
                  {score.breakdown.languageScore}/100
                </span>
              </div>
              <Progress value={score.breakdown.languageScore} className="h-2">
                <ProgressTrack>
                  <ProgressIndicator className="bg-amber-500" />
                </ProgressTrack>
              </Progress>
              <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                <span>Evaluasi tata bahasa akademik, KBBI, dan PUEBI</span>
                <span>Bobot: {(score.breakdown.languageWeight * 100).toFixed(0)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats and Files Card */}
        <Card className="md:col-span-3 border border-foreground/10 bg-card flex flex-col justify-between">
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Statistik Dokumen</CardTitle>
            <CardDescription className="text-xs">Hasil parsing detil draf artikel</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 text-xs space-y-3">
            <div className="flex justify-between items-center py-1.5 border-b border-foreground/5">
              <span className="text-muted-foreground">Jumlah Kata</span>
              <span className="font-semibold text-foreground">{documentStats.wordCount.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-foreground/5">
              <span className="text-muted-foreground">Jumlah Heading</span>
              <span className="font-semibold text-foreground">{documentStats.headingCount}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-foreground/5">
              <span className="text-muted-foreground">Jumlah Paragraph</span>
              <span className="font-semibold text-foreground">{documentStats.paragraphCount}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-foreground/5">
              <span className="text-muted-foreground">Karakter</span>
              <span className="font-semibold text-foreground">{documentStats.characterCount.toLocaleString("id-ID")}</span>
            </div>
            {isTemplateBased && result.templateTitle && (
              <div className="flex flex-col gap-1 pt-2">
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Template Acuan:</span>
                <span className="font-medium text-foreground truncate max-w-full flex items-center gap-1">
                  <FileSpreadsheet className="size-3.5 text-emerald-500 shrink-0" />
                  {result.templateTitle}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Summary Bullet Points Card */}
      <Card className="border border-foreground/10 bg-card overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 py-4 flex items-center gap-2 border-b border-foreground/5">
          <Sparkles className="size-4.5 text-primary animate-pulse" />
          <h2 className="text-sm font-semibold text-foreground">Ringkasan Temuan Utama</h2>
        </div>
        <CardContent className="p-6">
          <ul className="grid gap-3.5 md:grid-cols-2 text-xs">
            {result.summary.highlights.map((highlight, index) => {
              // Determine status indicator based on text keywords
              let icon = <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
              let itemBg = "bg-emerald-500/5 border-emerald-500/10 dark:bg-emerald-500/10"

              if (
                highlight.toLowerCase().includes("tidak ditemukan") ||
                highlight.toLowerCase().includes("belum ada") ||
                highlight.toLowerCase().includes("masalah urutan")
              ) {
                icon = <XCircle className="size-4 text-destructive shrink-0 mt-0.5" />
                itemBg = "bg-destructive/5 border-destructive/10 dark:bg-destructive/10"
              } else if (
                highlight.toLowerCase().includes("kurang lengkap") ||
                highlight.toLowerCase().includes("tambahan") ||
                highlight.toLowerCase().includes("revisi")
              ) {
                icon = <AlertTriangle className="size-4 text-amber-500 shrink-0 mt-0.5" />
                itemBg = "bg-amber-500/5 border-amber-500/10 dark:bg-amber-500/10"
              } else if (highlight.toLowerCase().includes("skor")) {
                icon = <TrendingUp className="size-4 text-blue-500 shrink-0 mt-0.5" />
                itemBg = "bg-blue-500/5 border-blue-500/10 dark:bg-blue-500/10"
              }

              return (
                <li
                  key={index}
                  className={`flex gap-3 p-3 rounded-xl border ${itemBg} transition-all hover:translate-x-0.5 duration-200`}
                >
                  {icon}
                  <span className="text-foreground/90 font-medium leading-relaxed">
                    {highlight}
                  </span>
                </li>
              )
            })}
          </ul>
        </CardContent>
      </Card>

      {/* Tabs for Detailed Reports */}
      <Tabs defaultValue="structure" className="w-full">
        <TabsList className="w-full justify-start border-b border-foreground/5 bg-transparent rounded-none h-auto p-0 gap-6 overflow-x-auto">
          <TabsTrigger
            value="structure"
            className="data-active:border-primary data-active:text-primary border-b-2 rounded-none px-1 py-3 text-xs font-semibold shrink-0"
          >
            Evaluasi Struktur
          </TabsTrigger>
          {isTemplateBased && (
            <TabsTrigger
              value="compliance"
              className="data-active:border-primary data-active:text-primary border-b-2 rounded-none px-1 py-3 text-xs font-semibold shrink-0"
            >
              Kesesuaian Template
            </TabsTrigger>
          )}
          <TabsTrigger
            value="language"
            className="data-active:border-primary data-active:text-primary border-b-2 rounded-none px-1 py-3 text-xs font-semibold shrink-0"
          >
            Analisis Bahasa
          </TabsTrigger>
          <TabsTrigger
            value="ai-review"
            className="data-active:border-primary data-active:text-primary border-b-2 rounded-none px-1 py-3 text-xs font-semibold shrink-0"
          >
            AI Review
          </TabsTrigger>
          <TabsTrigger
            value="puebi"
            className="data-active:border-primary data-active:text-primary border-b-2 rounded-none px-1 py-3 text-xs font-semibold shrink-0"
          >
            PUEBI
          </TabsTrigger>
          <TabsTrigger
            value="kbbi"
            className="data-active:border-primary data-active:text-primary border-b-2 rounded-none px-1 py-3 text-xs font-semibold shrink-0"
          >
            KBBI
          </TabsTrigger>
          <TabsTrigger
            value="academic-style"
            className="data-active:border-primary data-active:text-primary border-b-2 rounded-none px-1 py-3 text-xs font-semibold shrink-0"
          >
            Academic Style
          </TabsTrigger>
          <TabsTrigger
            value="ai-recommendations"
            className="data-active:border-primary data-active:text-primary border-b-2 rounded-none px-1 py-3 text-xs font-semibold shrink-0"
          >
            Rekomendasi AI
          </TabsTrigger>
        </TabsList>

        <div className="pt-6">
          {/* TAB 1: EVALUASI STRUKTUR */}
          <TabsContent value="structure" className="space-y-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-bold">Laporan Kelengkapan Struktur</h3>
              <p className="text-xs text-muted-foreground">
                Sembilan bagian standar artikel ilmiah akademik internasional.
              </p>
            </div>

            <div className="grid gap-3.5">
              {structure.sections.map((sec, idx) => {
                let statusBadge = (
                  <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/5 font-semibold text-[10px]">
                    FOUND
                  </Badge>
                )
                let itemBorder = "border-emerald-500/10 hover:border-emerald-500/30"
                let leftAccent = "bg-emerald-500"
                let adviceText = "Bagian ini terdeteksi dengan baik dan memenuhi batas minimum kata."

                if (sec.status === "MISSING") {
                  statusBadge = (
                    <Badge variant="outline" className="text-destructive border-destructive/20 bg-destructive/5 font-semibold text-[10px]">
                      MISSING
                    </Badge>
                  )
                  itemBorder = "border-destructive/10 hover:border-destructive/30"
                  leftAccent = "bg-destructive"
                  adviceText = `Sangat direkomendasikan menambahkan bagian ini. Gunakan heading '${sec.label}' agar mudah dideteksi.`
                } else if (sec.status === "PARTIAL") {
                  statusBadge = (
                    <Badge variant="outline" className="text-amber-500 border-amber-500/20 bg-amber-500/5 font-semibold text-[10px]">
                      PARTIAL
                    </Badge>
                  )
                  itemBorder = "border-amber-500/10 hover:border-amber-500/30"
                  leftAccent = "bg-amber-500"
                  adviceText = `Isi materi terdeteksi singkat (${sec.wordCount} kata). Kembangkan konten agar memenuhi standar kedalaman kajian akademik.`
                } else if (sec.status === "UNCERTAIN") {
                  statusBadge = (
                    <Badge variant="outline" className="text-purple-500 border-purple-500/20 bg-purple-500/5 font-semibold text-[10px]">
                      UNCERTAIN
                    </Badge>
                  )
                  itemBorder = "border-purple-500/10 hover:border-purple-500/30"
                  leftAccent = "bg-purple-500"
                  adviceText = `Bagian ini terdeteksi dengan tingkat keyakinan rendah. Pastikan judul dan format penulisan sudah sesuai standar akademik.`
                }

                return (
                  <div
                    key={idx}
                    className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl border bg-card transition-all duration-200 ${itemBorder}`}
                  >
                    <div className="flex gap-3 items-start sm:items-center">
                      {/* Color bar */}
                      <div className={`w-1 h-10 rounded-full ${leftAccent} shrink-0`} />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-foreground">
                            {sec.label}
                          </span>
                          {statusBadge}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {adviceText}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 sm:mt-0 sm:text-right text-xs shrink-0 pl-4 sm:pl-0">
                      <div className="text-muted-foreground flex flex-col sm:items-end gap-1">
                        <span className="flex items-center gap-1.5 font-medium sm:justify-end">
                          <ChevronRight className="size-3.5 text-muted-foreground" />
                          Heading: <code className="text-foreground px-1 py-0.2 bg-muted rounded text-[11px] font-mono">{sec.headingMatch || "-"}</code>
                        </span>
                        <span>Jumlah Kata: <strong className="text-foreground font-semibold">{sec.wordCount} kata</strong></span>
                        {sec.detectionMethod && sec.status !== "MISSING" && (
                          <span className="text-[11px] mt-0.5 sm:text-right">
                            Terdeteksi via: <span className="font-semibold text-foreground">{
                              sec.detectionMethod === "heading" ? "Heading Style" :
                              sec.detectionMethod === "keyword" ? "Academic Keyword" :
                              sec.detectionMethod === "bab" ? "BAB Structure" :
                              sec.detectionMethod === "heuristic" ? "Heuristic Detection" :
                              sec.detectionMethod === "fuzzy" ? "Fuzzy Matching" : sec.detectionMethod
                            } ({Math.round(sec.confidence * 100)}%)</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </TabsContent>

          {/* TAB 2: KEPATUHAN TEMPLATE */}
          {isTemplateBased && compliance && (
            <TabsContent value="compliance" className="space-y-6">
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold">Laporan Kesesuaian Struktur Template</h3>
                <p className="text-xs text-muted-foreground">
                  Evaluasi kepatuhan tata letak draf artikel dengan dokumen template jurnal acuan.
                </p>
              </div>

              {/* Grid issues */}
              <div className="grid gap-6 md:grid-cols-3">
                {/* Missing */}
                <Card className="border border-foreground/10 bg-card">
                  <CardHeader className="pb-3 pt-4">
                    <div className="flex items-center gap-2 text-destructive">
                      <XCircle className="size-4.5" />
                      <CardTitle className="text-xs font-bold uppercase tracking-wider">Bagian Hilang ({compliance.missing.length})</CardTitle>
                    </div>
                    <CardDescription className="text-[10px]">Ada di template tapi absen di draft Anda</CardDescription>
                  </CardHeader>
                  <CardContent className="text-xs space-y-2">
                    {compliance.missing.length === 0 ? (
                      <p className="text-muted-foreground italic text-center py-4">Tidak ada bagian yang hilang</p>
                    ) : (
                      <ul className="space-y-1.5">
                        {compliance.missing.map((section, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-foreground/90 font-medium">
                            <span className="size-1.5 rounded-full bg-destructive shrink-0" />
                            {section}
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>

                {/* Wrong Order */}
                <Card className="border border-foreground/10 bg-card">
                  <CardHeader className="pb-3 pt-4">
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertTriangle className="size-4.5 text-red-500" />
                      <CardTitle className="text-xs font-bold uppercase tracking-wider">Salah Urutan ({compliance.orderIssues.length})</CardTitle>
                    </div>
                    <CardDescription className="text-[10px]">Urutan penulisan yang tidak konsisten</CardDescription>
                  </CardHeader>
                  <CardContent className="text-xs space-y-2">
                    {compliance.orderIssues.length === 0 ? (
                      <p className="text-muted-foreground italic text-center py-4">Urutan bagian sudah tepat</p>
                    ) : (
                      <ul className="space-y-2.5">
                        {compliance.orderIssues.map((issue, idx) => (
                          <li key={idx} className="flex flex-col gap-0.5 border-l-2 border-destructive pl-2.5">
                            <span className="font-semibold text-foreground">{issue.section}</span>
                            <span className="text-[10px] text-muted-foreground">
                              Harapan: Posisi #{issue.expectedPosition} | Draf: Posisi #{issue.actualPosition}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>

                {/* Extra Sections */}
                <Card className="border border-foreground/10 bg-card">
                  <CardHeader className="pb-3 pt-4">
                    <div className="flex items-center gap-2 text-amber-500">
                      <Info className="size-4.5" />
                      <CardTitle className="text-xs font-bold uppercase tracking-wider">Bagian Ekstra ({compliance.extra.length})</CardTitle>
                    </div>
                    <CardDescription className="text-[10px]">Bagian tambahan yang tidak dideklarasikan template</CardDescription>
                  </CardHeader>
                  <CardContent className="text-xs space-y-2">
                    {compliance.extra.length === 0 ? (
                      <p className="text-muted-foreground italic text-center py-4">Tidak ada bagian ekstra</p>
                    ) : (
                      <ul className="space-y-1.5">
                        {compliance.extra.map((section, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-foreground/90 font-medium">
                            <span className="size-1.5 rounded-full bg-amber-500 shrink-0" />
                            {section}
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Checklist visualizer flow */}
              <Card className="border border-foreground/10 bg-card">
                <CardHeader className="pb-4">
                  <CardTitle className="text-sm font-semibold text-foreground">Pemetaan Aliran Struktur</CardTitle>
                  <CardDescription className="text-xs">Bandingkan visual sekuen struktur template vs draf artikel</CardDescription>
                </CardHeader>
                <CardContent className="p-6 border-t border-foreground/5 space-y-6 text-xs">
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Template Seq */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <FileSpreadsheet className="size-3.5 text-emerald-600 shrink-0" />
                        Urutan Template
                      </span>
                      <div className="flex flex-col gap-1.5">
                        {compliance.templateSections.map((sec, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-2 bg-muted/30 rounded border border-foreground/5 font-medium">
                            <span className="size-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-[10px]">
                              {idx + 1}
                            </span>
                            <span className="text-foreground">{sec}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Draft Seq */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="size-3.5 text-blue-600 shrink-0" />
                        Urutan Artikel Draft
                      </span>
                      <div className="flex flex-col gap-1.5">
                        {compliance.draftSections.map((sec, idx) => {
                          const inTemplate = compliance.templateSections.includes(sec)
                          const orderOk = compliance.templateSections.indexOf(sec) === idx
                          let badgeBg = "bg-muted/30 text-foreground border-foreground/5"
                          let indexBg = "bg-blue-500/10 text-blue-600"

                          if (!inTemplate) {
                            badgeBg = "bg-amber-500/5 text-amber-600 border-amber-500/10 dark:bg-amber-500/10"
                            indexBg = "bg-amber-500/20 text-amber-600"
                          } else if (!orderOk) {
                            badgeBg = "bg-destructive/5 text-destructive border-destructive/10 dark:bg-destructive/10"
                            indexBg = "bg-destructive/20 text-destructive"
                          }

                          return (
                            <div key={idx} className={`flex items-center gap-3 p-2 rounded border font-medium ${badgeBg}`}>
                              <span className={`size-5 rounded-full font-bold flex items-center justify-center text-[10px] ${indexBg}`}>
                                {idx + 1}
                              </span>
                              <span className="truncate">{sec}</span>
                              {!inTemplate && <span className="ml-auto text-[9px] font-bold uppercase text-amber-500">Ekstra</span>}
                              {inTemplate && !orderOk && <span className="ml-auto text-[9px] font-bold uppercase text-destructive">Salah Posisi</span>}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* TAB 3: ANALISIS BAHASA */}
          <TabsContent value="language" className="space-y-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-bold">Laporan Kualitas Bahasa & Penulisan</h3>
              <p className="text-xs text-muted-foreground">
                Evaluasi tata bahasa, struktur kalimat tidak efektif, dan pilihan kosakata akademik.
              </p>
            </div>

            {(!result.languageIssues || result.languageIssues.length === 0) ? (
              <Card className="border border-emerald-500/10 bg-emerald-500/5">
                <CardContent className="flex gap-4 p-6 items-start">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <CheckCircle2 className="size-5" />
                  </div>
                  <div className="space-y-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                    <p className="font-semibold text-sm">Tata Bahasa Sangat Baik</p>
                    <p className="leading-relaxed">
                      Tidak terdeteksi adanya kosakata informal, kata tidak baku, atau kalimat tidak efektif pada draf naskah riset Anda.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {result.languageIssues.map((issue, idx) => (
                  <Card key={idx} className="border border-foreground/10 bg-card overflow-hidden">
                    <CardHeader className="py-3 px-4 bg-muted/20 border-b border-foreground/5 flex flex-row items-center justify-between">
                      <Badge variant="outline" className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-amber-500/5 border-amber-500/20 text-amber-600">
                        {issue.type === "non-standard" ? "Tidak Baku" : issue.type === "informal" ? "Informal" : issue.type === "ineffective-sentence" ? "Kalimat Tidak Efektif" : "Inkonsisten"}
                      </Badge>
                      <div className="text-xs flex items-center">
                        <span className="line-through text-muted-foreground mr-1.5">{issue.word}</span>
                        <span className="font-bold text-emerald-600">→ {issue.suggestion}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 text-xs space-y-2">
                      <div className="space-y-1">
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Konteks Kalimat:</span>
                        <code className="text-[11px] bg-muted/40 p-2 rounded block leading-relaxed italic text-muted-foreground">
                          &quot;{issue.context}&quot;
                        </code>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* TAB 4: REKOMENDASI AI */}
          <TabsContent value="ai-recommendations" className="space-y-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-bold">Rekomendasi Perbaikan AI</h3>
              <p className="text-xs text-muted-foreground">
                Saran restrukturisasi dan perbaikan kalimat berbasis model kecerdasan buatan.
              </p>
            </div>

            {(!result.recommendations || result.recommendations.length === 0) ? (
              <Card className="border border-emerald-500/10 bg-emerald-500/5">
                <CardContent className="flex gap-4 p-6 items-start">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <CheckCircle2 className="size-5" />
                  </div>
                  <div className="space-y-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                    <p className="font-semibold text-sm">Tidak Ada Rekomendasi Mendesak</p>
                    <p className="leading-relaxed">
                      Naskah Anda sudah dinilai memenuhi standar kelengkapan dan keselarasan template target dengan baik.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {[...result.recommendations]
                  .sort((a, b) => a.priority - b.priority)
                  .map((rec, idx) => {
                    let catLabel = "Akademik"
                    let badgeBg = "bg-muted/40 text-muted-foreground border-foreground/5"
                    
                    if (rec.category === "structure") {
                      catLabel = "Struktur"
                      badgeBg = "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                    } else if (rec.category === "compliance") {
                      catLabel = "Kepatuhan"
                      badgeBg = "bg-blue-500/10 text-blue-600 border-blue-500/20"
                    } else if (rec.category === "language") {
                      catLabel = "Bahasa"
                      badgeBg = "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    }

                    let prioColor = "text-muted-foreground bg-muted border-foreground/5"
                    if (rec.priority === 1) {
                      prioColor = "text-destructive border-destructive/20 bg-destructive/5 font-bold"
                    } else if (rec.priority === 2 || rec.priority === 3) {
                      prioColor = "text-amber-500 border-amber-500/20 bg-amber-500/5 font-semibold"
                    }

                    return (
                      <Card key={idx} className="border border-foreground/10 bg-card overflow-hidden transition-all duration-200 hover:border-foreground/15">
                        <CardHeader className="py-3.5 px-6 border-b border-foreground/5 bg-muted/10">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-[9px] uppercase tracking-wider font-bold border px-2 py-0.5 rounded-full ${badgeBg}`}>
                              {catLabel}
                            </span>
                            <span className={`text-[9px] uppercase tracking-wider border px-2 py-0.5 rounded-full ${prioColor}`}>
                              Prioritas {rec.priority}
                            </span>
                            <CardTitle className="text-sm font-bold text-foreground w-full mt-2">
                              {rec.title}
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="p-6 text-xs space-y-4">
                          <p className="text-muted-foreground leading-relaxed">
                            {rec.description}
                          </p>
                          <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border-l-2 border-emerald-500 p-4 rounded-r-xl">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                              Saran Perbaikan:
                            </span>
                            <p className="text-foreground/90 leading-relaxed font-medium">
                              {rec.suggestedFix}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
              </div>
            )}
          </TabsContent>

          {/* TAB 5: AI REVIEW */}
          <TabsContent value="ai-review" className="space-y-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Brain className="size-5 text-primary animate-pulse" />
                Tinjauan Hasil AI Review
              </h3>
              <p className="text-xs text-muted-foreground">
                Ringkasan penilaian cerdas, kekuatan, kelemahan, dan struktur naskah ilmiah Anda.
              </p>
            </div>

            {!result.aiAnalysis ? (
              renderAIUnavailable()
            ) : (
              <div className="space-y-6">
                {/* Summary Card */}
                <Card className="border border-primary/20 bg-primary/5 dark:bg-primary/10 overflow-hidden">
                  <CardHeader className="py-4">
                    <CardTitle className="text-sm font-semibold text-primary">Ringkasan Analisis AI</CardTitle>
                    <CardDescription className="text-xs">Skor Penilaian AI: {result.aiAnalysis.overallScore}/100</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 text-xs text-foreground leading-relaxed">
                    {result.aiAnalysis.summary}
                  </CardContent>
                </Card>

                {/* Strengths & Weaknesses */}
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="border border-emerald-500/15 bg-emerald-500/5 dark:bg-emerald-500/10">
                    <CardHeader className="py-4">
                      <CardTitle className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Kekuatan Naskah</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 text-xs space-y-2">
                      {result.aiAnalysis.strengths.length === 0 ? (
                        <p className="text-muted-foreground italic">Tidak ada ulasan kekuatan.</p>
                      ) : (
                        <ul className="space-y-2">
                          {result.aiAnalysis.strengths.map((s, idx) => (
                            <li key={idx} className="flex gap-2 leading-relaxed">
                              <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border border-destructive/15 bg-destructive/5 dark:bg-destructive/10">
                    <CardHeader className="py-4">
                      <CardTitle className="text-xs font-bold uppercase tracking-wider text-destructive">Kelemahan Naskah</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 text-xs space-y-2">
                      {result.aiAnalysis.weaknesses.length === 0 ? (
                        <p className="text-muted-foreground italic">Tidak ada ulasan kelemahan.</p>
                      ) : (
                        <ul className="space-y-2">
                          {result.aiAnalysis.weaknesses.map((w, idx) => (
                            <li key={idx} className="flex gap-2 leading-relaxed">
                              <XCircle className="size-4 text-destructive shrink-0 mt-0.5" />
                              <span>{w}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Structure Review Findings */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold">Tinjauan Detail Elemen Struktur</h4>
                  {result.aiAnalysis.structureReview.length === 0 ? (
                    <p className="text-muted-foreground italic text-xs">Semua bagian struktur memenuhi standar dengan baik.</p>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {result.aiAnalysis.structureReview.map((finding, idx) => renderFindingCard(finding, idx))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          {/* TAB 6: PUEBI */}
          <TabsContent value="puebi" className="space-y-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Sparkles className="size-4.5 text-primary" />
                Pemeriksaan Ejaan & Tanda Baca (PUEBI/EYD)
              </h3>
              <p className="text-xs text-muted-foreground">
                Evaluasi kesalahan penulisan kapital, penulisan kata depan, tanda koma, titik dua, dan serapan asing.
              </p>
            </div>

            {!result.aiAnalysis ? (
              renderAIUnavailable()
            ) : result.aiAnalysis.puebiReview.length === 0 ? (
              <Card className="border border-emerald-500/10 bg-emerald-500/5">
                <CardContent className="flex gap-4 p-6 items-start">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <CheckCircle2 className="size-5" />
                  </div>
                  <div className="space-y-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                    <p className="font-semibold text-sm">Ejaan & Tanda Baca Sempurna</p>
                    <p className="leading-relaxed">
                      AI tidak mendeteksi adanya pelanggaran PUEBI atau EYD di dalam draf naskah Anda.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {result.aiAnalysis.puebiReview.map((finding, idx) => renderFindingCard(finding, idx))}
              </div>
            )}
          </TabsContent>

          {/* TAB 7: KBBI */}
          <TabsContent value="kbbi" className="space-y-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Sparkles className="size-4.5 text-primary" />
                Validasi Kosakata Baku (KBBI)
              </h3>
              <p className="text-xs text-muted-foreground">
                Deteksi kata tidak baku, ejaan typo, atau ungkapan tidak terdaftar resmi di KBBI.
              </p>
            </div>

            {!result.aiAnalysis ? (
              renderAIUnavailable()
            ) : result.aiAnalysis.kbbiReview.length === 0 ? (
              <Card className="border border-emerald-500/10 bg-emerald-500/5">
                <CardContent className="flex gap-4 p-6 items-start">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <CheckCircle2 className="size-5" />
                  </div>
                  <div className="space-y-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                    <p className="font-semibold text-sm">Seluruh Kosakata Sesuai KBBI</p>
                    <p className="leading-relaxed">
                      AI tidak mendeteksi adanya kosakata non-baku atau tidak resmi di kamus besar bahasa Indonesia.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {result.aiAnalysis.kbbiReview.map((finding, idx) => renderFindingCard(finding, idx))}
              </div>
            )}
          </TabsContent>

          {/* TAB 8: ACADEMIC STYLE */}
          <TabsContent value="academic-style" className="space-y-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Sparkles className="size-4.5 text-primary" />
                Kesesuaian Gaya Bahasa Ilmiah & Kejelasan
              </h3>
              <p className="text-xs text-muted-foreground">
                Evaluasi bahasa subjektif, kata ganti orang pertama, kalimat tidak efektif, bertele-tele, serta istilah kurang ilmiah.
              </p>
            </div>

            {!result.aiAnalysis ? (
              renderAIUnavailable()
            ) : (result.aiAnalysis.styleReview.length === 0 && result.aiAnalysis.languageReview.length === 0) ? (
              <Card className="border border-emerald-500/10 bg-emerald-500/5">
                <CardContent className="flex gap-4 p-6 items-start">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <CheckCircle2 className="size-5" />
                  </div>
                  <div className="space-y-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                    <p className="font-semibold text-sm">Gaya Bahasa Sangat Akademik & Jelas</p>
                    <p className="leading-relaxed">
                      Objektivitas naskah terpelihara dengan baik tanpa penggunaan kata ganti pertama atau gaya subjektif non-ilmiah.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {result.aiAnalysis.styleReview.map((finding, idx) => renderFindingCard(finding, idx))}
                {result.aiAnalysis.languageReview.map((finding, idx) => renderFindingCard(finding, idx))}
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
