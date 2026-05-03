import React from "react";
import { View, Text } from "react-native";
import { useResumeData } from "app/context/ResumeContext";
import DefaultComponentProps from "types/components";
import { useSettings } from "app/hooks/useSettings";

const Education: React.FC<DefaultComponentProps> = ({ className }) => {
  const settings = useSettings();
  const resumeData = useResumeData();
  const data = resumeData?.content?.[0]?.educationSection;

  if (!data || data.disabled || !data.items || data.items.length === 0) return null;

  const ink = settings?.mainTextColor?.hex ?? "#000000";
  const accent = settings?.mainSectionPrimaryTextColor?.hex ?? "#571926";

  return (
    <View className={className}>
      <View>
        <Text
          className="resume-section-title uppercase font-['Norwester'] text-xl mb-1 tracking-wide"
          style={{
            color: settings?.mainSectionTextColor?.hex,
          }}
        >
          {data.label}
        </Text>
        {data.items.map((item, itemIndex) => {
          const studyLine = [item.degree, item.type]
            .filter((p) => p?.trim())
            .join(" | ")
            .replace(/\s+\|\s*$/, "")
            .trim();
          const certs = (item.certifications ?? []).filter((c) => c?.trim());

          return (
            <View
              key={itemIndex}
              className={`resume-avoid-break bi-avoid font-['Lato'] w-full max-w-full ${itemIndex === 0 ? "mt-4" : "mt-6"}`}
            >
              {item.institution ? (
                <Text
                  className="font-['LatoBlack'] uppercase text-sm font-semibold leading-tight tracking-wide"
                  style={{ color: ink }}
                >
                  {item.institution}
                </Text>
              ) : null}
              {studyLine ? (
                <Text
                  className="font-['Lato'] text-xs mt-1 leading-snug"
                  style={{ color: accent }}
                >
                  {studyLine}
                </Text>
              ) : null}
              {certs.length > 0 ? (
                <View className="text-xs flex flex-col mt-2 gap-0.5">
                  {certs.map((cert, certIndex) => (
                    <Text
                      key={certIndex}
                      className="font-['Lato'] leading-snug"
                      style={{ color: ink }}
                    >
                      – {cert}
                    </Text>
                  ))}
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default Education;
