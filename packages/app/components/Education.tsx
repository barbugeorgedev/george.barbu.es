import React from "react";
import { View, Text } from "react-native";
import { useResumeData } from "app/context/ResumeContext";
import DefaultComponentProps from "types/components";
import { useSettings } from "app/hooks/useSettings";

const Education: React.FC<DefaultComponentProps> = ({ className }) => {
  const settings = useSettings();
  const resumeData = useResumeData();
  const data = resumeData?.content?.[0]?.educationSection;

  if (!data || !data.items || data.items.length === 0) return null;

  return (
    <View className={className}>
      <View>
        <Text
          className="uppercase font-['Norwester'] text-xl mb-4"
          style={{
            color: settings?.mainSectionTextColor?.hex,
          }}
        >
          {data.label}
        </Text>
        {data.items.length === 0 ? (
          <Text>No education data available</Text>
        ) : (
          data.items.map((item, itemIndex) => (
            <View
              key={itemIndex}
              className="bi-avoid bb-always mt-4 font-['Lato']"
            >
              <Text
                className="font-['LatoBlack'] uppercase text-sm font-semibold"
                style={{
                  color: settings?.mainSectionSecondaryTextColor?.hex,
                }}
              >
                {item.institution}
              </Text>
              <View className="text-xs font-semibold mb-4 flex flex-row">
                <Text
                  className="border-r-2 border-solid mr-1 pr-1 font-['LatoBlack'] text-xs"
                  style={{
                    color: settings?.mainSectionPrimaryTextColor?.hex,
                    borderColor: settings?.mainSectionLineColor?.hex,
                  }}
                >
                  {item.degree}
                </Text>
                <Text
                  className="font-['LatoBlack'] text-xs"
                  style={{
                    color: settings?.mainSectionPrimaryTextColor?.hex,
                  }}
                >
                  {item.type}
                </Text>
              </View>
              <View className="text-xs flex flex-col">
                {item.certifications.map((cert, certIndex) => (
                  <Text key={certIndex}>- {cert}</Text>
                ))}
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
};

export default Education;
