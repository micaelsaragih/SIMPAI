import type { Metadata } from "next"
import { AnalysisResultView } from "@/components/analysis/AnalysisResultView"

export const metadata: Metadata = {
  title: "Hasil Analisis — SIMPAI",
  description: "Hasil evaluasi detail dari draf artikel ilmiah Anda.",
}

export default function AnalysisResultPage() {
  return (
    <div className="space-y-6">
      <div className="print:hidden">
        <h1 className="text-3xl font-bold tracking-tight">Hasil Analisis</h1>
        <p className="text-muted-foreground">
          Tinjauan lengkap kelengkapan struktur, kesesuaian template, dan metrik kualitas naskah Anda.
        </p>
      </div>
      <AnalysisResultView />
    </div>
  )
}
