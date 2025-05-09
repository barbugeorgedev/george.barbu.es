"use client";
import Header from "app/components/Header";
import Footer from "app/components/Footer";
import { TemplateProps } from "types/components";
import { useSettings } from "app/hooks/useSettings";

export default function ClassicTemplate({ children }: TemplateProps) {
  const settings = useSettings();

  return (
    <main
      className="w-full first-letter:min-h-screen classicTemplate"
      style={{
        backgroundColor: settings?.mainBackground?.hex,
        color: settings?.mainTextColor?.hex,
      }}
    >
      <Header />
      {children}
      <Footer />
    </main>
  );
}
