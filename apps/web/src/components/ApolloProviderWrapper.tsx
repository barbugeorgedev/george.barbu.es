"use client"; // This makes it a Client Component

import { ReactNode } from "react";
import { ApolloProvider } from "@apollo/client";
import client from "libs/graphql/apolloClient";

export default function ApolloProviderWrapper({
  children,
}: {
  children: ReactNode;
}) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
