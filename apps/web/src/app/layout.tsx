"use client";

import { ReactNode } from "react";
import { ApolloProvider } from "@apollo/client";
import client from "libs/graphql/apolloClient";
import "@styles/globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
      </body>
    </html>
  );
}
