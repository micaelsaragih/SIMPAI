"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import {
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  X,
  BookOpenIcon,
  UploadCloudIcon,
  SaveIcon,
} from "lucide-react"
import { useAnalysis } from "@/hooks/useAnalysis"
import { AnalysisProvider } from "@/providers/AnalysisProvider"
import { StepIndicator } from "@/components/analysis/StepIndicator"
import { ModeSelector } from "@/components/analysis/ModeSelector"
import { FileUploadZone } from "@/components/analysis/FileUploadZone"
import { DocumentPreview } from "@/components/analysis/DocumentPreview"
import { AnalysisReadyCard } from "@/components/analysis/AnalysisReadyCard"
import { TemplateSelector } from "@/components/analysis/TemplateSelector"
import { SaveTemplateDialog } from "@/components/analysis/SaveTemplateDialog"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { ParseApiResponse, ParsedDocument } from "@/types/analysis"
import type { JournalTemplate } from "@/types/database"
import type { TemplateListItem } from "@/types/template"

function WorkspaceContent() {
  const { state, dispatch } = useAnalysis()
  const searchParams = useSearchParams()
  const templateIdParam = searchParams.get("templateId")

  const {
    currentStep,
    mode,
    templateSource,
    existingTemplateId,
    templateFile,
    templateData,
    draftFile,
    draftData,
    isProcessing,
    error,
  } = state

  const [saveCheckboxChecked, setSaveCheckboxChecked] = useState(false)
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)

  // 1. URL Parameter check for templateId
  useEffect(() => {
    if (templateIdParam && currentStep === "mode") {
      const loadTemplateFromParam = async () => {
        dispatch({ type: "SET_PROCESSING", payload: true })
        dispatch({ type: "SET_ERROR", payload: null })
        try {
          const res = await fetch(`/api/templates/${templateIdParam}`)
          if (!res.ok) throw new Error("Gagal memuat template dari URL")
          const data = await res.json() as { template: JournalTemplate }

          const reconstructedDoc: ParsedDocument = {
            title: data.template.name,
            headings: data.template.heading_structure.map((h, i) => ({
              level: h.level,
              text: h.text,
              index: i,
            })),
            paragraphs: [],
            sections: data.template.required_sections.map((s) => ({
              heading: s,
              level: 1,
              content: "",
              wordCount: 0,
              paragraphCount: 0,
            })),
            rawText: "",
            statistics: {
              wordCount: 0,
              paragraphCount: 0,
              headingCount: data.template.heading_structure.length,
              sectionCount: data.template.required_sections.length,
              characterCount: 0,
            },
          }

          dispatch({ type: "SET_MODE", payload: "template-based" })
          dispatch({ type: "SET_TEMPLATE_SOURCE", payload: "existing" })
          dispatch({ type: "SET_EXISTING_TEMPLATE", payload: data.template.id })
          dispatch({ type: "SET_TEMPLATE_DATA", payload: reconstructedDoc })
          dispatch({ type: "SET_STEP", payload: "draft" })
          toast.success(`Menggunakan template: ${data.template.name}`)
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Gagal memuat template dari URL"
          dispatch({ type: "SET_ERROR", payload: msg })
          toast.error(msg)
        } finally {
          dispatch({ type: "SET_PROCESSING", payload: false })
        }
      }
      void loadTemplateFromParam()
    }
  }, [templateIdParam, currentStep, dispatch])

  const handleFileUpload = async (file: File, target: "template" | "draft") => {
    dispatch({ type: "SET_PROCESSING", payload: true })
    dispatch({ type: "SET_ERROR", payload: null })

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/analysis/parse", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Gagal memproses file. Server merespon ${response.status}`)
      }

      const result: ParseApiResponse = await response.json()

      if (result.success && result.data) {
        if (target === "template") {
          dispatch({ type: "SET_TEMPLATE_FILE", payload: file })
          dispatch({ type: "SET_TEMPLATE_DATA", payload: result.data })
          toast.success("Template berhasil diunggah dan diekstrak!")
          if (saveCheckboxChecked) {
            setIsSaveDialogOpen(true)
          }
        } else {
          dispatch({ type: "SET_DRAFT_FILE", payload: file })
          dispatch({ type: "SET_DRAFT_DATA", payload: result.data })
          toast.success("Artikel draft berhasil diunggah!")
          // Auto-advance to preview step
          dispatch({ type: "SET_STEP", payload: "preview" })
        }
      } else {
        throw new Error(result.error || "Gagal memproses dokumen.")
      }
    } catch (err) {
      console.error("Error uploading file:", err)
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan koneksi saat mengunggah file."
      dispatch({ type: "SET_ERROR", payload: errorMessage })
      toast.error(errorMessage)
    } finally {
      dispatch({ type: "SET_PROCESSING", payload: false })
    }
  }

  const handleSelectExistingTemplate = async (templateItem: TemplateListItem) => {
    dispatch({ type: "SET_PROCESSING", payload: true })
    dispatch({ type: "SET_ERROR", payload: null })
    try {
      const res = await fetch(`/api/templates/${templateItem.id}`)
      if (!res.ok) throw new Error("Gagal mengambil data template")
      const data = await res.json() as { template: JournalTemplate }

      const reconstructedDoc: ParsedDocument = {
        title: data.template.name,
        headings: data.template.heading_structure.map((h, i) => ({
          level: h.level,
          text: h.text,
          index: i,
        })),
        paragraphs: [],
        sections: data.template.required_sections.map((s) => ({
          heading: s,
          level: 1,
          content: "",
          wordCount: 0,
          paragraphCount: 0,
        })),
        rawText: "",
        statistics: {
          wordCount: 0,
          paragraphCount: 0,
          headingCount: data.template.heading_structure.length,
          sectionCount: data.template.required_sections.length,
          characterCount: 0,
        },
      }

      dispatch({ type: "SET_EXISTING_TEMPLATE", payload: data.template.id })
      dispatch({ type: "SET_TEMPLATE_DATA", payload: reconstructedDoc })
      toast.success(`Template ${data.template.name} berhasil dimuat!`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan"
      dispatch({ type: "SET_ERROR", payload: msg })
      toast.error(msg)
    } finally {
      dispatch({ type: "SET_PROCESSING", payload: false })
    }
  }

  const handleClearError = () => {
    dispatch({ type: "SET_ERROR", payload: null })
  }

  const handleBack = () => {
    if (currentStep === "template") {
      if (templateSource !== null) {
        dispatch({ type: "SET_TEMPLATE_SOURCE", payload: null })
        dispatch({ type: "SET_TEMPLATE_DATA", payload: null })
        dispatch({ type: "SET_EXISTING_TEMPLATE", payload: null })
      } else {
        dispatch({ type: "SET_STEP", payload: "mode" })
      }
    } else if (currentStep === "draft") {
      dispatch({
        type: "SET_STEP",
        payload: mode === "template-based" ? "template" : "mode",
      })
    } else if (currentStep === "preview") {
      dispatch({ type: "SET_STEP", payload: "draft" })
    }
  }

  const handleNext = () => {
    if (currentStep === "template" && templateData) {
      dispatch({ type: "SET_STEP", payload: "draft" })
    } else if (currentStep === "preview" && draftData) {
      dispatch({ type: "SET_STEP", payload: "ready" })
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case "mode":
        return <ModeSelector />

      case "template":
        if (templateSource === null) {
          return (
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-semibold">Pilih Sumber Template Jurnal</h3>
                <p className="text-sm text-muted-foreground">
                  Gunakan template yang sudah tersimpan di library atau upload file baru.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {/* Option A: Gunakan Template Tersimpan */}
                <Card
                  className="cursor-pointer border-2 hover:border-primary/50 transition-all duration-200 hover:shadow-md group"
                  onClick={() => dispatch({ type: "SET_TEMPLATE_SOURCE", payload: "existing" })}
                >
                  <CardHeader className="space-y-1 text-center py-8">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                      <BookOpenIcon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-base pt-2">Gunakan Template Tersimpan</CardTitle>
                    <CardDescription className="text-xs">
                      Pilih dari koleksi template jurnal yang sudah diunggah sebelumnya.
                    </CardDescription>
                  </CardHeader>
                </Card>

                {/* Option B: Upload Template Baru */}
                <Card
                  className="cursor-pointer border-2 hover:border-primary/50 transition-all duration-200 hover:shadow-md group"
                  onClick={() => dispatch({ type: "SET_TEMPLATE_SOURCE", payload: "new-upload" })}
                >
                  <CardHeader className="space-y-1 text-center py-8">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                      <UploadCloudIcon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-base pt-2">Upload Template Baru</CardTitle>
                    <CardDescription className="text-xs">
                      Unggah file template jurnal baru dalam format DOCX.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          )
        }

        if (templateSource === "existing") {
          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="text-sm font-semibold">Pilih Template dari Library</h3>
                  <p className="text-xs text-muted-foreground">Pilih template jurnal target untuk analisis.</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    dispatch({ type: "SET_TEMPLATE_SOURCE", payload: null })
                    dispatch({ type: "SET_TEMPLATE_DATA", payload: null })
                    dispatch({ type: "SET_EXISTING_TEMPLATE", payload: null })
                  }}
                  className="h-8 text-xs"
                >
                  Ganti Sumber
                </Button>
              </div>

              <TemplateSelector
                selectedId={existingTemplateId}
                onSelect={handleSelectExistingTemplate}
              />

              {templateData && (
                <div className="animate-in fade-in slide-in-from-bottom-3 duration-300 pt-4">
                  <div className="mb-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Struktur Template Terpilih:
                    </h4>
                  </div>
                  <DocumentPreview document={templateData} type="template" />
                </div>
              )}
            </div>
          )
        }

        // new-upload case
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-sm font-semibold">Upload Template Baru</h3>
                <p className="text-xs text-muted-foreground">Unggah file template jurnal target (DOCX).</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  dispatch({ type: "SET_TEMPLATE_SOURCE", payload: null })
                  dispatch({ type: "SET_TEMPLATE_DATA", payload: null })
                  dispatch({ type: "SET_EXISTING_TEMPLATE", payload: null })
                }}
                className="h-8 text-xs"
              >
                Ganti Sumber
              </Button>
            </div>

            <FileUploadZone
              label="Upload Template Jurnal"
              description="Unggah template jurnal target (DOCX) untuk dijadikan acuan struktur dan gaya."
              onFileSelect={(file) => handleFileUpload(file, "template")}
              isProcessing={isProcessing}
              selectedFile={templateFile}
              onRemove={() => {
                dispatch({ type: "SET_TEMPLATE_FILE", payload: null })
                dispatch({ type: "SET_TEMPLATE_DATA", payload: null })
              }}
            />

            {!templateData && !isProcessing && (
              <div className="flex items-center gap-2 pl-1.5 py-1">
                <input
                  type="checkbox"
                  id="save-to-library"
                  checked={saveCheckboxChecked}
                  onChange={(e) => setSaveCheckboxChecked(e.target.checked)}
                  className="rounded border-muted-foreground/30 text-primary focus:ring-primary size-4"
                />
                <label htmlFor="save-to-library" className="text-xs text-muted-foreground cursor-pointer select-none">
                  Simpan template ini ke library setelah berhasil diunggah untuk digunakan kembali.
                </label>
              </div>
            )}

            {templateData && (
              <div className="animate-in fade-in slide-in-from-bottom-3 duration-300">
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-foreground">Struktur Template Jurnal Terdeteksi:</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5"
                    onClick={() => setIsSaveDialogOpen(true)}
                  >
                    <SaveIcon className="h-3.5 w-3.5" />
                    Simpan ke Library
                  </Button>
                </div>
                <DocumentPreview document={templateData} type="template" />
              </div>
            )}

            {templateData && (
              <SaveTemplateDialog
                open={isSaveDialogOpen}
                onOpenChange={setIsSaveDialogOpen}
                document={templateData}
              />
            )}
          </div>
        )

      case "draft":
        return (
          <div className="space-y-6">
            <FileUploadZone
              label="Upload Artikel Draft"
              description="Unggah naskah artikel ilmiah Anda (DOCX) yang ingin dianalisis."
              onFileSelect={(file) => handleFileUpload(file, "draft")}
              isProcessing={isProcessing}
              selectedFile={draftFile}
              onRemove={() => {
                dispatch({ type: "SET_DRAFT_FILE", payload: null })
                dispatch({ type: "SET_DRAFT_DATA", payload: null })
              }}
            />
          </div>
        )

      case "preview":
        return (
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-foreground">Tinjau Dokumen Draft</h3>
              <p className="text-xs text-muted-foreground">
                Periksa hasil ekstraksi struktur dari artikel ilmiah Anda sebelum memulai analisis.
              </p>
            </div>
            {draftData && <DocumentPreview document={draftData} type="draft" />}
          </div>
        )

      case "ready":
        return <AnalysisReadyCard />

      default:
        return null
    }
  }

  // Show navigation buttons in template, draft, and preview steps
  const showNavigation = ["template", "draft", "preview"].includes(currentStep)
  const isNextDisabled =
    (currentStep === "template" && !templateData) ||
    (currentStep === "draft" && !draftData) ||
    (currentStep === "preview" && !draftData) ||
    isProcessing

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 px-1 py-4">
      {/* Wizard Progress Indicator */}
      <div className="border-b border-foreground/5 pb-6">
        <StepIndicator currentStep={currentStep} mode={mode} />
      </div>

      {/* Error Alert Display */}
      {error && (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-destructive/15 bg-destructive/5 p-4 text-sm text-destructive animate-in fade-in duration-200">
          <div className="flex gap-2">
            <AlertCircle className="size-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Kesalahan Unggah/Ekstraksi</p>
              <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">{error}</p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClearError}
            className="size-6 text-destructive hover:bg-destructive/10 shrink-0"
          >
            <X className="size-4" />
            <span className="sr-only">Tutup</span>
          </Button>
        </div>
      )}

      {/* Step Workspace Content */}
      <div className="min-h-[300px] animate-in fade-in duration-300">
        {renderStepContent()}
      </div>

      {/* Bottom Step Navigation Bar */}
      {showNavigation && (
        <div className="flex items-center justify-between border-t border-foreground/5 pt-6">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleBack}
            disabled={isProcessing}
            className="gap-2 font-medium"
          >
            <ArrowLeft className="size-4" />
            Kembali
          </Button>

          {/* Lanjutkan button is visible if it makes sense.
              For Draft step, we rely on auto-advance on upload success,
              but if draft already uploaded/present we can show Lanjutkan. */}
          {(currentStep !== "draft" || draftData) && (
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={handleNext}
              disabled={isNextDisabled}
              className="gap-2 font-medium"
            >
              Lanjutkan
              <ArrowRight className="size-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export function AnalysisWorkspace() {
  return (
    <AnalysisProvider>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }>
        <WorkspaceContent />
      </Suspense>
    </AnalysisProvider>
  )
}
