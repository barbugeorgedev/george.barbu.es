"use client";
import Header from "app/components/Header";
import Footer from "app/components/Footer";
import { TemplateProps } from "types/components";
import { useSettings } from "app/hooks/useSettings";

export default function DefaultTemplate({ children }: TemplateProps) {
  const settings = useSettings();

  return (
    <main
      className="w-full first-letter:min-h-screen defaultTemplate"
      style={{
        backgroundColor: settings?.mainBackground,
        color: settings?.mainTextColor,
      }}
    >
      <Header />
      {children}
      <Footer />
    </main>
  );
}
