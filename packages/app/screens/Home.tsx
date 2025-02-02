import React from "react";
import { View } from "react-native";

import Header from "app/components/Header";
import Sidebar from "app/components/Sidebar";
import Experience, { ExperienceData } from "app/components/Experience";
import Education from "app/components/Education";

import TopHeader from "app/components/TopHeader";
import { resume } from "data";

const normalizedExperienceData: ExperienceData[] = resume.experience.map(
  (exp) => ({
    label: exp.label,
    items: exp.items.map((item) => ({
      company: item.company,
      role: item.role,
      startDate: item.startDate,
      endDate: item.endDate,
      presentDate: item.presentDate === "Yes" ? "Yes" : "No", // Ensure "Yes" or "No"
      duties: item.duties.map((duty) => ({ duty: duty.duty })),
    })),
  }),
);

export const Home: React.FC = () => {
  const skillsData = resume.skills.map((skill) => ({
    ...skill,
    type: skill.type as "tag" | "list",
  }));

  return (
    <View className="printColor max-w-screen-pdf w-full relative mx-auto lg:flex lg:flex-row">
      <TopHeader data={{ text: resume.header }} />
      <View className="bg-gray px-8 lg:w-2/5">
        <Sidebar
          className="pb-10 pt-10 print:pt-56 sm:pt-56"
          skills={skillsData}
          summary={resume.summary}
          contacts={resume.contact}
        />
      </View>

      <View className="printColor bg-white px-8 lg:w-3/5">
        <View className="py-10 lg:pt-56 lg:mt-5">
          <Experience
            className="bi-avoid bb-always"
            data={normalizedExperienceData}
          />
          <Education
            className="bi-avoid bb-always mt-28 mb-11"
            data={resume.education}
          />
        </View>
      </View>
    </View>
  );
};

export default Home;
