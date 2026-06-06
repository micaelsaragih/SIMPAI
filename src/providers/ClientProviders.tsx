"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Dynamically import Toaster with SSR disabled to prevent portal-based
// hydration mismatch (insertBefore crash). Sonner renders via DOM portals
// which don't exist in the server-rendered HTML tree.
const Toaster = dynamic(
  () => import("@/components/ui/sonner").then((mod) => mod.Toaster),
  { ssr: false }
)

/**
 * Consolidated client-side providers for the application.
 * Wraps ThemeProvider + lazy-loaded Toaster in a single "use client" boundary.
 * This prevents the Sonner portal from causing SSR/hydration mismatches.
 */
export function ClientProviders({
  children,
  ...themeProps
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...themeProps}>
      {children}
      <Toaster />
    </NextThemesProvider>
  )
}
