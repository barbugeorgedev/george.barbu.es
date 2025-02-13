import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "app/components/Header";
import Footer from "app/components/Footer";
import { useResumeData } from "app/context/ResumeContext";
import { DefaultTemplateProps } from "types/components";

const DefaultTemplate: React.FC<DefaultTemplateProps> = ({ children }) => {
  const resumeData = useResumeData();

  const socialLinks = Array.isArray(resumeData?.footer)
    ? resumeData?.footer[0]?.social || []
    : [];

  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        className="flex-1 w-full text-gray bg-[#525659] pt-8"
      >
        <Header />
        {children}
        <Footer social={socialLinks} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DefaultTemplate;