import React from "react";
import { SafeAreaView, ScrollView } from "react-native";
import Header from "app/components/Header";
import Footer from "app/components/Footer";
import { TemplateProps } from "types/components";
import { useSettings } from "app/hooks/useSettings";

const DefaultTemplate: React.FC<TemplateProps> = ({ children, isATS = false }) => {
  const settings = useSettings();
  return (
    <SafeAreaView>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        className="w-full h-full  pt-8"
        style={{
          backgroundColor: isATS ? "#313638" : settings?.mainBackground?.hex,
        }}
      >
        <Header />
        {children}
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DefaultTemplate;
