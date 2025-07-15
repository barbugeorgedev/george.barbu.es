import React from "react";
import { View, Text } from "react-native";
import DefaultComponentProps, { ExperienceItem } from "types/components";
import { useResumeData } from "app/context/ResumeContext";
import { useSettings } from "app/hooks/useSettings";
import CompanyExperienceBlock from 'app/components/Blocks/CompanyExperienceBlock';

const Experience: React.FC<DefaultComponentProps> = ({ className }) => {
  const settings = useSettings();
  const resumeData = useResumeData();
  const data = resumeData?.content?.[0]?.experienceSection;

  if (!data || !data.items || data.items.length === 0) return null;

  // Normalize `presentDate`
  const normalizedData = data.items.map((item) => ({
    ...item,
    presentDate: item.experienceDates.presentDate ? "Yes" : "No",
  }));

  // Group by company
  const groups = normalizedData.reduce<Record<string, ExperienceItem[]>>(
    (acc, item) => {
      if (!item.company) return acc;
      (acc[item.company] = acc[item.company] || []).push(item);
      return acc;
    },
    {},
  );

  return (
    <View className={className}>
      <Text
        className="uppercase font-['Norwester'] text-xl mb-4"
        style={{
          color: settings?.mainSectionTextColor?.hex,
        }}
      >
        {data.label}
      </Text>

      {Object.keys(groups).map((company, index) => {
        const companyExperiences = groups[company] || [];
        return (
          <CompanyExperienceBlock
            key={index}
            company={company}
            items={companyExperiences}
            settings={settings}
          />
        );
      })}
    </View>
  );
};

export default Experience;
