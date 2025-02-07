// src/app/layout.tsx
"use client";

import { ReactNode } from 'react';
import { ApolloProvider } from '@apollo/client';
import client from 'libs/apolloClient';
import '@styles/globals.css'; // Import your global styles

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ApolloProvider client={client}>
          {children}
        </ApolloProvider>
      </body>
    </html>
  );
}
