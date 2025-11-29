"use client";
import Header from "app/components/Header";
import Footer from "app/components/Footer";
import { TemplateProps } from "types/components";
import { useSettings } from "app/hooks/useSettings";

export default function ModernTemplate({ children, isATS = false }: TemplateProps) {
  const settings = useSettings();

  return (
    <main
      className="w-full first-letter:min-h-screen modernTemplate"
      style={{
        backgroundColor: isATS ? "#313638" : settings?.mainBackground?.hex,
        color: settings?.mainTextColor?.hex,
      }}
    >
      <Header />
      {children}
      <Footer />
    </main>
  );
}
