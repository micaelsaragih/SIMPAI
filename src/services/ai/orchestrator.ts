import { AIFactory } from "./factory"
import { AnalysisRequest, AnalysisResponse } from "./types"

/**
 * Execute the AI analysis pipeline using active providers with sequential fallback.
 * Falls back to the local Offline Heuristic Engine if all API endpoints fail or keys are unconfigured.
 */
export async function runAIAnalysis(
  request: AnalysisRequest,
  preferredProvider: string = "openrouter"
): Promise<AnalysisResponse> {
  const activeProviders: string[] = []

  // Check which API keys are populated in the environment variables
  const keys = {
    openrouter: !!process.env.OPENROUTER_API_KEY,
    deepseek: !!process.env.DEEPSEEK_API_KEY,
    gemini: !!process.env.GEMINI_API_KEY,
    openai: !!process.env.OPENAI_API_KEY
  }

  // 1. Prioritize preferred provider if its key is configured
  const preferred = preferredProvider.toLowerCase().trim()
  if (preferred && keys[preferred as keyof typeof keys]) {
    activeProviders.push(preferred)
  }

  // 2. Add other configured API providers in standard priority hierarchy
  const hierarchy = ["openrouter", "deepseek", "gemini", "openai"]
  for (const provider of hierarchy) {
    if (keys[provider as keyof typeof keys] && !activeProviders.includes(provider)) {
      activeProviders.push(provider)
    }
  }

  console.log(`SIMPAI AI Orchestrator active provider chain: [${activeProviders.join(" -> ")}]`)

  // 3. Attempt each active provider in sequence
  for (const providerName of activeProviders) {
    try {
      console.log(`SIMPAI AI Orchestrator attempting provider: "${providerName}"`)
      const provider = AIFactory.getProvider(providerName)
      const result = await provider.analyzeArticle(request)
      console.log(`SIMPAI AI Orchestrator successfully analyzed document using: "${provider.name}"`)
      return result
    } catch (err) {
      console.warn(`SIMPAI AI Orchestrator provider "${providerName}" failed. Moving to next fallback.`, err)
    }
  }

  // 4. Default Offline Fallback if all configured API calls fail or no keys exist
  console.warn("SIMPAI AI Orchestrator: All API providers failed or are unconfigured. Falling back to local Heuristic Engine.")
  const offlineProvider = AIFactory.getProvider("offline")
  return await offlineProvider.analyzeArticle(request)
}
