"use server"

import { createClient } from "@/services/supabase/server"
import { updateProfileSchema } from "@/lib/validators/profile"
import type { ActionResponse, Profile } from "@/types/database"

export async function getProfileAction(): Promise<ActionResponse<Profile>> {
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
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: data as Profile }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return {
      success: false,
      error: "An unexpected error occurred while fetching profile",
    }
  }
}

export async function updateProfileAction(
  formData: FormData
): Promise<ActionResponse<Profile>> {
  try {
    const rawData = {
      full_name: formData.get("full_name") as string,
      avatar_url: (formData.get("avatar_url") as string) || null,
    }

    const validated = updateProfileSchema.parse(rawData)

    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: "User not authenticated" }
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name: validated.full_name,
        avatar_url: validated.avatar_url || null,
      })
      .eq("id", user.id)
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: data as Profile }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return {
      success: false,
      error: "An unexpected error occurred while updating profile",
    }
  }
}
