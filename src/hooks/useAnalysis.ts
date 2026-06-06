import { useContext } from "react"
import { AnalysisContext, type AnalysisContextValue } from "@/providers/AnalysisProvider"

/**
 * Custom hook to access the analysis wizard state and dispatch.
 * Must be used within an <AnalysisProvider>.
 */
export function useAnalysis(): AnalysisContextValue {
  const context = useContext(AnalysisContext)

  if (!context) {
    throw new Error(
      "useAnalysis must be used within an <AnalysisProvider>. " +
      "Wrap your component tree with <AnalysisProvider>."
    )
  }

  return context
}
