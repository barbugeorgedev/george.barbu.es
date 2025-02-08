import React from "react";
import { SafeAreaView, ScrollView } from "react-native";
import Header from "app/components/Header";
import Footer from "app/components/Footer";
import { resume } from "data";

import { DefaultTemplateProps } from "types/components";

const DefaultTemplate: React.FC<DefaultTemplateProps> = ({ children }) => {
  return (
    <SafeAreaView className="flex">
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        className="w-full text-gray bg-[#525659] pt-8"
      >
        <Header />
        {children}
        <Footer social={resume.social} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DefaultTemplate;
