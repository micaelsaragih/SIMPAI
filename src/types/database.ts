/**
 * Database type definitions for SIMPAI.
 * Matches the Supabase PostgreSQL schema defined in supabase/schema.sql.
 */

// ─── Role & Enum Types ─────────────────────────────────────────────────────

export type UserRole = "student" | "lecturer" | "admin"

export type ThemePreference = "light" | "dark" | "system"

export type AIProvider = "openrouter" | "deepseek" | "gemini" | "openai"

export type TemplateCategory =
  | "computer-science"
  | "information-systems"
  | "engineering"
  | "education"
  | "general"

// ─── Table Row Types ────────────────────────────────────────────────────────

export interface Profile {
  id: string
  full_name: string
  email: string
  avatar_url: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface UserSettings {
  id: string
  user_id: string
  theme: ThemePreference
  preferred_ai_provider: AIProvider
  created_at: string
  updated_at: string
}

export interface JournalTemplate {
  id: string
  name: string
  slug: string
  publisher: string | null
  description: string | null
  category: TemplateCategory
  required_sections: string[]
  section_order: string[]
  section_keywords: Record<string, string[]>
  heading_structure: Array<{ level: number; text: string }>
  quality_score: number
  created_by: string
  created_at: string
  updated_at: string
}

export interface TemplateVersion {
  id: string
  template_id: string
  version_name: string
  version_number: string
  notes: string | null
  section_snapshot: string[]
  created_by: string
  created_at: string
}

// ─── Database Schema Type ───────────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, "created_at" | "updated_at"> & {
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<Profile, "id" | "created_at">> & {
          updated_at?: string
        }
      }
      user_settings: {
        Row: UserSettings
        Insert: Omit<UserSettings, "id" | "created_at" | "updated_at"> & {
          id?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<UserSettings, "id" | "user_id" | "created_at">> & {
          updated_at?: string
        }
      }
      journal_templates: {
        Row: JournalTemplate
        Insert: Omit<JournalTemplate, "id" | "created_at" | "updated_at" | "quality_score"> & {
          id?: string
          quality_score?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Omit<JournalTemplate, "id" | "created_by" | "created_at">> & {
          updated_at?: string
        }
      }
      template_versions: {
        Row: TemplateVersion
        Insert: Omit<TemplateVersion, "id" | "created_at"> & {
          id?: string
          created_at?: string
        }
        Update: never
      }
    }
  }
}

// ─── Server Action Response ─────────────────────────────────────────────────

export interface ActionResponse<T = null> {
  success: boolean
  error?: string
  data?: T
}
