"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTheme } from "next-themes"
import { updateSettingsSchema, type UpdateSettingsFormValues } from "@/lib/validators/settings"
import { updateSettingsAction } from "@/features/settings/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2Icon, SunIcon, MoonIcon, MonitorIcon, SparklesIcon, CpuIcon, BrainIcon, BotIcon } from "lucide-react"
import type { UserSettings } from "@/types/database"

export function SettingsForm({ settings }: { settings: UserSettings }) {
  const [isLoading, setIsLoading] = useState(false)
  const { setTheme } = useTheme()

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UpdateSettingsFormValues>({
    resolver: zodResolver(updateSettingsSchema),
    defaultValues: {
      theme: settings.theme,
      preferred_ai_provider: settings.preferred_ai_provider,
    },
  })

  const currentTheme = watch("theme")
  const currentProvider = watch("preferred_ai_provider")

  async function onSubmit(values: UpdateSettingsFormValues) {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("theme", values.theme)
      formData.append("preferred_ai_provider", values.preferred_ai_provider)

      const result = await updateSettingsAction(formData)

      if (result.success) {
        toast.success("Pengaturan berhasil disimpan!")
        setTheme(values.theme)
      } else {
        toast.error(result.error || "Gagal menyimpan pengaturan.")
      }
    } catch {
      toast.error("Terjadi kesalahan. Silakan coba lagi.")
    } finally {
      setIsLoading(false)
    }
  }

  const themes = [
    {
      id: "light",
      label: "Terang (Light)",
      description: "Tampilan bersih untuk siang hari.",
      icon: SunIcon,
    },
    {
      id: "dark",
      label: "Gelap (Dark)",
      description: "Lebih ramah untuk mata di malam hari.",
      icon: MoonIcon,
    },
    {
      id: "system",
      label: "Sistem (System)",
      description: "Gunakan pengaturan tema dari perangkat Anda.",
      icon: MonitorIcon,
    },
  ] as const

  const aiProviders = [
    {
      id: "openrouter",
      name: "OpenRouter",
      description: "Akses LLM premium (Claude 3.5 Sonnet, GPT-4o, Llama 3).",
      icon: SparklesIcon,
    },
    {
      id: "deepseek",
      name: "DeepSeek",
      description: "Model berkemampuan tinggi dengan latensi rendah untuk logika.",
      icon: CpuIcon,
    },
    {
      id: "gemini",
      name: "Google Gemini",
      description: "Integrasi native berkecepatan tinggi dengan Gemini 1.5 Pro / Flash.",
      icon: BrainIcon,
    },
    {
      id: "openai",
      name: "OpenAI",
      description: "Model standar industri GPT-4o dan GPT-4o-mini.",
      icon: BotIcon,
    },
  ] as const

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
      {/* Theme Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Tema Tampilan</CardTitle>
          <CardDescription>Sesuaikan mode tema visual antarmuka SIMPAI.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {themes.map((theme) => {
              const Icon = theme.icon
              const isActive = currentTheme === theme.id
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setValue("theme", theme.id)}
                  className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all hover:bg-muted/50 ${
                    isActive
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-semibold text-sm">{theme.label}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{theme.description}</span>
                </button>
              )
            })}
          </div>
          {errors.theme && (
            <p className="text-sm text-destructive mt-2">{errors.theme.message}</p>
          )}
        </CardContent>
      </Card>

      {/* AI Provider Selection */}
      <Card>
        <CardHeader>
          <CardTitle>AI Provider Utama</CardTitle>
          <CardDescription>Pilih asisten AI default yang akan mendampingi penulisan ilmiah Anda.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {aiProviders.map((provider) => {
              const Icon = provider.icon
              const isActive = currentProvider === provider.id
              return (
                <button
                  key={provider.id}
                  type="button"
                  onClick={() => setValue("preferred_ai_provider", provider.id)}
                  className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all hover:bg-muted/50 ${
                    isActive
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-semibold text-sm">{provider.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{provider.description}</span>
                </button>
              )
            })}
          </div>
          {errors.preferred_ai_provider && (
            <p className="text-sm text-destructive mt-2">{errors.preferred_ai_provider.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-start">
        <Button type="submit" size="lg" disabled={isLoading} className="px-8">
          {isLoading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
          Simpan Pengaturan
        </Button>
      </div>
    </form>
  )
}
