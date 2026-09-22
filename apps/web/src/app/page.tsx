import JsonLd from "@components/JsonLd";
import Page from "./[slug]/page";

/**
 * Server component so the homepage can emit structured data. `Page` stays a
 * client component and renders unchanged; `/` does not pass through
 * `[slug]/layout.tsx`, so the JSON-LD has to be attached here.
 */
export default function HomePage() {
  return (
    <>
      <JsonLd />
      <Page />
    </>
  );
}
