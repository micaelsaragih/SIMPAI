import { AnalysisRequest, AnalysisResponse } from "../types/ai-types"

export interface IAIProvider {
  name: string
  analyzeArticle(request: AnalysisRequest): Promise<AnalysisResponse>
}
