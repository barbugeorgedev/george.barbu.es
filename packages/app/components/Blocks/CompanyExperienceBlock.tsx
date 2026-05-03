import React from "react";
import { View, Text } from "react-native";
import { ExperienceItem } from "types/components";
import { formatDurationLabel } from "app/utils/experienceDuration";
import { AtsHiddenEmployerContext } from "app/components/AtsHiddenEmployerContext";

interface CompanyExperienceBlockProps {
  company: string;
  items: ExperienceItem[];
  settings: any;
  /** One • line with all duties joined (e.g. Early career) */
  singleDutyBullet?: boolean;
  /** Extra classes on the outer wrapper (e.g. print page-break for PDF) */
  wrapperClassName?: string;
}

// DutiesAndSkills: Shared subcomponent for rendering duties and skills for an experience item
const DutiesAndSkills: React.FC<{ item: ExperienceItem; singleBullet?: boolean }> = ({
  item,
  singleBullet,
}) => {
  const duties = item.duties?.filter(Boolean) ?? [];
  return (
  <>
    <View className="mb-2">
      {singleBullet ? (
        duties.length > 0 ? (
          <Text className="text-xs mb-1">• {duties.join(" ")}</Text>
        ) : null
      ) : (
        duties.map((duty, dutyIdx) => (
          <Text key={dutyIdx} className="text-xs mb-1">- {duty}</Text>
        ))
      )}
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
};

/**
 * CompanyExperienceBlock
 * Single company: one or more roles stacked (no timeline). Hidden sr-only lines repeat employer per role for ATS.
 */
const CompanyExperienceBlock: React.FC<CompanyExperienceBlockProps> = ({
  company,
  items,
  settings,
  singleDutyBullet,
  wrapperClassName,
}) => {
  const wrapClass =
    "mb-10 resume-avoid-break bi-avoid" +
    (wrapperClassName ? ` ${wrapperClassName}` : "");
  if (!items || items.length === 0) return null;
  const companyTrim = company?.trim() ?? "";

  // --- Single Experience Layout ---
  if (items.length === 1) {
    const item = items[0];
    if (!item) return null;
    const yearRange = `${item.experienceDates?.startDate?.substring(0, 4) || "N/A"} - ${item.experienceDates?.presentDate ? "Present" : item.experienceDates?.endDate?.substring(0, 4) || "N/A"}`;
    const duration = formatDurationLabel(
      item.experienceDates?.startDate,
      item.experienceDates?.endDate,
      item.experienceDates?.presentDate
    );
    const companyDatesLine = companyTrim ? `${companyTrim} | ${yearRange}` : yearRange;
    return (
      <View className={wrapClass}>
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
          {companyDatesLine}
          {duration}
        </Text>
        {/* Duties and skills for single experience */}
        <DutiesAndSkills item={item} singleBullet={singleDutyBullet} />
      </View>
    );
  }

  // --- Multiple roles, same company (stacked; no timeline) ---
  const oldest = items[items.length - 1];
  const newest = items[0];
  const startYear = oldest?.experienceDates?.startDate?.substring(0, 4) || "N/A";
  const endYear = newest?.experienceDates?.presentDate
    ? "Present"
    : newest?.experienceDates?.endDate?.substring(0, 4) || "N/A";
  const companyDuration = formatDurationLabel(
    oldest?.experienceDates?.startDate,
    newest?.experienceDates?.presentDate ? undefined : newest?.experienceDates?.endDate,
    newest?.experienceDates?.presentDate
  );
  return (
    <View className={wrapClass}>
      {companyTrim ? (
        <Text
          className="font-['LatoBlack'] uppercase text-sm font-semibold"
          style={{ color: settings?.mainSectionSecondaryTextColor?.hex }}
        >
          {companyTrim}
        </Text>
      ) : null}
      <Text
        className="font-['LatoBlack'] text-xs mb-4"
        style={{ color: settings?.mainSectionPrimaryTextColor?.hex }}
      >
        {startYear} - {endYear}
        {companyDuration}
      </Text>
      {/* Vertical continuity line for roles at the same employer */}
      <View
        className="relative border-l border-solid pl-4"
        style={{ borderColor: settings?.mainSectionLineColor?.hex }}
      >
        {items.map((item, idx) => {
          const roleDuration = formatDurationLabel(
            item.experienceDates?.startDate,
            item.experienceDates?.endDate,
            item.experienceDates?.presentDate
          );
          const yStart = item.experienceDates?.startDate?.substring(0, 4) || "N/A";
          const yEnd = item.experienceDates?.presentDate
            ? "Present"
            : item.experienceDates?.endDate?.substring(0, 4) || "N/A";
          const roleRange = `${yStart} - ${yEnd}`;
          return (
            <View
              key={idx}
              className={
                "relative resume-avoid-break bi-avoid font-['Lato'] " +
                (idx !== 0 ? "mt-8" : "mt-1")
              }
            >
              <View
                className="absolute w-2.5 h-2.5 rounded-full top-1.5 -left-[22px] border"
                style={{
                  borderColor: settings?.mainSectionLineColor?.hex,
                  backgroundColor: settings?.mainSectionDotColor?.hex,
                }}
              />
              {companyTrim ? (
                <AtsHiddenEmployerContext
                  employer={companyTrim}
                  jobTitle={item.role}
                  dateRange={roleRange}
                  durationSuffix={roleDuration}
                />
              ) : null}
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
                  {yStart}
                  &nbsp; - &nbsp;
                  {yEnd}
                  {roleDuration}
                </Text>
              </View>
              <DutiesAndSkills item={item} singleBullet={singleDutyBullet} />
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default CompanyExperienceBlock; 