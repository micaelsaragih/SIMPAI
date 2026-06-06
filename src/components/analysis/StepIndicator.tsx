"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { WizardStep, AnalysisMode } from "@/types/analysis"

const ALL_STEPS = [
  { id: "mode" as const, label: "Mode", description: "Pilih mode analisis" },
  { id: "template" as const, label: "Template", description: "Upload template jurnal" },
  { id: "draft" as const, label: "Draft", description: "Upload artikel" },
  { id: "preview" as const, label: "Preview", description: "Tinjau dokumen" },
  { id: "ready" as const, label: "Siap", description: "Mulai analisis" },
]

interface StepIndicatorProps {
  currentStep: WizardStep
  mode: AnalysisMode | null
}

export function StepIndicator({ currentStep, mode }: StepIndicatorProps) {
  const steps =
    mode === "draft-only"
      ? ALL_STEPS.filter((s) => s.id !== "template")
      : ALL_STEPS

  const currentIndex = steps.findIndex((s) => s.id === currentStep)

  return (
    <nav aria-label="Langkah analisis" className="w-full px-2">
      <ol className="flex items-start justify-between gap-0">
        {steps.map((step, index) => {
          const isCompleted = index < currentIndex
          const isCurrent = index === currentIndex
          const isUpcoming = index > currentIndex

          return (
            <li
              key={step.id}
              className="flex flex-1 items-start"
            >
              {/* Step circle + connecting line */}
              <div className="flex w-full flex-col items-center gap-2">
                <div className="flex w-full items-center">
                  {/* Left connector line */}
                  {index > 0 && (
                    <div
                      className={cn(
                        "h-0.5 flex-1 rounded-full transition-colors duration-300",
                        isCompleted || isCurrent
                          ? "bg-primary"
                          : "bg-muted-foreground/20"
                      )}
                    />
                  )}

                  {/* Step circle */}
                  <div
                    className={cn(
                      "relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300",
                      isCompleted &&
                        "bg-primary text-primary-foreground shadow-md shadow-primary/25",
                      isCurrent &&
                        "bg-primary/10 text-primary ring-2 ring-primary ring-offset-2 ring-offset-background",
                      isUpcoming &&
                        "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="size-4 stroke-[3]" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>

                  {/* Right connector line */}
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "h-0.5 flex-1 rounded-full transition-colors duration-300",
                        index < currentIndex
                          ? "bg-primary"
                          : "bg-muted-foreground/20"
                      )}
                    />
                  )}
                </div>

                {/* Labels — visible on md+ */}
                <div className="hidden flex-col items-center gap-0.5 text-center md:flex">
                  <span
                    className={cn(
                      "text-xs font-semibold transition-colors",
                      isCurrent && "text-primary",
                      isCompleted && "text-primary/80",
                      isUpcoming && "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                  <span className="max-w-[100px] text-[10px] leading-tight text-muted-foreground">
                    {step.description}
                  </span>
                </div>
              </div>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
