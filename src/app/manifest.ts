import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SIMPAI — Sistem Pembimbing Artikel Ilmiah",
    short_name: "SIMPAI",
    description: "Asisten Cerdas Penulisan Artikel Ilmiah Akademik",
    start_url: "/",
    display: "standalone",
    background_color: "#f9fafb",
    theme_color: "#10b981",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
