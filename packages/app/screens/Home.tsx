import React from "react";
import { View } from "react-native";
import Sidebar from "app/components/Sidebar";
import {
  Experience,
  EarlyCareer,
  NGOExperience,
} from "app/components/Experience";
import Education from "app/components/Education";
import TopSide from "app/components/TopSide";
import { useSettings } from "app/hooks/useSettings";

export const Home: React.FC = () => {
  const settings = useSettings();

  return (
    <View className="printColor max-w-screen-pdf w-full relative mx-auto lg:flex lg:flex-row">
      <TopSide />

      <View
        className="px-8 lg:w-2/5"
        style={{
          backgroundColor: settings?.sidebarBackground,
        }}
      >
        <Sidebar className="pb-10 pt-10 print:pt-44 sm:pt-56" />
      </View>

      <View
        className="printColor px-8 lg:w-3/5"
        style={{
          backgroundColor: settings?.mainSectionBackground,
        }}
      >
        <View className="py-10 print:pt-48 lg:pt-60 lg:mt-5">
          <Experience className="bi-avoid bb-always" />

          <EarlyCareer className="bi-avoid bb-always" />
          <NGOExperience className="bi-avoid bb-always" />

          <Education className="bi-avoid bb-always mt-11 " />
        </View>
      </View>
    </View>
  );
};

export default Home;
