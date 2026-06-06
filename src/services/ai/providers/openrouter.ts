import { IAIProvider } from "../interfaces/ai-provider"
import { 
  AnalysisRequest, 
  AnalysisResponse, 
  AIAnalysisResult, 
  AIAnalysisResultSchema 
} from "../types/ai-types"
import { compileUnifiedAIPrompt } from "@/features/ai-analysis"
import { SYSTEM_ROLE } from "../prompts/analysis-prompt"
import type { ParsedDocument, Heading } from "@/types/analysis"
import type { StructureAnalysis, ComplianceResult } from "@/features/analysis-engine/types"

// Enforce server-side execution
if (typeof window !== "undefined") {
  throw new Error("OpenRouterAIProvider can only be instantiated on the server side.")
}

export class OpenRouterAIProvider implements IAIProvider {
  name = "OpenRouter"

  // Model strategy: Primary -> Fallback -> Final Fallback
  private models = [
    "google/gemini-2.5-flash",
    "deepseek/deepseek-chat",
    "openai/gpt-4o-mini"
  ]

  async analyzeArticle(request: AnalysisRequest): Promise<AnalysisResponse> {
    const apiKey = process.env.OPENROUTER_API_KEY
    const baseUrl = process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1"

    if (!apiKey) {
      throw new Error("OPENROUTER_API_KEY is not configured in environment variables.")
    }

    // Map incoming AnalysisRequest data to ParsedDocument for compileUnifiedAIPrompt
    const draftData: ParsedDocument = {
      title: (request.config?.documentTitle as string) || "Untitled Document",
      headings: (request.config?.headings as Heading[]) || [],
      sections: (request.config?.sections as ParsedDocument["sections"]) || [],
      paragraphs: (request.config?.paragraphs as ParsedDocument["paragraphs"]) || [],
      rawText: request.articleText,
      statistics: {
        wordCount: request.articleText.split(/\s+/).length,
        paragraphCount: (request.config?.paragraphs as ParsedDocument["paragraphs"])?.length || 0,
        sectionCount: (request.config?.sections as ParsedDocument["sections"])?.length || 0,
        headingCount: (request.config?.headings as Heading[])?.length || 0,
        characterCount: request.articleText.length,
      }
    }

    const promptText = compileUnifiedAIPrompt(draftData)
    let lastError: Error | null = null

    // Attempt models in sequence
    for (const model of this.models) {
      try {
        console.log(`[OpenRouter] Attempting academic review using model: ${model}`)
        const startTime = Date.now()

        // Fetch with 3 retries and a 20-second timeout per model call
        const responseText = await this.fetchWithRetryAndTimeout(
          baseUrl,
          apiKey,
          model,
          promptText,
          3,
          20000
        )

        const duration = Date.now() - startTime
        console.log(`[OpenRouter] Successfully received response from ${model} in ${duration}ms`)

        const aiAnalysisResult = this.parseAndValidateResponse(responseText)

        // Structure response compatible with the legacy frontend as well as the new tabs
        return {
          score: aiAnalysisResult.overallScore,
          structure: (request.config?.structure as StructureAnalysis | undefined)?.sections?.map((s) => ({
            section: s.label,
            status: s.status.toLowerCase() as "found" | "missing" | "incomplete",
            feedback: s.status === "FOUND" ? "Terdeteksi dengan baik." : "Perlu perbaikan."
          })) || [],
          compliance: request.config?.compliance
            ? {
                score: (request.config.compliance as ComplianceResult).compliance,
                missingSections: (request.config.compliance as ComplianceResult).missing,
                wrongOrder: ((request.config.compliance as ComplianceResult).orderIssues || []).map((issue) => ({
                  section: issue.section,
                  expectedIndex: issue.expectedPosition - 1,
                  actualIndex: issue.actualPosition - 1
                })),
                additionalSections: (request.config.compliance as ComplianceResult).extra
              }
            : {
                score: 100,
                missingSections: [],
                wrongOrder: [],
                additionalSections: []
              },
          language: aiAnalysisResult.languageReview.map(l => ({
            word: l.finding.substring(0, 30),
            type: l.severity === "high" ? ("non-standard" as const) : ("informal" as const),
            suggestion: l.suggestedRevision,
            context: l.exampleCorrection
          })),
          recommendations: aiAnalysisResult.recommendations,
          aiAnalysis: aiAnalysisResult
        }
      } catch (error) {
        console.warn(`[OpenRouter Fallback] Model ${model} failed. Trying next model. Error:`, error)
        lastError = error instanceof Error ? error : new Error(String(error))
      }
    }

    throw new Error(`OpenRouter analysis failed for all models in the chain. Last error: ${lastError?.message}`)
  }

  private async fetchWithRetryAndTimeout(
    baseUrl: string,
    apiKey: string,
    model: string,
    prompt: string,
    maxRetries: number,
    timeoutMs: number
  ): Promise<string> {
    let attempts = 0
    let delay = 1000

    while (attempts < maxRetries) {
      attempts++
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

        const response = await fetch(`${baseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
            "HTTP-Referer": "https://simpai.vercel.app",
            "X-Title": "SIMPAI Academic Reviewer"
          },
          body: JSON.stringify({
            model: model,
            response_format: { type: "json_object" },
            messages: [
              { role: "system", content: SYSTEM_ROLE },
              { role: "user", content: prompt }
            ]
          }),
          signal: controller.signal
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP Error ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        const content = data.choices?.[0]?.message?.content

        if (!content) {
          throw new Error("Empty completion content received from OpenRouter API.")
        }

        // Logging tokens usage
        if (data.usage) {
          console.log(`[OpenRouter Usage Logs] Provider: OpenRouter | Model: ${model} | Prompt Tokens: ${data.usage.prompt_tokens} | Completion Tokens: ${data.usage.completion_tokens} | Total Tokens: ${data.usage.total_tokens}`)
        }

        return content
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        const isAbort = err.name === "AbortError" || err.message?.includes("aborted")
        console.warn(`[OpenRouter Retry Log] Attempt ${attempts}/${maxRetries} failed for model ${model}. Error: ${err.message}`)

        if (attempts >= maxRetries || isAbort) {
          throw error
        }

        // Exponential backoff delay
        await new Promise(resolve => setTimeout(resolve, delay))
        delay *= 2
      }
    }

    throw new Error("Max retries reached on OpenRouter connection.")
  }

  private parseAndValidateResponse(text: string): AIAnalysisResult {
    try {
      let cleaned = text.trim()
      
      // Clean markdown code fence formatting if present
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```json\s*/i, "").replace(/```$/, "").trim()
      }

      // Isolate raw JSON block
      const jsonStart = cleaned.indexOf("{")
      const jsonEnd = cleaned.lastIndexOf("}")

      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleaned = cleaned.substring(jsonStart, jsonEnd + 1)
      }

      const parsedJson = JSON.parse(cleaned)

      // Strict validation against Zod schema
      const validatedData = AIAnalysisResultSchema.parse(parsedJson)
      return validatedData
    } catch (err) {
      console.error("[OpenRouter Schema Validation Error] Failed to parse or validate JSON response:", err)
      throw new Error("AI response structure failed strict JSON schema validation.")
    }
  }
}
