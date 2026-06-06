"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import {
  BookOpenIcon,
  ChevronLeftIcon,
  EditIcon,
  Trash2Icon,
  LayersIcon,
  GitBranchIcon,
  CheckCircle2Icon,
  ArrowRightIcon,
  CalendarIcon,
  StarIcon,
  ListCollapseIcon,
  TextQuoteIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { TEMPLATE_CATEGORIES } from "@/features/template-intelligence/constants"
import { VersionTimeline } from "./VersionTimeline"
import { TemplateEditDialog } from "./TemplateEditDialog"
import type { JournalTemplate, TemplateVersion } from "@/types/database"

interface TemplateDetailProps {
  initialTemplate: JournalTemplate
  initialVersions: TemplateVersion[]
  isOwner: boolean
}

export function TemplateDetail({
  initialTemplate,
  initialVersions,
  isOwner,
}: TemplateDetailProps) {
  const router = useRouter()
  const [template, setTemplate] = useState<JournalTemplate>(initialTemplate)
  const [versions, setVersions] = useState<TemplateVersion[]>(initialVersions)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const categoryConfig = TEMPLATE_CATEGORIES[template.category]

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/templates/${template.id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast.success("Template berhasil dihapus")
        router.push("/templates")
        router.refresh()
      } else {
        const errData = await res.json() as { error?: string }
        toast.error(errData.error || "Gagal menghapus template")
      }
    } catch {
      toast.error("Terjadi kesalahan sistem saat menghapus")
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  const handleRefreshVersions = async () => {
    try {
      const res = await fetch(`/api/templates/${template.id}/versions`)
      if (res.ok) {
        const data = await res.json() as { versions: TemplateVersion[] }
        setVersions(data.versions)
      }
    } catch {
      // Quietly ignore
    }
  }

  const getQualityColors = (score: number) => {
    if (score >= 80) return "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40 border-emerald-200"
    if (score >= 60) return "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40 border-amber-200"
    return "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/40 border-red-200"
  }

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(dateStr))
  }

  return (
    <div className="space-y-6">
      {/* Back & Actions header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8 text-muted-foreground hover:text-foreground"
          onClick={() => router.push("/templates")}
        >
          <ChevronLeftIcon className="mr-1 h-4 w-4" />
          Kembali ke Library
        </Button>

        <div className="flex items-center gap-2">
          {isOwner && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="h-8"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <EditIcon className="mr-1.5 h-3.5 w-3.5" />
                Edit Info
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-destructive hover:bg-destructive/5 hover:text-destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2Icon className="mr-1.5 h-3.5 w-3.5" />
                Hapus
              </Button>
            </>
          )}

          <Button
            size="sm"
            className="h-8"
            onClick={() => router.push(`/analysis/new?templateId=${template.id}`)}
          >
            Gunakan untuk Analisis
            <ArrowRightIcon className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="rounded-2xl border border-muted-foreground/10 bg-gradient-to-r from-background via-muted/20 to-background p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "text-xs font-semibold border-0",
                  categoryConfig.color,
                  categoryConfig.bgColor
                )}
              >
                {categoryConfig.label}
              </Badge>
              {isOwner && (
                <Badge variant="secondary" className="text-[10px] px-1.5">
                  Milik Anda
                </Badge>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {template.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              {template.publisher || "Publisher tidak ditentukan"} • Terdaftar pada {formatDate(template.created_at)}
            </p>
            {template.description && (
              <p className="text-sm text-muted-foreground/80 mt-2 max-w-xl leading-relaxed">
                {template.description}
              </p>
            )}
          </div>

          {/* Quality Score Circle */}
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex flex-col items-center justify-center rounded-2xl border px-4 py-3 text-center min-w-[100px]",
                getQualityColors(template.quality_score)
              )}
            >
              <span className="text-[10px] font-bold tracking-wider uppercase opacity-85">
                Skor Kualitas
              </span>
              <div className="flex items-baseline gap-0.5 mt-0.5">
                <span className="text-3xl font-extrabold">{template.quality_score}</span>
                <span className="text-xs opacity-70">/100</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <LayersIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Seksi Wajib</p>
              <p className="text-lg font-bold">{template.required_sections.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <GitBranchIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Riwayat Versi</p>
              <p className="text-lg font-bold">{versions.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <StarIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Kelengkapan</p>
              <p className="text-lg font-bold">
                {template.quality_score >= 80 ? "Sangat Baik" : template.quality_score >= 60 ? "Baik" : "Kurang"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CalendarIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pembaruan Terakhir</p>
              <p className="text-lg font-bold">
                {template.updated_at ? formatDate(template.updated_at) : formatDate(template.created_at)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Info structure & Timeline */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Template Structure */}
        <div className="space-y-6 lg:col-span-2">
          {/* Required Sections */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2Icon className="h-5 w-5 text-primary" />
                Daftar Seksi Wajib
              </CardTitle>
              <CardDescription>
                Urutan seksi standar yang diekstraksi dari template jurnal ini.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {template.required_sections.map((section, idx) => {
                  const key = template.section_order[idx] || section.toLowerCase();
                  const keywords = template.section_keywords[key] || [];

                  return (
                    <div
                      key={idx}
                      className="flex flex-col gap-2 p-3 rounded-lg border border-muted hover:border-muted-foreground/20 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-xs font-bold text-primary">
                            {idx + 1}
                          </span>
                          <span className="font-semibold text-sm">{section}</span>
                        </div>
                        <Badge variant="outline" className="text-[10px] opacity-80">
                          {key}
                        </Badge>
                      </div>

                      {keywords.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pl-7 mt-1">
                          <span className="text-[10px] text-muted-foreground font-medium mr-1 flex items-center">
                            <TextQuoteIcon className="h-3 w-3 mr-0.5" />
                            Pola Kata Kunci:
                          </span>
                          {keywords.map((kw, kwIdx) => (
                            <Badge
                              key={kwIdx}
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0 border-muted"
                            >
                              &quot;{kw}&quot;
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Heading structure */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <ListCollapseIcon className="h-5 w-5 text-primary" />
                Struktur Heading Template
              </CardTitle>
              <CardDescription>
                Struktur outline lengkap dokumen template yang diunggah.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border border-muted rounded-xl p-4 bg-muted/20 space-y-2 max-h-[400px] overflow-y-auto">
                {template.heading_structure.map((h, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "flex items-center gap-2.5 text-sm py-1 rounded transition-colors hover:bg-muted/40",
                      h.level === 1 ? "pl-0 font-bold text-foreground" :
                      h.level === 2 ? "pl-4 font-semibold text-foreground/90" :
                      h.level === 3 ? "pl-8 text-foreground/80 text-xs" : "pl-12 text-muted-foreground text-xs"
                    )}
                  >
                    <Badge variant="outline" className="text-[9px] h-4 px-1 rounded shrink-0">
                      H{h.level}
                    </Badge>
                    <span className="truncate">{h.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Timeline & Version control */}
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <VersionTimeline
                versions={versions}
                isOwner={isOwner}
                templateId={template.id}
                currentSections={template.required_sections}
                onVersionAdded={handleRefreshVersions}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <TemplateEditDialog
        template={template}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={(updated) => setTemplate(updated)}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Apakah Anda benar-benar yakin?</DialogTitle>
            <DialogDescription>
              Tindakan ini tidak dapat dibatalkan. Menghapus template ini juga akan menghapus semua riwayat versi yang terkait di database.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Menghapus..." : "Hapus Template"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
