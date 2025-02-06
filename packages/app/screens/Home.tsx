import React from "react";
import { View } from "react-native";
import Sidebar from "app/components/Sidebar";
import Experience, { ExperienceData } from "app/components/Experience";
import Education from "app/components/Education";

import TopSide from "app/components/TopSide";
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
      <TopSide data={{ text: resume.header }} />
      <View className="bg-gray px-8 lg:w-2/5">
        <Sidebar
          className="pb-10 pt-10 print:pt-44 sm:pt-56"
          skills={skillsData}
          summary={resume.summary}
          contacts={resume.contact}
        />
      </View>

      <View className="printColor bg-white px-8 lg:w-3/5">
        <View className="py-10 print:pt-48 lg:pt-60 lg:mt-5">
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
