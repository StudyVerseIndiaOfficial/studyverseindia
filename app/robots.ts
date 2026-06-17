import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/notifications",
          "/latest-info",
          "/government-news",
          "/videos",
          "/notes",
          "/links",
          "/tests",
        ],
        disallow: [
          "/admin",
          "/admin-dashboard",
          "/admin-dashboard/tests",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}