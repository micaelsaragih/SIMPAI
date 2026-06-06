"use client"

import { useState } from "react"
import {
  BookOpen,
  LayoutList,
  AlignLeft,
  Hash,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  Terminal,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import type { ParsedDocument } from "@/types/analysis"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface DocumentPreviewProps {
  document: ParsedDocument
  type: "template" | "draft"
}

export function DocumentPreview({ document, type }: DocumentPreviewProps) {
  const isTemplate = type === "template"
  const stats = document.statistics
  const [isDebugOpen, setIsDebugOpen] = useState(false)

  const methodCounts = (document.headings || []).reduce((acc, h) => {
    const method = h.detectionMethod || "unknown"
    acc[method] = (acc[method] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const first10Headings = (document.headings || []).slice(0, 10)
  const headingsWithConfidence = (document.headings || []).filter((h) => h.confidence !== undefined)
  const avgConfidence = headingsWithConfidence.length > 0
    ? headingsWithConfidence.reduce((sum, h) => sum + (h.confidence || 0), 0) / headingsWithConfidence.length
    : 0

  const acceptedCount = (document.headings || []).length
  const rejectedHeadings = document.rejectedHeadings || []
  const top20RejectedHeadings = rejectedHeadings.slice(0, 20)

  // First 4 sections for preview
  const previewSections = document.sections.slice(0, 4)
  const remainingSectionsCount = document.sections.length - previewSections.length

  const statCards = [
    {
      label: "Jumlah Kata",
      value: stats.wordCount.toLocaleString("id-ID"),
      icon: BookOpen,
      color: "text-blue-500 bg-blue-50 dark:bg-blue-950/30",
    },
    {
      label: "Bagian/Seksi",
      value: stats.sectionCount.toLocaleString("id-ID"),
      icon: LayoutList,
      color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      label: "Paragraf",
      value: stats.paragraphCount.toLocaleString("id-ID"),
      icon: AlignLeft,
      color: "text-amber-500 bg-amber-50 dark:bg-amber-950/30",
    },
    {
      label: "Heading/Judul",
      value: stats.headingCount.toLocaleString("id-ID"),
      icon: Hash,
      color: "text-purple-500 bg-purple-50 dark:bg-purple-950/30",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Title Banner */}
      <Card className="border border-foreground/10 bg-card overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {isTemplate ? (
                <FileSpreadsheet className="size-5" />
              ) : (
                <FileText className="size-5" />
              )}
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Nama Dokumen
              </span>
              <CardTitle className="text-base font-semibold leading-tight text-foreground truncate max-w-[280px] sm:max-w-[450px]">
                {document.title || "Dokumen Tanpa Judul"}
              </CardTitle>
            </div>
          </div>
          <Badge variant={isTemplate ? "default" : "secondary"}>
            {isTemplate ? "Template Jurnal" : "Artikel Draft"}
          </Badge>
        </CardHeader>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon
          return (
            <Card key={idx} className="border border-foreground/10 bg-card py-3" size="sm">
              <CardContent className="flex items-center gap-3 py-1">
                <div className={`flex size-9 items-center justify-center rounded-lg ${card.color}`}>
                  <Icon className="size-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{card.label}</p>
                  <p className="text-lg font-bold text-foreground tracking-tight">{card.value}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        {/* Headings Structure */}
        <Card className="border border-foreground/10 bg-card md:col-span-2">
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Hash className="size-4 text-muted-foreground" />
              Struktur Heading
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[350px] overflow-y-auto px-4 pb-4">
            {document.headings && document.headings.length > 0 ? (
              <ul className="space-y-2">
                {document.headings.map((heading, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-1.5 text-xs text-foreground/80 hover:text-primary transition-colors"
                    style={{ paddingLeft: `${Math.max(0, (heading.level - 1) * 12)}px` }}
                  >
                    <ChevronRight className="size-3.5 mt-0.5 shrink-0 text-muted-foreground/60" />
                    <span className="inline-flex shrink-0 items-center justify-center rounded bg-muted px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground">
                      H{heading.level}
                    </span>
                    <span className="font-medium truncate" title={heading.text}>
                      {heading.text}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex h-32 flex-col items-center justify-center text-center">
                <p className="text-xs text-muted-foreground">Tidak ada heading yang terdeteksi.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content Preview */}
        <Card className="border border-foreground/10 bg-card md:col-span-3">
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
              <AlignLeft className="size-4 text-muted-foreground" />
              Pratinjau Konten
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-4">
            {previewSections && previewSections.length > 0 ? (
              <div className="space-y-4">
                {previewSections.map((section, idx) => (
                  <div key={idx} className="space-y-1.5">
                    {section.heading && (
                      <h4 className="text-xs font-bold text-foreground/90 flex items-center gap-1">
                        <span className="size-1.5 rounded-full bg-primary/60 shrink-0" />
                        {section.heading}
                      </h4>
                    )}
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {section.content.length > 200
                        ? `${section.content.slice(0, 200)}...`
                        : section.content}
                    </p>
                    {idx < previewSections.length - 1 && <Separator className="my-2 bg-foreground/5" />}
                  </div>
                ))}

                {remainingSectionsCount > 0 && (
                  <div className="pt-2 text-center">
                    <p className="text-[11px] font-medium text-muted-foreground italic">
                      dan {remainingSectionsCount} bagian lainnya...
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-32 flex-col items-center justify-center text-center">
                <p className="text-xs text-muted-foreground">Tidak ada konten seksi yang tersedia.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dev Mode Debug Info Panel */}
      {process.env.NODE_ENV === "development" && (
        <Card className="border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10 overflow-hidden">
          <CardHeader
            className="flex flex-row items-center justify-between py-3 px-4 cursor-pointer hover:bg-amber-500/10 transition-colors"
            onClick={() => setIsDebugOpen(!isDebugOpen)}
          >
            <div className="flex items-center gap-2">
              <Terminal className="size-4 text-amber-500 animate-pulse" />
              <CardTitle className="text-xs font-semibold tracking-wider uppercase text-amber-500">
                Engine Diagnostics (Development Mode)
              </CardTitle>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-400 font-mono px-1.5 py-0.5 rounded">
                Avg. Conf: {(avgConfidence * 100).toFixed(0)}%
              </span>
              {isDebugOpen ? (
                <ChevronUp className="size-4 text-amber-500" />
              ) : (
                <ChevronDown className="size-4 text-amber-500" />
              )}
            </div>
          </CardHeader>
          {isDebugOpen && (
            <CardContent className="px-4 pb-4 pt-2 border-t border-amber-500/10 text-xs font-mono text-foreground space-y-4">
              {/* Grid overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1 bg-background/50 p-2.5 rounded border border-foreground/5">
                  <span className="text-[10px] text-muted-foreground block uppercase font-sans">Detected Title</span>
                  <span className="font-semibold break-all text-amber-600 dark:text-amber-400">
                    &ldquo;{document.title}&rdquo;
                  </span>
                </div>
                <div className="space-y-1 bg-background/50 p-2.5 rounded border border-foreground/5">
                  <span className="text-[10px] text-muted-foreground block uppercase font-sans">Heuristics Summary</span>
                  <div className="grid grid-cols-2 gap-1 text-[11px]">
                    <div>Accepted Headings: <span className="font-bold text-emerald-500">{acceptedCount}</span></div>
                    <div>Rejected Headings: <span className="font-bold text-rose-500">{rejectedHeadings.length}</span></div>
                    <div>False Positives: <span className="font-bold text-rose-500">{rejectedHeadings.length}</span></div>
                    <div>Sections: <span className="font-bold">{document.sections.length}</span></div>
                    <div>Paragraphs: <span className="font-bold">{document.paragraphs.length}</span></div>
                    <div>Words: <span className="font-bold">{stats.wordCount}</span></div>
                  </div>
                </div>
                <div className="space-y-1 bg-background/50 p-2.5 rounded border border-foreground/5">
                  <span className="text-[10px] text-muted-foreground block uppercase font-sans">Methods Distribution</span>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px]">
                    <div>native: <span className="font-bold">{methodCounts.native || 0}</span></div>
                    <div>bold: <span className="font-bold">{methodCounts.bold || 0}</span></div>
                    <div>uppercase: <span className="font-bold">{methodCounts.uppercase || 0}</span></div>
                    <div>keyword: <span className="font-bold">{methodCounts.keyword || 0}</span></div>
                    <div>heuristic: <span className="font-bold">{methodCounts.heuristic || 0}</span></div>
                    <div>unknown: <span className="font-bold">{methodCounts.unknown || 0}</span></div>
                  </div>
                </div>
              </div>

              {/* Headings breakdown */}
              <div className="space-y-2">
                <span className="text-[10px] text-muted-foreground block uppercase font-sans">First 10 Extracted Headings & Confidence</span>
                {first10Headings.length > 0 ? (
                  <div className="overflow-x-auto border border-foreground/5 rounded">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead>
                        <tr className="bg-background/80 border-b border-foreground/5">
                          <th className="p-2 font-sans text-muted-foreground">Index</th>
                          <th className="p-2 font-sans text-muted-foreground">Level</th>
                          <th className="p-2 font-sans text-muted-foreground">Text</th>
                          <th className="p-2 font-sans text-muted-foreground">Method</th>
                          <th className="p-2 font-sans text-muted-foreground text-right">Confidence</th>
                        </tr>
                      </thead>
                      <tbody>
                        {first10Headings.map((h, idx) => (
                          <tr key={idx} className="border-b border-foreground/5 hover:bg-background/30">
                            <td className="p-2 font-mono text-muted-foreground">{idx}</td>
                            <td className="p-2 font-mono">H{h.level}</td>
                            <td className="p-2 font-sans max-w-[200px] truncate" title={h.text}>{h.text}</td>
                            <td className="p-2">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                                h.detectionMethod === "native" ? "bg-blue-500/10 text-blue-500" :
                                h.detectionMethod === "keyword" ? "bg-emerald-500/10 text-emerald-500" :
                                h.detectionMethod === "bold" ? "bg-amber-500/10 text-amber-500" :
                                h.detectionMethod === "uppercase" ? "bg-purple-500/10 text-purple-500" :
                                "bg-zinc-500/10 text-zinc-500"
                              }`}>
                                {h.detectionMethod || "unknown"}
                              </span>
                            </td>
                            <td className="p-2 text-right font-mono">
                              {h.confidence !== undefined ? `${(h.confidence * 100).toFixed(0)}%` : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted-foreground italic text-[11px]">No headings extracted.</p>
                )}
              </div>

              {/* Rejected Headings breakdown */}
              <div className="space-y-2">
                <span className="text-[10px] text-muted-foreground block uppercase font-sans">Top 20 Rejected Candidates & Reason For Rejection</span>
                {top20RejectedHeadings.length > 0 ? (
                  <div className="overflow-x-auto border border-foreground/5 rounded">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead>
                        <tr className="bg-background/80 border-b border-foreground/5">
                          <th className="p-2 font-sans text-muted-foreground">Index</th>
                          <th className="p-2 font-sans text-muted-foreground">Original Text</th>
                          <th className="p-2 font-sans text-muted-foreground">Reason For Rejection</th>
                        </tr>
                      </thead>
                      <tbody>
                        {top20RejectedHeadings.map((rh, idx) => (
                          <tr key={idx} className="border-b border-foreground/5 hover:bg-background/30 text-rose-600 dark:text-rose-400">
                            <td className="p-2 font-mono text-muted-foreground">{idx + 1}</td>
                            <td className="p-2 font-sans max-w-[250px] truncate" title={rh.text}>{rh.text}</td>
                            <td className="p-2 font-sans">{rh.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted-foreground italic text-[11px]">No rejected headings (0 false positives).</p>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  )
}
