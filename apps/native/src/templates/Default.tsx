import React from "react";
import { SafeAreaView, ScrollView } from "react-native";
import Header from "app/components/Header";
import Footer from "app/components/Footer";
import { useResumeData } from "app/context/ResumeContext";
import { DefaultTemplateProps } from "types/components";

const DefaultTemplate: React.FC<DefaultTemplateProps> = ({ children }) => {
  const resumeData = useResumeData();

  // Check if `footer` has the correct structure and extract `social`
  const socialLinks = Array.isArray(resumeData?.footer)
    ? resumeData?.footer[0]?.social || []
    : [];

  return (
    <SafeAreaView>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        className="w-full h-full text-gray bg-[#525659] pt-8"
      >
        <Header />
        {children}
        <Footer social={socialLinks} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DefaultTemplate;
