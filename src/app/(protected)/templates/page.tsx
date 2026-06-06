import type { Metadata } from "next"
import { TemplateLibrary } from "@/components/templates/TemplateLibrary"

export const metadata: Metadata = {
  title: "Template Library — SIMPAI",
  description: "Koleksi template jurnal ilmiah yang tersimpan untuk analisis.",
}

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Template Library</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kelola dan gunakan kembali template jurnal untuk analisis artikel ilmiah.
        </p>
      </div>
      <TemplateLibrary />
    </div>
  )
}
