import type { Metadata } from "next"
import { getAuthenticatedProfile } from "@/services/supabase/profile-cache"
import { createClient } from "@/services/supabase/server"
import { redirect } from "next/navigation"
import { SettingsForm } from "@/components/settings/SettingsForm"
import type { UserSettings } from "@/types/database"

export const metadata: Metadata = { title: "Pengaturan — SIMPAI" }

export default async function SettingsPage() {
  const { user } = await getAuthenticatedProfile()
  if (!user) redirect("/login")
  
  const supabase = await createClient()
  const { data: settings } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", user.id)
    .single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pengaturan</h1>
        <p className="text-muted-foreground">Kelola konfigurasi tampilan dan asisten AI Anda.</p>
      </div>
      <SettingsForm settings={settings as UserSettings} />
    </div>
  )
}
