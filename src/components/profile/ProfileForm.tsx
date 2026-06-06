"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateProfileSchema, type UpdateProfileFormValues } from "@/lib/validators/profile"
import { updateProfileAction } from "@/features/profile/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Loader2Icon, UserIcon, LinkIcon, MailIcon, ShieldIcon, CalendarIcon } from "lucide-react"
import type { Profile } from "@/types/database"

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

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export function ProfileForm({ profile }: { profile: Profile }) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      full_name: profile.full_name,
      avatar_url: profile.avatar_url ?? "",
    },
  })

  const watchedName = watch("full_name")

  async function onSubmit(values: UpdateProfileFormValues) {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("full_name", values.full_name)
      formData.append("avatar_url", values.avatar_url ?? "")

      const result = await updateProfileAction(formData)

      if (result.success) {
        toast.success("Profil berhasil diperbarui!")
      } else {
        toast.error(result.error || "Gagal memperbarui profil.")
      }
    } catch {
      toast.error("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Avatar Preview Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <Avatar size="lg" className="h-24 w-24">
              {profile.avatar_url && (
                <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
              )}
              <AvatarFallback className="text-2xl">
                {getInitials(watchedName || profile.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="font-semibold text-lg">{watchedName || profile.full_name}</p>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
            <Badge variant={roleVariants[profile.role] ?? "default"}>
              {roleLabels[profile.role] ?? profile.role}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Profile Form Card */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Informasi Profil</CardTitle>
          <CardDescription>Perbarui nama dan avatar Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="full_name">Nama Lengkap</Label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="full_name"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  className="pl-10"
                  {...register("full_name")}
                  aria-invalid={!!errors.full_name}
                />
              </div>
              {errors.full_name && (
                <p className="text-sm text-destructive">{errors.full_name.message}</p>
              )}
            </div>

            {/* Avatar URL */}
            <div className="space-y-2">
              <Label htmlFor="avatar_url">Avatar URL</Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="avatar_url"
                  type="text"
                  placeholder="https://example.com/avatar.jpg (opsional)"
                  className="pl-10"
                  {...register("avatar_url")}
                  aria-invalid={!!errors.avatar_url}
                />
              </div>
              {errors.avatar_url && (
                <p className="text-sm text-destructive">{errors.avatar_url.message}</p>
              )}
            </div>

            {/* Email (read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled
                  className="pl-10 bg-muted/50 text-muted-foreground cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-muted-foreground">Email tidak dapat diubah.</p>
            </div>

            {/* Role (read-only) */}
            <div className="space-y-2">
              <Label>Role</Label>
              <div className="flex items-center gap-2">
                <ShieldIcon className="h-4 w-4 text-muted-foreground" />
                <Badge variant={roleVariants[profile.role] ?? "default"}>
                  {roleLabels[profile.role] ?? profile.role}
                </Badge>
              </div>
            </div>

            {/* Member Since (read-only) */}
            <div className="space-y-2">
              <Label>Bergabung Sejak</Label>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4" />
                <span>{formatDate(profile.created_at)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Perubahan
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
