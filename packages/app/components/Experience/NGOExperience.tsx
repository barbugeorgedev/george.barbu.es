import React from "react";
import { View, Text } from "react-native";
import DefaultComponentProps from "types/components";
import { useResumeData } from "app/context/ResumeContext";
import { useSettings } from "app/hooks/useSettings";

const NGOExperience: React.FC<DefaultComponentProps> = ({ className }) => {
  const settings = useSettings();
  const resumeData = useResumeData();
  const data = resumeData?.content?.[0]?.ngoExperienceSection;

  if (!data || !data.items || data.items.length === 0) return null;

  return (
    <View className={className}>
      <Text
        className="uppercase font-['Norwester'] text-xl mt-11"
        style={{
          color: settings?.mainSectionTextColor,
        }}
      >
        {data.label}
      </Text>
      {data.items.map((item, index) => (
        <View key={index} className="bi-avoid bb-always mt-4 font-['Lato']">
          <Text
            className="font-['LatoBlack'] uppercase text-sm font-semibold"
            style={{
              color: settings?.mainSectionSecondaryTextColor,
            }}
          >
            {item.company}
          </Text>
          <View className="text-xs font-semibold mb-4">
            <Text
              className="font-['LatoBlack'] text-xs"
              style={{
                color: settings?.mainSectionPrimaryTextColor,
              }}
            >
              {item?.experienceDates?.startDate?.substring(0, 4) ?? "N/A"}-
              {item.experienceDates.presentDate
                ? " Present"
                : ` ${item.experienceDates.endDate?.substring(0, 4)}`}
            </Text>
          </View>
          <Text
            className="font-['LatoBlack'] uppercase text-sm font-semibold"
            style={{
              color: settings?.mainSectionSecondaryTextColor,
            }}
          >
            {item.role}
          </Text>
          <View className="text-xs flex flex-col">
            {item.duties.map((resp, respIndex) => (
              <Text key={respIndex}>- {resp}</Text>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
};

export default NGOExperience;
