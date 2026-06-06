import type { Metadata } from "next"
import { getAuthenticatedProfile } from "@/services/supabase/profile-cache"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/profile/ProfileForm"
import type { Profile } from "@/types/database"

export const metadata: Metadata = { title: "Profil — SIMPAI" }

export default async function ProfilePage() {
  const { user, profile } = await getAuthenticatedProfile()
  if (!user) redirect("/login")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profil Pengguna</h1>
        <p className="text-muted-foreground">Kelola informasi data diri Anda.</p>
      </div>
      <ProfileForm profile={profile as Profile} />
    </div>
  )
}
