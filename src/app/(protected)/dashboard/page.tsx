import type { Metadata } from "next"
import { getAuthenticatedProfile } from "@/services/supabase/profile-cache"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Profile } from "@/types/database"
import { SparklesIcon, FileTextIcon, ZapIcon } from "lucide-react"

export const metadata: Metadata = { title: "Dashboard — SIMPAI" }

const roleLabels: Record<string, string> = {
  student: "Mahasiswa",
  lecturer: "Dosen",
  admin: "Admin",
}

const roleVariants: Record<string, "default" | "secondary" | "destructive"> = {
  student: "default",
  lecturer: "secondary",
  admin: "destructive",
}

export default async function DashboardPage() {
  const { user, profile } = await getAuthenticatedProfile()

  if (!user) redirect("/login")

  const p = profile as Profile

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Selamat Datang, {p.full_name}!
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{p.email}</Badge>
          <Badge variant={roleVariants[p.role] ?? "default"}>
            {roleLabels[p.role] ?? p.role}
          </Badge>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Welcome Card */}
        <Card className="md:col-span-2 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <SparklesIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Asisten Penulisan Ilmiah AI</CardTitle>
                <CardDescription>SIMPAI siap membantu Anda</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SIMPAI adalah sistem cerdas yang membantu Anda menganalisis artikel ilmiah secara otomatis.
              Evaluasi struktur artikel, kesesuaian template jurnal, dan kualitas bahasa akademik
              menggunakan teknologi AI terkini. Mulai dengan mengunggah artikel Anda untuk mendapatkan
              umpan balik komprehensif.
            </p>
          </CardContent>
        </Card>

        {/* System Info Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <ZapIcon className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <CardTitle className="text-base">Info Sistem</CardTitle>
                <CardDescription>Status aktif</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Versi</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge variant="default" className="text-xs">Aktif</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">AI Engine</span>
                <span className="font-medium">Multi-provider</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Action Card */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                <FileTextIcon className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <CardTitle className="text-base">Analisis Artikel</CardTitle>
                <CardDescription>Mulai analisis artikel ilmiah Anda</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border p-8">
              <div className="text-center space-y-2">
                <FileTextIcon className="h-10 w-10 text-muted-foreground mx-auto" />
                <p className="text-sm font-medium text-muted-foreground">
                  Fitur analisis artikel segera hadir
                </p>
                <p className="text-xs text-muted-foreground/70">
                  Anda akan dapat mengunggah dan menganalisis artikel ilmiah di sini
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
