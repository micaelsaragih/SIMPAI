import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { createClient } from "@/services/supabase/server"
import { getTemplateById } from "@/features/template-intelligence/services/template-service"
import { TemplateDetail } from "@/components/templates/TemplateDetail"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { title: "Detail Template — SIMPAI" }

  const result = await getTemplateById(id, user.id)
  return {
    title: result ? `${result.template.name} — SIMPAI` : "Template Tidak Ditemukan — SIMPAI",
  }
}

export default async function TemplateDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const result = await getTemplateById(id, user.id)
  if (!result) notFound()

  return (
    <TemplateDetail
      initialTemplate={result.template}
      initialVersions={result.versions}
      isOwner={result.isOwner}
    />
  )
}
