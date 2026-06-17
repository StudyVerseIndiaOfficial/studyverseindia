import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
 const siteUrl = "https://studyverseindia.vercel.app";

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