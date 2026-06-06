"use client"

import { useState, useRef, type DragEvent, type ChangeEvent } from "react"
import { UploadCloud, FileText, XCircle, Loader2, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { validateUploadFile } from "@/lib/validators/analysis"

interface FileUploadZoneProps {
  label: string
  description: string
  onFileSelect: (file: File) => void
  isProcessing?: boolean
  selectedFile?: File | null
  onRemove?: () => void
}

export function FileUploadZone({
  label,
  description,
  onFileSelect,
  isProcessing = false,
  selectedFile = null,
  onRemove,
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const processFile = (file: File) => {
    setError(null)
    const validationError = validateUploadFile(file)
    if (validationError) {
      setError(validationError)
      return
    }
    onFileSelect(file)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (isProcessing) return

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (isProcessing) return

    const files = e.target.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
  }

  const triggerFileInput = () => {
    if (isProcessing) return
    fileInputRef.current?.click()
  }

  const formatFileSize = (bytes: number) => {
    if (bytes >= 1024 * 1024) {
      return (bytes / 1024 / 1024).toFixed(2) + " MB"
    }
    return (bytes / 1024).toFixed(1) + " KB"
  }

  return (
    <div className="w-full">
      {/* Label and Description */}
      <div className="mb-3 space-y-1">
        <h3 className="text-sm font-semibold text-foreground">{label}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      {isProcessing ? (
        // Processing State
        <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-foreground/10 bg-muted/30 p-6 text-center">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="mt-4 text-sm font-medium text-foreground">
            Memproses dokumen...
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Sedang membaca dan mengekstrak struktur file DOCX.
          </p>
        </div>
      ) : selectedFile ? (
        // File Selected State
        <div className="flex flex-col gap-3 rounded-xl border border-foreground/10 bg-card p-4 transition-all duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            {onRemove && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onRemove}
                className="size-8 text-muted-foreground hover:text-destructive"
              >
                <XCircle className="size-5" />
                <span className="sr-only">Hapus file</span>
              </Button>
            )}
          </div>

          <div className="flex items-center gap-1.5 self-start rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="size-3" />
            File Valid
          </div>
        </div>
      ) : (
        // Drop Zone State
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={cn(
            "flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-foreground/15 bg-card/50 p-6 text-center transition-all duration-200 hover:border-primary/50 hover:bg-card",
            isDragging && "border-primary bg-primary/5 shadow-inner"
          )}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".docx"
            className="hidden"
          />

          <div className={cn(
            "flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground transition-colors",
            isDragging && "bg-primary/20 text-primary"
          )}>
            <UploadCloud className="size-6" />
          </div>

          <div className="mt-4 space-y-1">
            <p className="text-sm font-medium text-foreground">
              Drag & drop file DOCX di sini
            </p>
            <p className="text-xs text-muted-foreground">
              Maksimal ukuran file 20 MB
            </p>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-[1px] w-8 bg-foreground/10" />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              atau
            </span>
            <div className="h-[1px] w-8 bg-foreground/10" />
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4 font-medium"
            onClick={(e) => {
              e.stopPropagation()
              triggerFileInput()
            }}
          >
            Pilih File
          </Button>

          {error && (
            <p className="mt-3 text-xs font-semibold text-destructive animate-in fade-in-50 duration-200">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
