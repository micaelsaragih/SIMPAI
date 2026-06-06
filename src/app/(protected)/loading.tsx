import { Loader2Icon } from "lucide-react"

export default function Loading() {
  return (
    <div className="space-y-6 w-full animate-pulse p-1">
      {/* Header skeleton */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="h-4 w-72 rounded bg-muted/65" />
        </div>
        <div className="h-10 w-32 rounded bg-muted" />
      </div>

      {/* Grid of cards skeleton */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="h-5 w-24 rounded bg-muted" />
          <div className="h-10 w-12 rounded bg-muted" />
          <div className="h-4 w-36 rounded bg-muted/65" />
        </div>
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="h-5 w-24 rounded bg-muted" />
          <div className="h-10 w-12 rounded bg-muted" />
          <div className="h-4 w-36 rounded bg-muted/65" />
        </div>
        <div className="rounded-xl border border-border bg-card p-6 space-y-4">
          <div className="h-5 w-24 rounded bg-muted" />
          <div className="h-10 w-12 rounded bg-muted" />
          <div className="h-4 w-36 rounded bg-muted/65" />
        </div>
      </div>

      {/* Large body section skeleton */}
      <div className="rounded-xl border border-border bg-card p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="h-6 w-32 rounded bg-muted" />
          <div className="h-4 w-20 rounded bg-muted/65" />
        </div>
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-muted/65" />
          <div className="h-4 w-[95%] rounded bg-muted/65" />
          <div className="h-4 w-[90%] rounded bg-muted/65" />
          <div className="h-4 w-[85%] rounded bg-muted/65" />
          <div className="h-4 w-[60%] rounded bg-muted/65" />
        </div>
        <div className="flex justify-end pt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2Icon size={16} className="animate-spin text-primary" />
            <span>Memuat halaman...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
