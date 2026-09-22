import { MetadataRoute } from "next";

const SANITY_URL = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v1/graphql/production/default`;

function origin(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  return "https://george.barbu.es";
}

/**
 * Previously `/sitemap.xml` was swallowed by the `[slug]` catch-all and served
 * the SPA shell with a 200. A real route here takes precedence over the dynamic
 * segment.
 *
 * Only canonical CV pages are listed — the `-ats`/`-ats-v1`/`-ats-v2` variants
 * are the same content reformatted for applicant tracking systems and would be
 * duplicates.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = origin();
  const now = new Date();

  let slugs: string[] = [];
  try {
    const res = await fetch(SANITY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query:
          "{ allResume { homepage slug { current } } }",
      }),
      next: { revalidate: 3600 },
    });
    const json = await res.json();
    slugs = (json?.data?.allResume ?? [])
      .filter((r: any) => !r?.homepage && r?.slug?.current)
      .map((r: any) => r.slug.current as string);
  } catch {
    /* fall through to the homepage-only sitemap */
  }

  return [
    { url: base, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...slugs.map((slug) => ({
      url: `${base}/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
