"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { TEMPLATE_CATEGORIES } from "@/features/template-intelligence/constants"
import { ListIcon, GitBranchIcon, StarIcon, CalendarIcon, UserIcon } from "lucide-react"
import type { TemplateListItem } from "@/types/template"

// ─── Props ──────────────────────────────────────────────────────────────────

interface TemplateCardProps {
  template: TemplateListItem
}

// ─── Quality Score Helpers ──────────────────────────────────────────────────

function getQualityColors(score: number) {
  if (score >= 80) return "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40"
  if (score >= 60) return "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40"
  return "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/40"
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Hari ini"
  if (diffDays === 1) return "Kemarin"
  if (diffDays < 7) return `${diffDays} hari lalu`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan lalu`
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

// ─── Component ──────────────────────────────────────────────────────────────

export function TemplateCard({ template }: TemplateCardProps) {
  const router = useRouter()
  const categoryConfig = TEMPLATE_CATEGORIES[template.category]

  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
      onClick={() => router.push(`/templates/${template.id}`)}
    >
      <CardContent className="space-y-3 p-4">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-base truncate leading-tight">
              {template.name}
            </h3>
            {template.isOwner && (
              <Badge variant="secondary" className="shrink-0 text-[10px] px-1.5">
                <UserIcon className="mr-0.5 h-3 w-3" />
                Milik Anda
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {template.publisher ?? "Publisher tidak diketahui"}
          </p>
        </div>

        {/* Category Badge */}
        <Badge
          variant="outline"
          className={cn(
            "text-[11px] font-medium border-0",
            categoryConfig.color,
            categoryConfig.bgColor
          )}
        >
          {categoryConfig.label}
        </Badge>

        {/* Stats Row */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <ListIcon className="h-3.5 w-3.5" />
            {template.sectionCount} seksi
          </span>
          <span className="flex items-center gap-1">
            <GitBranchIcon className="h-3.5 w-3.5" />
            {template.versionCount} versi
          </span>
          <span
            className={cn(
              "flex items-center gap-1 rounded-full px-1.5 py-0.5 font-medium",
              getQualityColors(template.qualityScore)
            )}
          >
            <StarIcon className="h-3 w-3" />
            {template.qualityScore}
          </span>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="px-4 py-2.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <CalendarIcon className="h-3 w-3" />
          {formatRelativeDate(template.createdAt)}
        </span>
      </CardFooter>
    </Card>
  )
}
