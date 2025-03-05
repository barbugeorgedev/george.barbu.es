import React from "react";
import { View, Text } from "react-native";
import DefaultComponentProps from "types/components";
import { useResumeData } from "app/context/ResumeContext";
import { useSettings } from "app/hooks/useSettings";

const EarlyCareer: React.FC<DefaultComponentProps> = ({ className }) => {
  const settings = useSettings();
  const resumeData = useResumeData();
  const data = resumeData?.content?.[0]?.earlyCareerExperienceSection;

  if (!data || !data.items || data.items.length === 0) return null;

  return (
    <View className={className}>
      <View>
        <Text
          className="uppercase font-['Norwester'] text-xl mt-20 mb-6"
          style={{
            color: settings?.mainSectionTextColor?.hex,
          }}
        >
          {data.label}
        </Text>
        {data.items.map((item, itemIndex) => (
          <View
            key={itemIndex}
            className="bi-avoid bb-always mt-4 font-['Lato']"
          >
            <View className="flex flex-row flex-wrap items-baseline space-x-2">
              <Text
                className="font-['LatoBlack'] uppercase text-sm font-semibold"
                style={{
                  color: settings?.mainSectionSecondaryTextColor?.hex,
                }}
              >
                {item.role},
              </Text>
              <Text
                className="font-['Lato'] uppercase text-sm"
                style={{
                  color: settings?.mainSectionSecondaryTextColor?.hex,
                }}
              >
                {item.company}
              </Text>
              <Text
                className="font-['Lato'] text-sm"
                style={{
                  color: settings?.mainSectionPrimaryTextColor?.hex,
                }}
              >
                ({item.experienceDates.startDate?.substring(0, 4) ?? "N/A"}
                &nbsp;-&nbsp;
                {item.experienceDates.presentDate
                  ? "Present"
                  : (item.experienceDates.endDate?.substring(0, 4) ?? "N/A")}
                )
              </Text>
              <Text key={0} className="text-sm">
                - {item.duties[0]}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default EarlyCareer;
