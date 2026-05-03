import React from "react";
import { View, Text } from "react-native";
import DefaultComponentProps from "types/components";
import { useResumeData } from "app/context/ResumeContext";
import { useSettings } from "app/hooks/useSettings";

const NGOExperience: React.FC<DefaultComponentProps> = ({ className }) => {
  const settings = useSettings();
  const resumeData = useResumeData();
  const data = resumeData?.content?.[0]?.ngoExperienceSection;

  if (!data || data.disabled || !data.items || data.items.length === 0) return null;

  const ink = settings?.mainTextColor?.hex ?? "#000000";
  const accent = settings?.mainSectionPrimaryTextColor?.hex ?? "#571926";

  return (
    <View className={className}>
      <Text
        className="resume-section-title uppercase font-['Norwester'] text-xl mt-11 mb-1 tracking-wide"
        style={{
          color: settings?.mainSectionTextColor?.hex,
        }}
      >
        {data.label}
      </Text>
      {data.items.map((item, index) => {
        const y0 = item?.experienceDates?.startDate?.substring(0, 4) ?? "N/A";
        const y1 = item.experienceDates.presentDate
          ? "Present"
          : item.experienceDates.endDate?.substring(0, 4) ?? "N/A";
        const range = `${y0} – ${y1}`;
        const duties = item.duties?.filter(Boolean) ?? [];

        return (
          <View
            key={index}
            className={`resume-avoid-break bi-avoid font-['Lato'] w-full max-w-full ${index === 0 ? "mt-5" : "mt-6"}`}
          >
            {item.role ? (
              <Text
                className="font-['LatoBlack'] uppercase text-sm font-semibold leading-tight tracking-wide"
                style={{ color: ink }}
              >
                {item.role}
              </Text>
            ) : null}
            <View className="flex-row justify-between items-start gap-3 w-full mt-1">
              {item.company ? (
                <Text
                  className="flex-1 min-w-0 font-['Lato'] text-xs font-semibold uppercase leading-snug tracking-wide pr-1"
                  style={{ color: ink }}
                >
                  {item.company}
                </Text>
              ) : (
                <View className="flex-1 min-w-0" />
              )}
              <Text
                className="font-['Lato'] text-xs shrink-0 text-right leading-snug tabular-nums"
                style={{ color: accent }}
              >
                {range}
              </Text>
            </View>
            {duties.length > 0 ? (
              <View className="text-xs flex flex-col mt-2 gap-0.5">
                {duties.map((resp, respIndex) => (
                  <Text key={respIndex} className="font-['Lato'] leading-snug" style={{ color: ink }}>
                    – {resp}
                  </Text>
                ))}
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
};

export default NGOExperience;
