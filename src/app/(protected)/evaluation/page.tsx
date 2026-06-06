import type { Metadata } from "next"
import dynamic from "next/dynamic"

export const metadata: Metadata = {
  title: "Evaluasi & Bukti Ilmiah — SIMPAI",
  description: "Rangkaian pengujian fungsional akurasi dan kinerja pipeline sistem SIMPAI untuk bukti kualitas ilmiah.",
}

const EvaluationDashboard = dynamic(
  () => import("@/components/evaluation/EvaluationDashboard").then((mod) => mod.EvaluationDashboard),
  {
    loading: () => (
      <div className="w-full space-y-6 animate-pulse">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-xl border border-muted/40 bg-muted/20" />
          ))}
        </div>
        <div className="h-[400px] rounded-xl border border-muted/40 bg-muted/20" />
      </div>
    )
  }
)

export default function EvaluationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Evaluasi & Pengujian Sistem</h1>
        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
          Uji akurasi analisis aturan, kepatuhan template, integrasi tata bahasa lokal KBBI/PUEBI, serta performa kecepatan pemrosesan draf artikel ilmiah Anda.
        </p>
      </div>
      <EvaluationDashboard />
    </div>
  )
}
