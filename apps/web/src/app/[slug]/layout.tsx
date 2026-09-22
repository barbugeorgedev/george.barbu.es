import { ReactNode } from "react";
import { Metadata } from "next";
import { generateSlugMetadata } from "@components/SEO";
import JsonLd from "@components/JsonLd";

/**
 * Server component wrapper for the `[slug]` route. `page.tsx` is a client
 * component and so cannot export `generateMetadata`; without this every CV
 * variant inherited the homepage title and description.
 */
export async function generateMetadata({
  params,
}: {
  params: { slug: string | string[] };
}): Promise<Metadata> {
  const slug = Array.isArray(params.slug) ? params.slug.join("/") : params.slug;
  return generateSlugMetadata(slug ?? "/");
}

export default function SlugLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { slug: string | string[] };
}) {
  const slug = Array.isArray(params.slug) ? params.slug.join("/") : params.slug;
  return (
    <>
      <JsonLd slug={slug ?? "/"} />
      {children}
    </>
  );
}
