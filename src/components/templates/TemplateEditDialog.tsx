"use client"

import { useState } from "react"
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
import { toast } from "sonner"
import { TEMPLATE_CATEGORIES } from "@/features/template-intelligence/constants"
import type { JournalTemplate, TemplateCategory } from "@/types/database"

interface TemplateEditDialogProps {
  template: JournalTemplate
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave: (updated: JournalTemplate) => void
}

export function TemplateEditDialog({
  template,
  isOpen,
  onOpenChange,
  onSave,
}: TemplateEditDialogProps) {
  const [name, setName] = useState(template.name)
  const [publisher, setPublisher] = useState(template.publisher || "")
  const [description, setDescription] = useState(template.description || "")
  const [category, setCategory] = useState<TemplateCategory>(template.category)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("Nama template tidak boleh kosong")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/templates/${template.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          publisher: publisher.trim() || null,
          description: description.trim() || null,
          category,
        }),
      })

      if (res.ok) {
        const data = await res.json() as { template: JournalTemplate }
        toast.success("Template berhasil diperbarui")
        onSave(data.template)
        onOpenChange(false)
      } else {
        const errData = await res.json() as { error?: string }
        toast.error(errData.error || "Gagal memperbarui template")
      }
    } catch {
      toast.error("Terjadi kesalahan sistem saat memperbarui")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get categories from TEMPLATE_CATEGORIES mapping
  const categoryOptions = Object.values(TEMPLATE_CATEGORIES)

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Informasi Template</DialogTitle>
          <DialogDescription>
            Perbarui nama, publisher, kategori, atau deskripsi untuk template ini.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-1.5">
            <Label htmlFor="edit-name">Nama Template</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: IEEE Conference Template"
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-publisher">Publisher (Opsional)</Label>
            <Input
              id="edit-publisher"
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              placeholder="Contoh: IEEE, ACM, Springer"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-category">Kategori Jurnal</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as TemplateCategory)}
            >
              <SelectTrigger id="edit-category">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="edit-description">Deskripsi (Opsional)</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Berikan deskripsi singkat tentang template jurnal ini..."
              rows={3}
            />
          </div>
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
