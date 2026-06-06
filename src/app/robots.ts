import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://simpai.vercel.app"

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/login", "/register", "/forgot-password"],
      disallow: [
        "/dashboard",
        "/profile",
        "/settings",
        "/analysis",
        "/templates",
        "/api/",
        "/auth/callback",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
