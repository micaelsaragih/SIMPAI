"use client"

/**
 * SaveTemplateDialog — dialog for saving an uploaded template to the library.
 * Shown after a new template is uploaded in the analysis workflow.
 */

import { useState } from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2Icon, SaveIcon } from "lucide-react"
import { TEMPLATE_CATEGORIES } from "@/features/template-intelligence/constants"
import type { ParsedDocument } from "@/types/analysis"
import type { TemplateCategory } from "@/types/database"

interface SaveTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  document: ParsedDocument
  suggestedName?: string
}

export function SaveTemplateDialog({
  open,
  onOpenChange,
  document,
  suggestedName,
}: SaveTemplateDialogProps) {
  const [name, setName] = useState(suggestedName || document.title || "")
  const [publisher, setPublisher] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<TemplateCategory>("general")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Nama template tidak boleh kosong.")
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch("/api/templates/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          document,
          name: name.trim(),
          publisher: publisher.trim() || undefined,
          description: description.trim() || undefined,
          category,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Gagal menyimpan template.")
      }

      const data = await response.json()
      toast.success(`Template "${name}" berhasil disimpan ke library!`)
      onOpenChange(false)

      // Reset form
      setName("")
      setPublisher("")
      setDescription("")
      setCategory("general")

      return data
    } catch (error) {
      console.error("Error saving template:", error)
      toast.error(
        error instanceof Error ? error.message : "Gagal menyimpan template."
      )
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SaveIcon className="size-5 text-primary" />
            Simpan Template ke Library
          </DialogTitle>
          <DialogDescription>
            Simpan template ini agar dapat digunakan kembali untuk analisis selanjutnya.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Template Name */}
          <div className="space-y-2">
            <Label htmlFor="template-name">
              Nama Template <span className="text-destructive">*</span>
            </Label>
            <Input
              id="template-name"
              placeholder="Contoh: JATISI, Jurnal Teknik Informatika"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
            />
          </div>

          {/* Publisher */}
          <div className="space-y-2">
            <Label htmlFor="template-publisher">Penerbit</Label>
            <Input
              id="template-publisher"
              placeholder="Contoh: Universitas Bina Darma"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              maxLength={200}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="template-category">Kategori</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as TemplateCategory)}>
              <SelectTrigger id="template-category">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TEMPLATE_CATEGORIES).map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="template-description">Deskripsi</Label>
            <Textarea
              id="template-description"
              placeholder="Deskripsi singkat tentang template ini..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={3}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !name.trim()}
            className="gap-2"
          >
            {isSaving ? (
              <>
                <Loader2Icon className="size-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <SaveIcon className="size-4" />
                Simpan Template
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
