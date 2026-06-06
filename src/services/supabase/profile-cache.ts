import { cache } from "react"
import { createClient } from "./server"
import type { Profile } from "@/types/database"

/**
 * Gets the current authenticated user and profile, cached per request.
 * This prevents duplicate Supabase calls when both layout and page fetch the user/profile.
 */
export const getAuthenticatedProfile = cache(async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { user: null, profile: null }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return {
    user,
    profile: profile as Profile | null,
  }
})
