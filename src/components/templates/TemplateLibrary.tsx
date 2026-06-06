"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TemplateCard } from "@/components/templates/TemplateCard"
import { TemplateSearch } from "@/components/templates/TemplateSearch"
import { BookOpenIcon, PlusIcon, SearchXIcon } from "lucide-react"
import type { TemplateListItem, TemplateSortOption } from "@/types/template"
import type { TemplateCategory } from "@/types/database"

// ─── Category Filter Config ────────────────────────────────────────────────

const CATEGORIES: Array<{ value: TemplateCategory | "all"; label: string }> = [
  { value: "all", label: "Semua" },
  { value: "computer-science", label: "Ilmu Komputer" },
  { value: "information-systems", label: "Sistem Informasi" },
  { value: "engineering", label: "Teknik" },
  { value: "education", label: "Pendidikan" },
  { value: "general", label: "Umum" },
]

const SORT_OPTIONS: Array<{ value: TemplateSortOption; label: string }> = [
  { value: "newest", label: "Terbaru" },
  { value: "oldest", label: "Terlama" },
  { value: "name-asc", label: "Nama A-Z" },
  { value: "name-desc", label: "Nama Z-A" },
  { value: "quality-desc", label: "Skor Kualitas" },
]

// ─── Component ──────────────────────────────────────────────────────────────

export function TemplateLibrary() {
  const router = useRouter()
  const [templates, setTemplates] = useState<TemplateListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<TemplateCategory | "all">("all")
  const [sort, setSort] = useState<TemplateSortOption>("newest")

  const fetchTemplates = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        q: query,
        category: category,
        sort: sort,
        page: "1",
        limit: "12",
      })
      const res = await fetch(`/api/templates?${params.toString()}`)
      if (res.ok) {
        const data = await res.json() as { templates: TemplateListItem[] }
        setTemplates(data.templates)
      }
    } catch {
      // Silently handle fetch errors
    } finally {
      setIsLoading(false)
    }
  }, [query, category, sort])

  useEffect(() => {
    void fetchTemplates()
  }, [fetchTemplates])

  return (
    <div className="space-y-5">
      {/* Search & Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-sm">
          <TemplateSearch value={query} onChange={setQuery} />
        </div>
        <Select value={sort} onValueChange={(v) => setSort(v as TemplateSortOption)}>
          <SelectTrigger className="w-[160px] shrink-0">
            <SelectValue placeholder="Urutkan" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map((cat) => (
          <Badge
            key={cat.value}
            variant={category === cat.value ? "default" : "outline"}
            className="cursor-pointer transition-colors hover:bg-primary/10"
            onClick={() => setCategory(cat.value)}
          >
            {cat.label}
          </Badge>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingGrid />
      ) : templates.length === 0 ? (
        <EmptyState hasQuery={query.length > 0 || category !== "all"} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Loading State ──────────────────────────────────────────────────────────

function LoadingGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="space-y-3 p-4">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-14" />
            </div>
            <Skeleton className="h-3 w-1/3 pt-1" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// ─── Empty State ────────────────────────────────────────────────────────────

function EmptyState({ hasQuery }: { hasQuery: boolean }) {
  const router = useRouter()

  return (
    <Card className="flex flex-col items-center justify-center py-16">
      <CardContent className="flex flex-col items-center text-center">
        {hasQuery ? (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
              <SearchXIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-base font-semibold">Tidak ditemukan</h3>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Tidak ada template yang cocok dengan pencarian Anda. Coba gunakan kata kunci lain.
            </p>
          </>
        ) : (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
              <BookOpenIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-base font-semibold">
              Belum ada template tersimpan
            </h3>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Mulai dengan menganalisis artikel ilmiah untuk membuat template jurnal pertama Anda.
            </p>
            <Button
              className="mt-4"
              onClick={() => router.push("/analysis/new")}
            >
              <PlusIcon className="mr-1.5 h-4 w-4" />
              Tambah Template
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
