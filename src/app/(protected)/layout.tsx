import { redirect } from "next/navigation"
import { getAuthenticatedProfile } from "@/services/supabase/profile-cache"
import { DashboardShell } from "@/components/layout/DashboardShell"
import type { Profile } from "@/types/database"

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await getAuthenticatedProfile()

  if (!user) redirect("/login")

  return <DashboardShell profile={profile as Profile}>{children}</DashboardShell>
}
