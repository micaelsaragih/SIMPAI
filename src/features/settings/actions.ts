"use server"

import { createClient } from "@/services/supabase/server"
import { updateSettingsSchema } from "@/lib/validators/settings"
import type { ActionResponse, UserSettings } from "@/types/database"

export async function getSettingsAction(): Promise<
  ActionResponse<UserSettings>
> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "User not authenticated" }
    }

    const { data, error } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: data as UserSettings }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return {
      success: false,
      error: "An unexpected error occurred while fetching settings",
    }
  }
}

export async function updateSettingsAction(
  formData: FormData
): Promise<ActionResponse<UserSettings>> {
  try {
    const rawData = {
      theme: formData.get("theme") as string,
      preferred_ai_provider: formData.get("preferred_ai_provider") as string,
    }

    const validated = updateSettingsSchema.parse(rawData)

    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "User not authenticated" }
    }

    const { data, error } = await supabase
      .from("user_settings")
      .update({
        theme: validated.theme,
        preferred_ai_provider: validated.preferred_ai_provider,
      })
      .eq("user_id", user.id)
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: data as UserSettings }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return {
      success: false,
      error: "An unexpected error occurred while updating settings",
    }
  }
}
