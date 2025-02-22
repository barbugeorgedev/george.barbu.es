"use client";

import { ReactNode } from "react";
import { ApolloProvider } from "@apollo/client";
import client from "libs/graphql/apolloClient";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import GoogleAnalytics from "@components/GoogleAnalytics";
import "@styles/globals.css";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>George Barbu CV</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <ApolloProvider client={client}>{children}</ApolloProvider>
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
