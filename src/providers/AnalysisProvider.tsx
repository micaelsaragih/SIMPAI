"use client"

import { createContext, useReducer, type ReactNode } from "react"
import type {
  AnalysisWizardState,
  AnalysisWizardAction,
} from "@/types/analysis"

// ─── Initial State ──────────────────────────────────────────────────────────

const initialState: AnalysisWizardState = {
  mode: null,
  currentStep: "mode",
  templateSource: null,
  existingTemplateId: null,
  templateFile: null,
  templateData: null,
  draftFile: null,
  draftData: null,
  isProcessing: false,
  error: null,
}

// ─── Reducer ────────────────────────────────────────────────────────────────

function analysisReducer(
  state: AnalysisWizardState,
  action: AnalysisWizardAction
): AnalysisWizardState {
  switch (action.type) {
    case "SET_MODE":
      return { ...state, mode: action.payload, error: null }
    case "SET_STEP":
      return { ...state, currentStep: action.payload, error: null }
    case "SET_TEMPLATE_SOURCE":
      return { ...state, templateSource: action.payload, error: null }
    case "SET_EXISTING_TEMPLATE":
      return { ...state, existingTemplateId: action.payload, error: null }
    case "SET_TEMPLATE_FILE":
      return { ...state, templateFile: action.payload, error: null }
    case "SET_TEMPLATE_DATA":
      return { ...state, templateData: action.payload, error: null }
    case "SET_DRAFT_FILE":
      return { ...state, draftFile: action.payload, error: null }
    case "SET_DRAFT_DATA":
      return { ...state, draftData: action.payload, error: null }
    case "SET_PROCESSING":
      return { ...state, isProcessing: action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload, isProcessing: false }
    case "RESET":
      return initialState
    default:
      return state
  }
}

// ─── Context ────────────────────────────────────────────────────────────────

export interface AnalysisContextValue {
  state: AnalysisWizardState
  dispatch: React.Dispatch<AnalysisWizardAction>
}

export const AnalysisContext = createContext<AnalysisContextValue | null>(null)

// ─── Provider ───────────────────────────────────────────────────────────────

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(analysisReducer, initialState)

  return (
    <AnalysisContext value={{ state, dispatch }}>
      {children}
    </AnalysisContext>
  )
}
