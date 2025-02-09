"use client";
import Header from "app/components/Header";
import Footer from "app/components/Footer";
import { useResumeData } from "app/context/ResumeContext";

import { DefaultTemplateProps } from "types/components";

export default function DefaultTemplate({ children }: DefaultTemplateProps) {
  const resumeData = useResumeData();

  // Check if `footer` has the correct structure and extract `social`
  const socialLinks = Array.isArray(resumeData?.footer)
    ? resumeData?.footer[0]?.social || []
    : [];
  return (
    <main className="w-full text-gray bg-[#525659] first-letter:min-h-screen">
      <Header />
      {children}
      <Footer social={socialLinks} />
    </main>
  );
}
