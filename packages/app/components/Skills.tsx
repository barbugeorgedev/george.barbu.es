import React from "react";
import { View, Text } from "react-native";
import { useResumeData } from "app/context/ResumeContext";
import { useSettings } from "app/hooks/useSettings";

const Skills: React.FC = ({}) => {
  const settings = useSettings();
  const resumeData = useResumeData();
  const data = resumeData?.sidebar?.[0]?.skillsSections || [];

  return (
    <View>
      {data.map((skill, index) => (
        <View
          key={`skill-${index}`}
          className="mt-10 text-[0.85rem] font-['Lato'] leading-6"
        >
          <Text
            className="uppercase font-['Norwester'] text-xl mb-4"
            style={{
              color: settings?.sidebarSectionTextColor,
            }}
          >
            {skill.label}
          </Text>
          <View className="flex flex-row">
            {skill.items?.map(
              (subskill: { title: string }, subIndex: number) => (
                <Text key={subskill.title} className="mx-1">
                  <Text
                    className="text-[0.70rem] font-['Lato'] leading-3"
                    style={{
                      color: settings?.sidebarTextColor,
                    }}
                  >
                    {subskill.title}
                    {subIndex !== (skill.items?.length ?? 0) - 1 ? "," : ""}
                  </Text>
                </Text>
              ),
            )}
          </View>
        </View>
      ))}
    </View>
  );
};

export default Skills;
