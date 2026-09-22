import { ImageResponse } from "next/og";

export const alt = "George Barbu — Senior Frontend Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Edge runtime: the Node build of `@vercel/og` resolves its default font via
 * `fileURLToPath` and throws `Invalid URL` when prerendering on Windows.
 */
export const runtime = "edge";

const SANITY_URL = `https://${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v1/graphql/production/default`;

const FALLBACK = {
  fullname: "George Barbu",
  role: "Senior Frontend Engineer  |  React · Next.js · TypeScript",
  slogan: "Next.js migrations · Multi-brand platforms · Contract · EU Remote",
};

/** Theme colours mirror the resume `themeSettings` so the card matches the page. */
const COLORS = {
  background: "#313638",
  accent: "#7f2437",
  heading: "#FFFFFF",
  body: "#e5e5e5",
};

const FONTS = {
  regular: "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.ttf",
  bold: "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.ttf",
};

/**
 * Fonts are supplied explicitly: the default font bundled with `@vercel/og`
 * fails to parse under the edge runtime ("Offset is outside the bounds of the
 * DataView"), and the Node build cannot be prerendered on Windows at all.
 */
async function loadFont(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url, { next: { revalidate: 86400 } });
  if (!res.ok) throw new Error(`Font fetch failed: ${res.status}`);
  return res.arrayBuffer();
}

async function getHeader() {
  try {
    const res = await fetch(SANITY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query:
          "{ allResume(where: {homepage: {eq: true}}) { fullname role slogan } }",
      }),
      next: { revalidate: 3600 },
    });
    const json = await res.json();
    const header = json?.data?.allResume?.[0];
    return header?.fullname ? { ...FALLBACK, ...header } : FALLBACK;
  } catch {
    return FALLBACK;
  }
}

/**
 * Replaces the `/default-image.jpg` reference in the old metadata, which never
 * existed — every share of the site on LinkedIn, Slack or WhatsApp rendered a
 * blank card.
 */
export default async function Image() {
  const [{ fullname, role, slogan }, regular, bold] = await Promise.all([
    getHeader(),
    loadFont(FONTS.regular),
    loadFont(FONTS.bold),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: COLORS.background,
          padding: "80px 90px",
          fontFamily: "Inter",
        }}
      >
        <div
          style={{
            width: 90,
            height: 8,
            background: COLORS.accent,
            marginBottom: 44,
          }}
        />
        <div
          style={{
            fontSize: 82,
            fontWeight: 700,
            color: COLORS.heading,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
          }}
        >
          {fullname}
        </div>
        <div
          style={{
            fontSize: 38,
            color: COLORS.body,
            marginTop: 26,
            lineHeight: 1.25,
          }}
        >
          {role}
        </div>
        <div
          style={{
            fontSize: 27,
            color: COLORS.accent,
            marginTop: 30,
            lineHeight: 1.35,
          }}
        >
          {slogan}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "auto",
            fontSize: 24,
            color: COLORS.body,
            opacity: 0.75,
          }}
        >
          george.barbu.es · george@barbu.es
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: regular, weight: 400, style: "normal" },
        { name: "Inter", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
