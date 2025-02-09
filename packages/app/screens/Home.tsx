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

import { useResumeData } from "app/context/ResumeContext";

export const Home: React.FC = () => {
  const resumeData = useResumeData();

  return (
    <View className="printColor max-w-screen-pdf w-full relative mx-auto lg:flex lg:flex-row">
      <TopSide data={{ text: resumeData?.header[0] }} />
      <View className="bg-gray px-8 lg:w-2/5">
        <Sidebar
          className="pb-10 pt-10 print:pt-44 sm:pt-56"
          skills={resumeData?.sidebar[0].skillsSections}
          summary={resumeData?.sidebar[0].summarySection}
          contacts={resumeData?.sidebar[0].contactSection}
        />
      </View>

      <View className="printColor bg-white px-8 lg:w-3/5">
        <View className="py-10 print:pt-48 lg:pt-60 lg:mt-5">
          <Experience
            className="bi-avoid bb-always"
            data={resumeData.content[0].experienceSection}
          />
          <EarlyCareer
            className="bi-avoid bb-always"
            data={resumeData.content[0].earlyCareerExperienceSection}
          />
          <NGOExperience
            className="bi-avoid bb-always"
            data={resumeData.content[0].ngoExperienceSection}
          />
          <Education
            className="bi-avoid bb-always mt-28 mb-11"
            data={resumeData.content[0].educationSection}
          />
        </View>
      </View>
    </View>
  );
};

export default Home;
