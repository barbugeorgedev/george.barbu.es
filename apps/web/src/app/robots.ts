import { MetadataRoute } from "next";

function origin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  return "https://george.barbu.es";
}

/**
 * `/robots.txt` used to fall through to the `[slug]` catch-all and return the
 * SPA shell as `text/html` with a 200.
 *
 * The ATS routes are excluded: they render the same CV in a stripped-down
 * layout for applicant tracking systems, so indexing them creates duplicates
 * competing with the canonical pages.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/*-ats$", "/*-ats-v1$", "/*-ats-v2$", "/ats"],
      },
    ],
    sitemap: `${origin()}/sitemap.xml`,
    host: origin(),
  };
}
