import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClientProviders } from "@/providers/ClientProviders"
import type { Viewport } from "next"
import { enforceEnv } from "@/lib/env-validator"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: {
    default: "SIMPAI — Sistem Pembimbing Artikel Ilmiah",
    template: "%s | SIMPAI"
  },
  description: "Asisten cerdas penulisan artikel ilmiah akademik berbasis AI. Evaluasi kelengkapan struktur, kesesuaian template jurnal, dan kualitas tata bahasa akademik (KBBI/PUEBI) secara real-time.",
  applicationName: "SIMPAI",
  keywords: [
    "SIMPAI",
    "pembimbing artikel ilmiah",
    "asisten penulisan ilmiah",
    "evaluasi draf jurnal",
    "analisis struktur karya ilmiah",
    "pemeriksa KBBI PUEBI",
    "template jurnal",
    "AI penulisan akademik"
  ],
  authors: [{ name: "SIMPAI Team" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://simpai.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SIMPAI — Asisten Cerdas Penulisan Artikel Ilmiah",
    description: "Evaluasi kelengkapan struktur, kesesuaian template jurnal, dan kualitas tata bahasa akademik (KBBI/PUEBI) secara real-time berbasis AI.",
    url: "https://simpai.vercel.app",
    siteName: "SIMPAI",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SIMPAI — Asisten Cerdas Penulisan Artikel Ilmiah",
    description: "Evaluasi kelengkapan struktur, kesesuaian template jurnal, dan kualitas tata bahasa akademik secara real-time berbasis AI.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

// Validate environment variables on startup
enforceEnv()

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <ClientProviders attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}
