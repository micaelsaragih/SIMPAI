/**
 * Environment Variables Validator
 * Validates critical environment variables required for the application to function.
 */

export interface EnvValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateEnv(): EnvValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const isProd = process.env.NODE_ENV === "production";

  // 1. Supabase Validation
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    errors.push("NEXT_PUBLIC_SUPABASE_URL is missing.");
  } else if (!supabaseUrl.startsWith("http://") && !supabaseUrl.startsWith("https://")) {
    errors.push("NEXT_PUBLIC_SUPABASE_URL must be a valid URL starting with http:// or https://.");
  }

  if (!supabaseAnonKey) {
    errors.push("NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.");
  } else if (supabaseAnonKey.length < 20) {
    errors.push("NEXT_PUBLIC_SUPABASE_ANON_KEY seems too short or invalid.");
  }

  // 2. Production URL Validation (required in prod)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    if (isProd) {
      errors.push("NEXT_PUBLIC_SITE_URL is required in production environments for SEO and Auth redirection.");
    } else {
      warnings.push("NEXT_PUBLIC_SITE_URL is not set. Defaulting to localhost:3000 for local development.");
    }
  } else if (!siteUrl.startsWith("http://") && !siteUrl.startsWith("https://")) {
    errors.push("NEXT_PUBLIC_SITE_URL must be a valid URL.");
  }

  // 3. AI Providers Validation (at least OpenRouter is required, others optional)
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!openRouterKey) {
    errors.push("OPENROUTER_API_KEY (primary AI provider) is missing.");
  }

  if (!deepseekKey) {
    warnings.push("DEEPSEEK_API_KEY is not configured. DeepSeek provider will fall back to OpenRouter or offline mode.");
  }
  if (!geminiKey) {
    warnings.push("GEMINI_API_KEY is not configured. Gemini provider will fall back to OpenRouter or offline mode.");
  }
  if (!openaiKey) {
    warnings.push("OPENAI_API_KEY is not configured. OpenAI provider will fall back to OpenRouter or offline mode.");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Runs validation and logs results.
 * Throws an error in production if critical variables are missing.
 */
export function enforceEnv(): void {
  const result = validateEnv();

  if (result.warnings.length > 0) {
    console.warn("⚠️ SIMPAI Environment Warnings:\n" + result.warnings.map(w => ` - ${w}`).join("\n"));
  }

  if (!result.isValid) {
    const errorMessage = "❌ SIMPAI Critical Environment Error:\n" + result.errors.map(e => ` - ${e}`).join("\n");
    console.error(errorMessage);
    
    if (process.env.NODE_ENV === "production") {
      throw new Error("Application failed to start due to missing or invalid environment variables.");
    }
  } else {
    console.log("✅ SIMPAI Environment variables successfully validated.");
  }
}
