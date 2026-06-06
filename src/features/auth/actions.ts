"use server"

import { createClient } from "@/services/supabase/server"
import { redirect } from "next/navigation"
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
} from "@/lib/validators/auth"
import type { ActionResponse } from "@/types/database"

export async function loginAction(
  formData: FormData
): Promise<ActionResponse> {
  let shouldRedirect = false

  try {
    const rawData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    }

    const validated = loginSchema.parse(rawData)

    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: validated.email,
      password: validated.password,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    shouldRedirect = true
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: "An unexpected error occurred during login" }
  }

  if (shouldRedirect) {
    redirect("/dashboard")
  }

  return { success: true }
}

export async function registerAction(
  formData: FormData
): Promise<ActionResponse> {
  let shouldRedirect = false

  try {
    const rawData = {
      full_name: formData.get("full_name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    }

    const validated = registerSchema.parse(rawData)

    const supabase = await createClient()
    const { error } = await supabase.auth.signUp({
      email: validated.email,
      password: validated.password,
      options: {
        data: {
          full_name: validated.full_name,
        },
      },
    })

    if (error) {
      return { success: false, error: error.message }
    }

    shouldRedirect = true
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return {
      success: false,
      error: "An unexpected error occurred during registration",
    }
  }

  if (shouldRedirect) {
    redirect("/dashboard")
  }

  return { success: true }
}

export async function logoutAction(): Promise<ActionResponse> {
  let shouldRedirect = false

  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      return { success: false, error: error.message }
    }

    shouldRedirect = true
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return {
      success: false,
      error: "An unexpected error occurred during logout",
    }
  }

  if (shouldRedirect) {
    redirect("/login")
  }

  return { success: true }
}

export async function forgotPasswordAction(
  formData: FormData
): Promise<ActionResponse> {
  try {
    const rawData = {
      email: formData.get("email") as string,
    }

    const validated = forgotPasswordSchema.parse(rawData)

    const supabase = await createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(
      validated.email
    )

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return {
      success: false,
      error: "An unexpected error occurred while resetting password",
    }
  }
}
