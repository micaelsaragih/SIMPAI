"use client"

import Link from "next/link"
import { FileQuestionIcon, HomeIcon, ArrowLeftIcon } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl w-32 h-32 -z-10 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" />
        <div className="flex items-center justify-center w-24 h-24 rounded-2xl bg-card border border-border shadow-xl mx-auto text-primary">
          <FileQuestionIcon size={48} className="animate-pulse" />
        </div>
      </div>
      
      <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-3">
        Halaman Tidak Ditemukan
      </h1>
      <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">
        Maaf, naskah atau halaman yang Anda cari tidak ada di perpustakaan kami. Silakan kembali ke Dashboard.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button 
          onClick={() => window.history.back()} 
          className={buttonVariants({ variant: "outline", className: "flex items-center gap-2 cursor-pointer" })}
        >
          <ArrowLeftIcon size={16} />
          Kembali
        </button>
        <Link 
          href="/dashboard" 
          className={buttonVariants({ variant: "default", className: "flex items-center gap-2" })}
        >
          <HomeIcon size={16} />
          Ke Dashboard
        </Link>
      </div>
    </div>
  )
}
