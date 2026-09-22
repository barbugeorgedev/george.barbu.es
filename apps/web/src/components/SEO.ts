import { Metadata } from "next";
import client from "libs/graphql/apolloClient";
import { GET_RESUME } from "libs/graphql/queries/resume";
import { parseAtsSlug } from "app/utils/atsRoutes";

/** Canonical site origin for Open Graph / Twitter image URLs (relative paths resolve against this). */
function metadataBase(): URL {
  const fromEnv = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (fromEnv) {
    try {
      return new URL(fromEnv.endsWith("/") ? fromEnv.slice(0, -1) : fromEnv);
    } catch {
      /* ignore */
    }
  }
  if (process.env.VERCEL_URL) {
    return new URL(`https://${process.env.VERCEL_URL}`);
  }
  return new URL("http://localhost:3000");
}

type SeoSection = {
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string[] | null;
  seoImage?: { asset?: { url?: string | null } | null } | null;
};

const FALLBACK_TITLE = "George Barbu - Senior Frontend Engineer";

/**
 * `allResume(where: …)` always returns a list, so every field here lives at
 * `[0]`. Reading `data.seo.seoSection` (no index) silently resolved to
 * `undefined` and every page fell back to the hardcoded title with no
 * description - none of the Sanity SEO content ever reached the document head.
 */
async function fetchSeo(
  filter: Record<string, unknown>,
): Promise<{ seo?: SeoSection; role?: string; fullname?: string } | null> {
  try {
    const { data } = await client.query({
      query: GET_RESUME,
      variables: { filter },
      fetchPolicy: "no-cache",
    });
    const seo = data?.seo?.[0]?.seoSection as SeoSection | undefined;
    const header = data?.header?.[0] as
      | { role?: string; fullname?: string }
      | undefined;
    if (!seo && !header) return null;
    return { seo, role: header?.role, fullname: header?.fullname };
  } catch {
    return null;
  }
}

function toMetadata(
  result: { seo?: SeoSection; role?: string; fullname?: string } | null,
  canonicalPath: string,
): Metadata {
  const seo = result?.seo;
  const title =
    seo?.seoTitle ||
    (result?.fullname && result?.role
      ? `${result.fullname} - ${result.role}`
      : FALLBACK_TITLE);
  const description = seo?.seoDescription || undefined;
  const imageUrl = seo?.seoImage?.asset?.url || undefined;

  return {
    metadataBase: metadataBase(),
    title,
    description,
    keywords: seo?.seoKeywords?.length ? seo.seoKeywords : undefined,
    alternates: { canonical: canonicalPath },
    icons: { icon: "/favicon.ico" },
    openGraph: {
      title,
      description,
      url: canonicalPath,
      type: "profile",
      siteName: "George Barbu",
      // Omitted when Sanity has no image so the generated `opengraph-image`
      // route supplies one - the old `/default-image.jpg` fallback did not exist
      // and every shared link rendered a blank card.
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}

/** Root layout: metadata for the homepage resume. */
export async function generateMetadata(): Promise<Metadata> {
  const result = await fetchSeo({ homepage: { eq: true } });
  return toMetadata(result, "/");
}

/**
 * `[slug]` layout: metadata for one CV variant. The page itself is a client
 * component and cannot export `generateMetadata`, so it is exported from the
 * sibling layout instead - otherwise every variant inherits the homepage title.
 */
export async function generateSlugMetadata(slug: string): Promise<Metadata> {
  const { baseSlug } = parseAtsSlug(slug);
  const filter =
    baseSlug === "/"
      ? { homepage: { eq: true } }
      : { slug: { current: { eq: baseSlug } } };

  const result = await fetchSeo(filter);
  return toMetadata(result, `/${slug}`);
}
