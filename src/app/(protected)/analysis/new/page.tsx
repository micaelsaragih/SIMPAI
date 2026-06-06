import type { Metadata } from "next"
import dynamic from "next/dynamic"

export const metadata: Metadata = {
  title: "Analisis Baru — SIMPAI",
  description: "Mulai analisis artikel ilmiah baru. Upload draft dan template jurnal untuk mendapatkan evaluasi komprehensif.",
}

const AnalysisWorkspace = dynamic(
  () => import("@/components/analysis/AnalysisWorkspace").then((mod) => mod.AnalysisWorkspace),
  {
    loading: () => (
      <div className="w-full space-y-6 animate-pulse">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 h-[600px] rounded-xl border border-muted/40 bg-muted/20" />
          <div className="h-[600px] rounded-xl border border-muted/40 bg-muted/20" />
        </div>
      </div>
    )
  }
)

export default function NewAnalysisPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analisis Baru</h1>
        <p className="text-muted-foreground">
          Unggah artikel ilmiah Anda untuk mendapatkan analisis struktur, bahasa, dan rekomendasi perbaikan.
        </p>
      </div>
      <AnalysisWorkspace />
    </div>
  )
}
