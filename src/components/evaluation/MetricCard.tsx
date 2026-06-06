import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MetricCardProps {
  title: string
  score: number
  description: string
  passed: number
  total: number
}

export function MetricCard({ title, score, description, passed, total }: MetricCardProps) {
  // Determine colors based on score
  let strokeColor = "stroke-rose-500"
  let textColor = "text-rose-600 dark:text-rose-400"
  let borderGrad = "from-rose-500/20 to-orange-500/20"

  if (score >= 90) {
    strokeColor = "stroke-emerald-500"
    textColor = "text-emerald-600 dark:text-emerald-400"
    borderGrad = "from-emerald-500/20 to-teal-500/20"
  } else if (score >= 75) {
    strokeColor = "stroke-blue-500"
    textColor = "text-blue-600 dark:text-blue-400"
    borderGrad = "from-blue-500/20 to-indigo-500/20"
  } else if (score >= 60) {
    strokeColor = "stroke-amber-500"
    textColor = "text-amber-600 dark:text-amber-400"
    borderGrad = "from-amber-500/20 to-yellow-500/20"
  }

  // Radial progress calculations
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <Card className="relative overflow-hidden border border-muted/45 bg-card/60 backdrop-blur-md shadow-lg transition-all hover:scale-[1.01] hover:shadow-xl">
      <div className={`absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r ${borderGrad}`} />
      
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex items-center justify-between">
        <div className="space-y-1 pr-4">
          <div className="text-2xl font-bold tracking-tight">{passed} / {total} <span className="text-sm font-normal text-muted-foreground">Kasus</span></div>
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        </div>
        
        <div className="relative flex items-center justify-center h-20 w-20 shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              className="stroke-muted/20 fill-transparent"
              strokeWidth="6"
            />
            {/* Foreground Circle */}
            <circle
              cx="40"
              cy="40"
              r={radius}
              className={`${strokeColor} fill-transparent transition-all duration-700 ease-in-out`}
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className={`text-base font-extrabold tracking-tighter ${textColor}`}>{score}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
