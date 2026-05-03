/** How the ATS resume is rendered for this slug or URL path. */
export type AtsSlugMode = "none" | "default" | "v1" | "v2";

/**
 * Parse a Next `[slug]` segment (no leading slash), e.g. `ats`, `entain-ats-v1`.
 * Order: v2 → v1 → default (`…-ats` but not `…-ats-v2`, already excluded by v2 branch).
 */
export function parseAtsSlug(slug: string): { mode: AtsSlugMode; baseSlug: string } {
  const s = (slug || "").trim();
  if (!s || s === "/") return { mode: "none", baseSlug: "/" };

  if (s === "ats-v2" || s.endsWith("-ats-v2")) {
    return {
      mode: "v2",
      baseSlug: s === "ats-v2" ? "/" : s.replace(/-ats-v2$/, "") || "/",
    };
  }

  if (s === "ats-v1" || s.endsWith("-ats-v1")) {
    return {
      mode: "v1",
      baseSlug: s === "ats-v1" ? "/" : s.replace(/-ats-v1$/, "") || "/",
    };
  }

  if (s === "ats" || s.endsWith("-ats")) {
    return {
      mode: "default",
      baseSlug: s === "ats" ? "/" : s.replace(/-ats$/, "") || "/",
    };
  }

  return { mode: "none", baseSlug: s };
}

/** `window.location.pathname` → same as parseAtsSlug for first segment routes. */
export function parseAtsPathname(pathname: string): { mode: AtsSlugMode; baseSlug: string } {
  const p = (pathname || "/").replace(/\/+$/, "") || "/";
  if (p === "/") return { mode: "none", baseSlug: "/" };
  const first = p.replace(/^\/+/, "").split("/")[0] ?? "";
  return parseAtsSlug(first);
}
