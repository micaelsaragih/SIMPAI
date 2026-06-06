import React, { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { EvalResult } from "@/features/evaluation/types"

interface ResultTableProps {
  results: EvalResult[]
}

export function ResultTable({ results }: ResultTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null)
    } else {
      setExpandedId(id)
    }
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-muted/50 bg-card/40 backdrop-blur-md shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-muted/40 bg-muted/30 font-medium text-muted-foreground text-xs uppercase tracking-wider">
              <th className="py-3.5 px-4 font-semibold">ID</th>
              <th className="py-3.5 px-4 font-semibold">Skenario / Sifat Uji</th>
              <th className="py-3.5 px-4 font-semibold text-center w-28">Status</th>
              <th className="py-3.5 px-4 font-semibold">Detail Ekspektasi vs Temuan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-muted/35">
            {results.map((res) => {
              const isExpanded = expandedId === res.id
              return (
                <React.Fragment key={res.id}>
                  <tr
                    onClick={() => toggleExpand(res.id)}
                    className="hover:bg-muted/15 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-4 font-mono text-xs font-semibold text-primary/80">
                      {res.id}
                    </td>
                    <td className="py-4 px-4 font-medium max-w-[280px] truncate">
                      {res.name}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Badge
                        variant={res.passed ? "default" : "destructive"}
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          res.passed
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/15"
                            : "bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/15"
                        }`}
                      >
                        {res.passed ? "Lolos" : "Gagal"}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground text-xs max-w-[400px] truncate">
                      {res.passed ? (
                        <span className="text-emerald-600 dark:text-emerald-500/90 font-medium">
                          Sesuai Ekspektasi
                        </span>
                      ) : (
                        <span className="text-rose-500 font-semibold italic">
                          {res.message || "Terdapat ketidakcocokan"}
                        </span>
                      )}
                    </td>
                  </tr>
                  
                  {isExpanded && (
                    <tr className="bg-muted/5">
                      <td colSpan={4} className="py-4 px-6 border-b border-muted/30">
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Detail Pengujian ({res.id})
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            <strong>Nama Skenario:</strong> {res.name}
                          </p>
                          <Separator className="bg-muted/35" />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="p-3.5 rounded-lg bg-card/60 border border-muted/30 space-y-1">
                              <span className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider block">
                                Ekspektasi (Kunci Jawaban)
                              </span>
                              <pre className="whitespace-pre-wrap font-mono text-[11px] text-foreground/80 leading-relaxed overflow-x-auto max-h-40">
                                {res.expected}
                              </pre>
                            </div>
                            <div className={`p-3.5 rounded-lg border space-y-1 ${
                              res.passed 
                                ? "bg-emerald-500/5 border-emerald-500/20" 
                                : "bg-rose-500/5 border-rose-500/20"
                            }`}>
                              <span className="font-semibold text-muted-foreground uppercase text-[10px] tracking-wider block">
                                Output Temuan Aktual
                              </span>
                              <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed overflow-x-auto max-h-40">
                                {res.actual}
                              </pre>
                            </div>
                          </div>
                          {!res.passed && res.message && (
                            <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 font-medium">
                              <strong>Keterangan Error:</strong> {res.message}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
