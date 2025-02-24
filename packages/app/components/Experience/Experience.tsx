import React from "react";
import { View, Text } from "react-native";
import DefaultComponentProps, { ExperienceItem } from "types/components";
import { useResumeData } from "app/context/ResumeContext";
import { useSettings } from "app/hooks/useSettings";

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
        className="uppercase font-['Norwester'] text-xl "
        style={{
          color: settings?.mainSectionTextColor,
        }}
      >
        {data.label}
      </Text>

      {Object.keys(groups).map((company, index) => (
        <View key={index}>
          {groups[company] && groups[company].length > 0 && (
            <View
              key={index}
              className="bi-avoid bb-always font-['Lato'] mt-11"
            >
              <Text
                className="font-['LatoBlack'] uppercase text-sm font-semibold"
                style={{
                  color: settings?.mainSectionSecondaryTextColor,
                }}
              >
                {company}
              </Text>
              <View className="text-xs font-semibold mb-4">
                <Text
                  className="font-['LatoBlack'] text-xs"
                  style={{
                    color: settings?.mainSectionPrimaryTextColor,
                  }}
                >
                  {groups[company][
                    groups[company].length - 1
                  ]?.experienceDates?.startDate?.substring(0, 4) || "N/A"}
                  &nbsp; - &nbsp;
                  {groups[company][0]?.experienceDates?.presentDate
                    ? "Present"
                    : groups[company][0]?.experienceDates?.endDate?.substring(
                        0,
                        4,
                      ) || "N/A"}
                </Text>
              </View>
              <View
                className="relative border-l border-solid"
                style={{
                  borderColor: settings?.mainSectionLineColor,
                }}
              >
                {groups[company].map((item, index) => (
                  <View
                    key={index}
                    className={
                      "bi-avoid bb-always font-['Lato'] ml-4 " +
                      (index !== 0 ? "mt-11" : "mt-4")
                    }
                  >
                    <View
                      className="absolute w-3 h-3 rounded-full mt-1.5 -left-6 ml-0.5 border"
                      style={{
                        borderColor: settings?.mainSectionLineColor,
                        backgroundColor: settings?.mainSectionDotColor,
                      }}
                    ></View>
                    <Text
                      className="font-['LatoBlack'] uppercase text-sm font-semibold"
                      style={{
                        color: settings?.mainSectionSecondaryTextColor,
                      }}
                    >
                      {item.role}
                    </Text>
                    <View className="text-xs font-semibold mb-4">
                      <Text
                        className="font-['LatoBlack'] text-xs"
                        style={{
                          color: settings?.mainSectionPrimaryTextColor,
                        }}
                      >
                        {item.experienceDates?.startDate?.substring(0, 4) ||
                          "N/A"}
                        &nbsp; - &nbsp;
                        {item.experienceDates?.presentDate
                          ? "Present"
                          : item.experienceDates?.endDate?.substring(0, 4) ||
                            "N/A"}
                      </Text>
                    </View>
                    <Text className="text-xs flex flex-col">
                      {item.duties.map((duty, index) => (
                        <Text key={index}>- {duty}</Text>
                      ))}
                    </Text>
                    <Text className="text-xs flex flex-row mt-2 opacity-70">
                      {item.skills && item.skills.length > 0
                        ? item.skills.map((skill, index) => (
                            <Text
                              className="mr-1 border opacity-90 rounded-md p-1"
                              key={index}
                            >
                              {skill.title}
                            </Text>
                          ))
                        : null}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

export default Experience;
