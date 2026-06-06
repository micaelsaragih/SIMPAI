import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://simpai.vercel.app"
  const now = new Date()

  const routes = ["", "/login", "/register", "/forgot-password"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: (route === "" ? "daily" : "monthly") as "daily" | "monthly",
    priority: route === "" ? 1.0 : 0.8,
  }))

  return routes
}
