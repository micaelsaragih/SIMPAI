"use client"

import { FileText, GitCompare, CheckCircle2 } from "lucide-react"
import { useAnalysis } from "@/hooks/useAnalysis"
import { cn } from "@/lib/utils"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"

export function ModeSelector() {
  const { state, dispatch } = useAnalysis()

  const handleSelectMode = (mode: "draft-only" | "template-based") => {
    dispatch({ type: "SET_MODE", payload: mode })
    if (mode === "draft-only") {
      dispatch({ type: "SET_STEP", payload: "draft" })
    } else {
      dispatch({ type: "SET_STEP", payload: "template" })
    }
  }

  const modesConfig = [
    {
      id: "draft-only" as const,
      title: "Analisis Draft Saja",
      description:
        "Analisis struktur dan kualitas penulisan akademik tanpa membandingkan dengan template jurnal.",
      icon: FileText,
      features: ["Analisis Struktur", "Analisis Bahasa", "Rekomendasi AI"],
      iconGradient: "from-blue-500/20 to-indigo-500/5 text-blue-600 dark:text-blue-400",
    },
    {
      id: "template-based" as const,
      title: "Analisis dengan Template Jurnal",
      description:
        "Bandingkan struktur artikel Anda dengan template jurnal untuk memastikan kesesuaian format.",
      icon: GitCompare,
      features: [
        "Analisis Struktur",
        "Kesesuaian Template",
        "Analisis Bahasa",
        "Rekomendasi AI",
      ],
      iconGradient: "from-emerald-500/20 to-teal-500/5 text-emerald-600 dark:text-emerald-400",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {modesConfig.map((modeConfig) => {
        const Icon = modeConfig.icon
        const isSelected = state.mode === modeConfig.id

        return (
          <button
            key={modeConfig.id}
            onClick={() => handleSelectMode(modeConfig.id)}
            className="group text-left focus:outline-none"
            aria-label={`Pilih mode: ${modeConfig.title}`}
          >
            <Card
              className={cn(
                "h-full border border-foreground/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer",
                isSelected
                  ? "border-primary ring-2 ring-primary bg-primary/5 dark:bg-primary/5"
                  : "hover:border-primary/50"
              )}
            >
              <CardHeader className="flex flex-col gap-4">
                <div
                  className={cn(
                    "flex size-12 items-center justify-center rounded-xl bg-gradient-to-br",
                    modeConfig.iconGradient
                  )}
                >
                  <Icon className="size-6" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {modeConfig.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                    {modeConfig.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border-t border-foreground/5 pt-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Fitur Analisis
                  </span>
                  <ul className="mt-3 space-y-2">
                    {modeConfig.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2.5 text-sm text-foreground/80">
                        <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </button>
        )
      })}
    </div>
  )
}
