"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { CalendarIcon, GitBranchIcon, PlusIcon, FileTextIcon } from "lucide-react"
import type { TemplateVersion } from "@/types/database"

interface VersionTimelineProps {
  versions: TemplateVersion[]
  isOwner: boolean
  templateId: string
  currentSections: string[]
  onVersionAdded: () => void
}

export function VersionTimeline({
  versions,
  isOwner,
  templateId,
  currentSections,
  onVersionAdded,
}: VersionTimelineProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [versionName, setVersionName] = useState("")
  const [versionNumber, setVersionNumber] = useState("")
  const [notes, setNotes] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!versionName.trim() || !versionNumber.trim()) {
      toast.error("Nama dan nomor versi harus diisi")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/templates/${templateId}/versions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          version_name: versionName.trim(),
          version_number: versionNumber.trim(),
          notes: notes.trim() || null,
          section_snapshot: currentSections,
        }),
      })

      if (res.ok) {
        toast.success("Versi template berhasil ditambahkan")
        setIsOpen(false)
        setVersionName("")
        setVersionNumber("")
        setNotes("")
        onVersionAdded()
      } else {
        const errData = await res.json() as { error?: string }
        toast.error(errData.error || "Gagal menambahkan versi template")
      }
    } catch {
      toast.error("Terjadi kesalahan sistem")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateStr))
  }

  return (
    <div className="space-y-6">
      {/* Header with action */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold tracking-tight">Riwayat Versi</h3>
        {isOwner && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger render={<Button size="sm" className="h-8" />}>
              <PlusIcon className="mr-1 h-3.5 w-3.5" />
              Tambah Versi
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Tambah Versi Baru</DialogTitle>
                <DialogDescription>
                  Catat pembaruan atau perubahan pada template jurnal Anda.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-1.5">
                  <Label htmlFor="versionNumber">Nomor Versi (e.g., 1.1)</Label>
                  <Input
                    id="versionNumber"
                    value={versionNumber}
                    onChange={(e) => setVersionNumber(e.target.value)}
                    placeholder="Contoh: 1.1 atau 2024.1"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="versionName">Nama Versi</Label>
                  <Input
                    id="versionName"
                    value={versionName}
                    onChange={(e) => setVersionName(e.target.value)}
                    placeholder="Contoh: Revisi Heading Baru atau JATISI v2"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="notes">Catatan Perubahan (Opsional)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Jelaskan apa yang berubah pada versi ini..."
                    rows={3}
                  />
                </div>
                <DialogFooter className="pt-2">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    Batal
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Menyimpan..." : "Simpan Versi"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {versions.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-8 text-center">
            <GitBranchIcon className="h-8 w-8 text-muted-foreground/60 mb-2" />
            <p className="text-sm font-medium">Belum ada riwayat versi</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
              Versi awal akan tercatat secara otomatis saat template dibuat, atau Anda dapat menambahkannya secara manual.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="relative border-l border-muted pl-6 ml-3 space-y-8">
          {versions.map((ver, idx) => (
            <div key={ver.id} className="relative">
              {/* Timeline marker */}
              <span className="absolute -left-[31px] top-1 flex h-6 w-6 items-center justify-center rounded-full bg-background border-2 border-primary text-primary shadow-sm">
                <GitBranchIcon className="h-3 w-3" />
              </span>

              {/* Version details */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-sm bg-primary/10 text-primary px-2 py-0.5 rounded">
                    v{ver.version_number}
                  </span>
                  <h4 className="font-semibold text-base">{ver.version_name}</h4>
                  {idx === 0 && (
                    <span className="text-[10px] font-medium bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 px-1.5 py-0.5 rounded">
                      Aktif
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarIcon className="h-3 w-3" />
                  <span>{formatDate(ver.created_at)}</span>
                </div>

                {ver.notes && (
                  <p className="text-sm text-muted-foreground bg-muted/40 p-2.5 rounded-lg border border-muted mt-2 max-w-2xl leading-relaxed whitespace-pre-wrap">
                    {ver.notes}
                  </p>
                )}

                {/* Section snapshot badge count */}
                {Array.isArray(ver.section_snapshot) && ver.section_snapshot.length > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80 mt-2">
                    <FileTextIcon className="h-3.5 w-3.5" />
                    <span>Snapshot seksi ({ver.section_snapshot.length}):</span>
                    <span className="font-medium text-foreground truncate max-w-sm">
                      {ver.section_snapshot.join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
