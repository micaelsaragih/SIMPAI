"use client"

import { useEffect } from "react"
import { AlertOctagonIcon, RefreshCwIcon, HomeIcon } from "lucide-react"
import { buttonVariants, Button } from "@/components/ui/button"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to consoles/services
    console.error("Global application error boundary caught:", error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-destructive/20 rounded-full blur-2xl w-32 h-32 -z-10 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" />
        <div className="flex items-center justify-center w-24 h-24 rounded-2xl bg-card border border-border shadow-xl mx-auto text-destructive">
          <AlertOctagonIcon size={48} />
        </div>
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-3">
        Terjadi Kesalahan Sistem
      </h1>
      <p className="text-muted-foreground text-base max-w-md mx-auto mb-4">
        Kami mendeteksi anomali pada sistem yang menghalangi pemuatan halaman. Jangan khawatir, draf Anda tetap aman.
      </p>
      
      <div className="w-full max-w-lg mx-auto mb-8">
        <code className="block p-3 rounded-lg bg-muted text-xs font-mono overflow-auto border border-border/50 text-destructive text-left whitespace-pre-wrap">
          {error.toString()}
        </code>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={() => reset()} className="flex items-center gap-2">
          <RefreshCwIcon size={16} />
          Coba Lagi
        </Button>
        <Link href="/dashboard" className={buttonVariants({ variant: "outline" })}>
          <HomeIcon size={16} />
          Ke Dashboard
        </Link>
      </div>
    </div>
  )
}
