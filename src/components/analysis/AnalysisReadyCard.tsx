"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, FileText, FileSpreadsheet, RotateCcw, ArrowLeft, ArrowRight, Loader2, Zap } from "lucide-react"
import { useAnalysis } from "@/hooks/useAnalysis"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

export function AnalysisReadyCard() {
  const { state, dispatch } = useAnalysis()
  const { mode, templateData, draftData } = state
  const router = useRouter()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [loadingStep, setLoadingStep] = useState("")

  const handleReset = () => {
    dispatch({ type: "RESET" })
  }

  const handleBack = () => {
    dispatch({ type: "SET_STEP", payload: "preview" })
  }

  const handleStartAnalysis = async () => {
    if (!draftData) {
      toast.error("Data artikel draft tidak tersedia.")
      return
    }

    setIsAnalyzing(true)
    setLoadingStep("Menganalisis Struktur...")

    // Set up step intervals to show premium user progression
    const timers = [
      setTimeout(() => setLoadingStep("Mengevaluasi Kepatuhan Template..."), 1200),
      setTimeout(() => setLoadingStep("Menganalisis Bahasa..."), 2400),
      setTimeout(() => setLoadingStep("Menghubungi AI Engine..."), 3600),
      setTimeout(() => setLoadingStep("Menyusun Hasil Analisis..."), 5000)
    ]

    try {
      const template = mode === "template-based" ? templateData : null
      const response = await fetch("/api/analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          draftData,
          templateData: template,
        }),
      })

      // Clear timers since request is completing
      timers.forEach(t => clearTimeout(t))

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Gagal menjalankan analisis (HTTP ${response.status})`)
      }

      const resultData = await response.json()

      if (resultData.success && resultData.data) {
        // Persist result to sessionStorage for the result page
        sessionStorage.setItem("simpai_analysis_result", JSON.stringify(resultData.data))
        toast.success("Analisis selesai! Menampilkan hasil...")
        router.push("/analysis/result")
      } else {
        throw new Error(resultData.error || "Gagal memperoleh hasil analisis.")
      }
    } catch (err) {
      timers.forEach(t => clearTimeout(t))
      console.error("Analysis error:", err)
      const message = err instanceof Error ? err.message : "Terjadi kesalahan saat menganalisis dokumen."
      toast.error(message)
      setIsAnalyzing(false)
      setLoadingStep("")
    }
  }

  const isTemplateBased = mode === "template-based"

  return (
    <div className="space-y-6">
      {/* Celebratory Header Card */}
      <Card className="border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background overflow-hidden">
        <CardContent className="flex flex-col items-center justify-center text-center p-8 space-y-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary animate-pulse">
            <Sparkles className="size-7" />
          </div>
          <div className="space-y-1.5 max-w-md">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Dokumen Siap Dianalisis
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Semua dokumen yang diperlukan telah berhasil diunggah dan diekstrak. Konfirmasi detail di bawah untuk memulai analisis.
            </p>
          </div>
          <Badge
            variant={isTemplateBased ? "default" : "secondary"}
            className="px-3 py-1 font-semibold text-xs rounded-full"
          >
            {isTemplateBased ? "Analisis dengan Template" : "Analisis Draft Saja"}
          </Badge>
        </CardContent>
      </Card>

      {/* Summary Grid */}
      <div className={`grid gap-4 ${isTemplateBased ? "md:grid-cols-2" : "grid-cols-1"}`}>
        {/* Template Summary Card */}
        {isTemplateBased && templateData && (
          <Card className="border border-foreground/10 bg-card">
            <CardHeader className="py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <FileSpreadsheet className="size-4.5" />
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                    Template Jurnal
                  </span>
                  <CardTitle className="text-sm font-semibold text-foreground truncate max-w-[200px] sm:max-w-[300px]">
                    {templateData.title || "Template"}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="border-t border-foreground/5 pt-4 text-xs space-y-2">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Jumlah Kata:</span>
                <span className="font-semibold text-foreground">
                  {templateData.statistics.wordCount.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Jumlah Heading:</span>
                <span className="font-semibold text-foreground">
                  {templateData.statistics.headingCount.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Jumlah Bagian:</span>
                <span className="font-semibold text-foreground">
                  {templateData.statistics.sectionCount.toLocaleString("id-ID")}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Draft Summary Card */}
        {draftData && (
          <Card className="border border-foreground/10 bg-card">
            <CardHeader className="py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <FileText className="size-4.5" />
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                    Artikel Draft
                  </span>
                  <CardTitle className="text-sm font-semibold text-foreground truncate max-w-[200px] sm:max-w-[300px]">
                    {draftData.title || "Artikel"}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="border-t border-foreground/5 pt-4 text-xs space-y-2">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Jumlah Kata:</span>
                <span className="font-semibold text-foreground">
                  {draftData.statistics.wordCount.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Jumlah Heading:</span>
                <span className="font-semibold text-foreground">
                  {draftData.statistics.headingCount.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Jumlah Bagian:</span>
                <span className="font-semibold text-foreground">
                  {draftData.statistics.sectionCount.toLocaleString("id-ID")}
                </span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Info Alert */}
      <div className="flex gap-3 rounded-xl border border-blue-500/10 bg-blue-500/5 p-4 text-xs text-blue-600 dark:text-blue-400">
        <Zap className="size-4 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <p className="font-semibold">Analisis Berbasis Aturan</p>
          <p className="text-muted-foreground dark:text-blue-300/80 leading-relaxed">
            Analisis menggunakan mesin deterministik berbasis aturan untuk mengevaluasi struktur, kelengkapan, dan kesesuaian template. Rekomendasi AI akan tersedia di versi mendatang.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-foreground/5 pt-6">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleBack}
            disabled={isAnalyzing}
            className="gap-2 w-full sm:w-auto"
          >
            <ArrowLeft className="size-4" />
            Kembali
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={isAnalyzing}
            className="gap-2 w-full sm:w-auto text-muted-foreground"
          >
            <RotateCcw className="size-4" />
            Analisis Baru
          </Button>
        </div>

        <Button
          type="button"
          onClick={handleStartAnalysis}
          disabled={isAnalyzing || !draftData}
          size="default"
          className="gap-2 w-full sm:w-auto font-semibold"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {loadingStep || "Menganalisis..."}
            </>
          ) : (
            <>
              Mulai Analisis
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
