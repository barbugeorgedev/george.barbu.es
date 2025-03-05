import { ReactNode } from "react";
import ApolloProviderWrapper from "@components/ApolloProviderWrapper";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import GoogleAnalytics from "@components/GoogleAnalytics";
import { generateMetadata } from "@components/SEO";
import "@styles/globals.css";

export { generateMetadata };
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ApolloProviderWrapper>{children}</ApolloProviderWrapper>
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
