"use client"

/**
 * TemplateSelector — inline template picker for the analysis wizard.
 * Allows users to search and select a saved template from the library.
 */

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  SearchIcon,
  ListIcon,
  StarIcon,
  CheckCircle2Icon,
  BookOpenIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { TemplateListItem } from "@/types/template"

interface TemplateSelectorProps {
  onSelect: (template: TemplateListItem) => void
  selectedId?: string | null
}

export function TemplateSelector({ onSelect, selectedId }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<TemplateListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (debouncedQuery) params.set("q", debouncedQuery)
      params.set("sort", "quality-desc")
      params.set("limit", "20")

      const response = await fetch(`/api/templates?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setTemplates(data.templates || [])
      }
    } catch (error) {
      console.error("Error fetching templates:", error)
    } finally {
      setIsLoading(false)
    }
  }, [debouncedQuery])

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Cari template berdasarkan nama atau penerbit..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Template List */}
      <div className="max-h-[320px] overflow-y-auto rounded-lg border border-border">
        {isLoading ? (
          <div className="space-y-2 p-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <BookOpenIcon className="size-10 text-muted-foreground/40 mb-2" />
            <p className="text-sm font-medium text-muted-foreground">
              {debouncedQuery ? "Tidak ada template yang cocok" : "Belum ada template tersimpan"}
            </p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              {debouncedQuery
                ? "Coba kata kunci lain"
                : "Upload template terlebih dahulu untuk menyimpannya"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {templates.map((template) => {
              const isSelected = selectedId === template.id
              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => onSelect(template)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50",
                    isSelected && "bg-primary/5 border-l-2 border-l-primary"
                  )}
                >
                  {/* Selection indicator */}
                  <div
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/30"
                    )}
                  >
                    {isSelected && <CheckCircle2Icon className="size-3" />}
                  </div>

                  {/* Template info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{template.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {template.publisher || "Publisher tidak diketahui"}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <ListIcon className="size-3" />
                      <span>{template.sectionCount}</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs font-medium",
                        template.qualityScore >= 80
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                          : template.qualityScore >= 60
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                            : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400"
                      )}
                    >
                      <StarIcon className="size-3 mr-0.5" />
                      {template.qualityScore}
                    </Badge>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Selected count */}
      {selectedId && (
        <p className="text-xs text-primary font-medium flex items-center gap-1.5">
          <CheckCircle2Icon className="size-3.5" />
          Template dipilih — lanjutkan ke langkah berikutnya
        </p>
      )}
    </div>
  )
}
