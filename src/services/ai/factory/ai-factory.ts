import { IAIProvider } from "../interfaces/ai-provider"
import { OpenRouterAIProvider } from "../providers/openrouter"
import { DeepSeekAIProvider } from "../providers/deepseek-provider"
import { GeminiAIProvider } from "../providers/gemini-provider"
import { OpenAIProvider } from "../providers/openai-provider"
import { OfflineAIProvider } from "../providers/offline-provider"

export class AIFactory {
  static getProvider(providerName: string): IAIProvider {
    const name = providerName.toLowerCase().trim()
    switch (name) {
      case "openrouter":
        return new OpenRouterAIProvider()
      case "deepseek":
        return new DeepSeekAIProvider()
      case "gemini":
      case "google-gemini":
        return new GeminiAIProvider()
      case "openai":
        return new OpenAIProvider()
      case "offline":
        return new OfflineAIProvider()
      default:
        console.warn(`AI Provider "${providerName}" not recognized. Defaulting to Offline Heuristic Engine.`)
        return new OfflineAIProvider()
    }
  }
}
