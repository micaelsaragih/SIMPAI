import { z } from "zod"

/**
 * Validation schema for user settings form.
 */

export const updateSettingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  preferred_ai_provider: z.enum(["openrouter", "deepseek", "gemini", "openai"]),
})

export type UpdateSettingsFormValues = z.infer<typeof updateSettingsSchema>
