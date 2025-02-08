"use client";
import { ReactNode } from "react";
import Header from "app/components/Header";
import Footer from "app/components/Footer";
import { resume } from "data";

import { DefaultTemplateProps } from "types/components";

export default function DefaultTemplate({ children }: DefaultTemplateProps) {
  return (
    <main className="w-full text-gray bg-[#525659] first-letter:min-h-screen">
      <Header />
      {children}
      <Footer social={resume.social} />
    </main>
  );
}
