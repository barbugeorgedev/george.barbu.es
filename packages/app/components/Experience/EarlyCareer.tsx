import React from "react";
import { View, Text } from "react-native";
import DefaultComponentProps, { ExperienceItem } from "types/components";
import { useResumeData } from "app/context/ResumeContext";
import { useSettings } from "app/hooks/useSettings";
import CompanyExperienceBlock from "app/components/Blocks/CompanyExperienceBlock";

const EarlyCareer: React.FC<DefaultComponentProps> = ({ className }) => {
  const settings = useSettings();
  const resumeData = useResumeData();
  const data = resumeData?.content?.[0]?.earlyCareerExperienceSection;

  if (!data || data.disabled || !data.items || data.items.length === 0) return null;

  const groups = data.items.reduce<Record<string, ExperienceItem[]>>((acc, item, idx) => {
    const key = item.company?.trim() || `__orphan_${idx}`;
    (acc[key] = acc[key] || []).push(item as ExperienceItem);
    return acc;
  }, {});

  return (
    <View className={className ?? ""}>
      <View>
        <Text
          className="resume-section-title uppercase font-['Norwester'] text-xl mt-10 mb-6"
          style={{
            color: settings?.mainSectionTextColor?.hex,
          }}
        >
          {data.label}
        </Text>
        {Object.entries(groups).map(([key, items]) => (
          <CompanyExperienceBlock
            key={key}
            company={key.startsWith("__orphan_") ? "" : key}
            items={items}
            settings={settings}
            singleDutyBullet
          />
        ))}
      </View>
    </View>
  );
};

export default EarlyCareer;
