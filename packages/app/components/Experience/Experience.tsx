import React from "react";
import { View, Text } from "react-native";
import DefaultComponentProps, { ExperienceItem } from "types/components";
import { useResumeData } from "app/context/ResumeContext";
import { useSettings } from "app/hooks/useSettings";
import CompanyExperienceBlock from 'app/components/Blocks/CompanyExperienceBlock';

/** Visual resume PDF/print: start this employer on a new page (non-ATS layout only). */
const ENTAIN_GROUP_KEY = "entain";

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

  // Group by company (entries without company get a unique key so they still render)
  const groups = normalizedData.reduce<Record<string, ExperienceItem[]>>(
    (acc, item, idx) => {
      const key = item.company?.trim() || `__orphan_${idx}`;
      (acc[key] = acc[key] || []).push(item);
      return acc;
    },
    {},
  );

  return (
    <View className={className ?? ""}>
      <Text
        className="resume-section-title uppercase font-['Norwester'] text-xl mb-4"
        style={{
          color: settings?.mainSectionTextColor?.hex,
        }}
      >
        {data.label}
      </Text>

      {Object.entries(groups).map(([key, companyExperiences], index) => {
        const displayCompany = key.startsWith("__orphan_") ? "" : key;
        const pdfBreakBefore =
          !key.startsWith("__orphan_") &&
          key.trim().toLowerCase() === ENTAIN_GROUP_KEY
            ? "resume-pdf-break-before-company"
            : undefined;
        return (
          <CompanyExperienceBlock
            key={index}
            company={displayCompany}
            items={companyExperiences}
            settings={settings}
            wrapperClassName={pdfBreakBefore}
          />
        );
      })}
    </View>
  );
};

export default Experience;
