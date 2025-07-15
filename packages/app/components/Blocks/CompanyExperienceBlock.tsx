import React from "react";
import { View, Text } from "react-native";
import { ExperienceItem } from "types/components";

interface CompanyExperienceBlockProps {
  company: string;
  items: ExperienceItem[];
  settings: any;
}

// DutiesAndSkills: Shared subcomponent for rendering duties and skills for an experience item
const DutiesAndSkills: React.FC<{ item: ExperienceItem }> = ({ item }) => (
  <>
    <View className="mb-2">
      {item.duties && item.duties.map((duty, dutyIdx) => (
        <Text key={dutyIdx} className="text-xs mb-1">- {duty}</Text>
      ))}
    </View>
    <View className="flex flex-row flex-wrap mt-1">
      {item.skills && item.skills.length > 0
        ? item.skills.map((skill, skillIdx) => (
            <Text
              className="mr-2 mb-1 border opacity-90 rounded-md p-1 text-xs"
              key={skillIdx}
            >
              {skill.title}
            </Text>
          ))
        : null}
    </View>
  </>
);

/**
 * CompanyExperienceBlock
 * Renders either a single experience (stacked format) or multiple experiences (timeline format) for a company.
 * - If items.length === 1: stacked format (title, company, years, duties, skills)
 * - If items.length > 1: timeline format (company, years, vertical line, each role as timeline entry)
 */
const CompanyExperienceBlock: React.FC<CompanyExperienceBlockProps> = ({ company, items, settings }) => {
  if (!items || items.length === 0) return null;

  // --- Single Experience Layout ---
  if (items.length === 1) {
    const item = items[0];
    if (!item) return null;
    return (
      <View className="mb-10">
        {/* Single experience: title, company, years */}
        <Text
          className="font-['LatoBlack'] uppercase text-sm font-semibold"
          style={{ color: settings?.mainSectionSecondaryTextColor?.hex }}
        >
          {item.role}
        </Text>

        <Text
          className="font-['LatoBlack'] text-xs mb-2"
          style={{ color: settings?.mainSectionPrimaryTextColor?.hex }}
        >
          {company} | {item.experienceDates?.startDate?.substring(0, 4) || "N/A"} - {item.experienceDates?.presentDate ? "Present" : item.experienceDates?.endDate?.substring(0, 4) || "N/A"}
        </Text>
        {/* Duties and skills for single experience */}
        <DutiesAndSkills item={item} />
      </View>
    );
  }

  // --- Multiple Experiences Timeline Layout ---
  const startYear = items[items.length - 1]?.experienceDates?.startDate?.substring(0, 4) || "N/A";
  const endYear = items[0]?.experienceDates?.presentDate
    ? "Present"
    : items[0]?.experienceDates?.endDate?.substring(0, 4) || "N/A";
  return (
    <View className="mb-10">
      {/* Multiple experiences: company and years at top, then timeline */}
      <Text
        className="font-['LatoBlack'] uppercase text-sm font-semibold"
        style={{ color: settings?.mainSectionSecondaryTextColor?.hex }}
      >
        {company}
      </Text>
      <Text
        className="font-['LatoBlack'] text-xs mb-4"
        style={{ color: settings?.mainSectionPrimaryTextColor?.hex }}
      >
        {startYear} - {endYear}
      </Text>
      <View
        className="relative border-l border-solid"
        style={{ borderColor: settings?.mainSectionLineColor?.hex }}
      >
        {/* Timeline entries for each experience */}
        {items.map((item, idx) => (
          <View
            key={idx}
            className={
              "bi-avoid bb-always font-['Lato'] ml-4 " +
              (idx !== 0 ? "mt-11" : "mt-4")
            }
          >
            {/* Timeline dot */}
            <View
              className="absolute w-3 h-3 rounded-full mt-1.5 -left-6 ml-0.5 border"
              style={{
                borderColor: settings?.mainSectionLineColor?.hex,
                backgroundColor: settings?.mainSectionDotColor?.hex,
              }}
            ></View>
            {/* Role title */}
            <Text
              className="font-['LatoBlack'] uppercase text-sm font-semibold"
              style={{ color: settings?.mainSectionSecondaryTextColor?.hex }}
            >
              {item.role}
            </Text>
            <View className="text-xs font-semibold mb-4">
              <Text
                className="font-['LatoBlack'] text-xs"
                style={{ color: settings?.mainSectionPrimaryTextColor?.hex }}
              >
                {item.experienceDates?.startDate?.substring(0, 4) || "N/A"}
                &nbsp; - &nbsp;
                {item.experienceDates?.presentDate
                  ? "Present"
                  : item.experienceDates?.endDate?.substring(0, 4) || "N/A"}
              </Text>
            </View>
            {/* Duties and skills for each timeline entry */}
            <DutiesAndSkills item={item} />
          </View>
        ))}
      </View>
    </View>
  );
};

export default CompanyExperienceBlock; 