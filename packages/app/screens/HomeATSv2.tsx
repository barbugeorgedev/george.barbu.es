import React from "react";
import { View, Text, Linking, TouchableOpacity } from "react-native";
import { useResumeData } from "app/context/ResumeContext";
import { formatDurationLabel } from "app/utils/experienceDuration";
import { AtsHiddenEmployerContext } from "app/components/AtsHiddenEmployerContext";

const AtsV2Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <View className="mb-8">
    <Text className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-900 border-b border-neutral-400 pb-2 mb-4">
      {title}
    </Text>
    {children}
  </View>
);

const AtsV2BulletList: React.FC<{ items: string[] }> = ({ items }) => {
  const list = items.filter(Boolean);
  if (list.length === 0) return null;
  return (
    <View className="mt-2 pl-1">
      {list.map((line, i) => (
        <View key={i} className="flex flex-row mb-1.5">
          <Text className="text-sm text-neutral-900 mr-2 w-3 shrink-0">•</Text>
          <Text className="text-sm text-neutral-800 leading-6 flex-1">{line}</Text>
        </View>
      ))}
    </View>
  );
};

const AtsV2EarlySingleBullet: React.FC<{ duties?: string[] }> = ({ duties }) => {
  const text = duties?.filter(Boolean).join(" ");
  if (!text) return null;
  return (
    <View className="mt-2 flex flex-row">
      <Text className="text-sm text-neutral-900 mr-2 w-3 shrink-0">•</Text>
      <Text className="text-sm text-neutral-800 leading-6 flex-1">{text}</Text>
    </View>
  );
};

/**
 * ATS v2 (`/ats-v2`, `/{slug}-ats-v2`): single-column, parser-focused flow (contact block, timelines where useful).
 */
export const HomeATSv2: React.FC = () => {
  const resumeData = useResumeData();
  const header = resumeData?.header?.[0];
  const sidebar = resumeData?.sidebar?.[0];
  const content = resumeData?.content?.[0];
  const allSkills = sidebar?.skillsSections || [];

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return `${date.getFullYear()}`;
  };

  const formatDateRange = (startDate?: string, endDate?: string, presentDate?: boolean) => {
    const start = formatDate(startDate);
    const end = presentDate ? "Present" : formatDate(endDate);
    if (!start && !end) return "";
    if (!start) return end;
    if (!end) return start;
    return `${start} – ${end}`;
  };

  const groupItemsByCompany = <T extends { company?: string }>(items: T[]) => {
    const groups: Record<string, T[]> = {};
    items.forEach((item, idx) => {
      const key = item.company?.trim() || `__orphan_${idx}`;
      (groups[key] = groups[key] || []).push(item);
    });
    return Object.entries(groups) as [string, T[]][];
  };

  const getUrl = (value?: string, service?: string) => {
    if (!value) return "";
    if (value.startsWith("http://") || value.startsWith("https://")) return value;
    if (service === "email") return `mailto:${value}`;
    if (service === "phone" || service === "homephone") return `tel:${value}`;
    if (service === "linkedin") return `https://linkedin.com/in/${value.replace(/^.*\//, "")}`;
    if (service === "github") return `https://github.com/${value.replace(/^.*\//, "")}`;
    return value;
  };

  return (
    <View className="atsv2-pdf-root w-full bg-white print:bg-white font-sans [writing-mode:horizontal-tb]">
      <View className="atsv2-pdf-inner max-w-[820px] w-full mx-auto px-6 py-10 print:py-8 print:px-6 box-border">
        {/* Name + headline */}
        {header?.fullname ? (
          <View className="atsv2-pdf-header mb-6 pb-5 border-b border-neutral-300">
            <Text className="text-3xl font-bold text-neutral-900 tracking-tight mb-1">{header.fullname}</Text>
            {header.role ? (
              <Text className="text-base text-neutral-700 font-medium">{header.role}</Text>
            ) : null}
          </View>
        ) : null}

        {/* Contact — one fact per line for parsers */}
        {sidebar?.contactSection?.items && sidebar.contactSection.items.length > 0 ? (
          <AtsV2Section title={sidebar.contactSection.label || "CONTACT"}>
            <View>
              {sidebar.contactSection.items.map((item: any, idx: number) => {
                if (!item.value) return null;
                const getLabel = () => {
                  if (!item.showLabel) return "";
                  if (item.label) return `${item.label} `;
                  if (item.service === "phone" || item.service === "homephone") return "Phone: ";
                  if (item.service === "email") return "Email: ";
                  if (item.service === "location") return "Location: ";
                  if (item.service === "website") return "Website: ";
                  if (item.service === "linkedin") return "LinkedIn: ";
                  if (item.service === "github") return "GitHub: ";
                  return "";
                };
                const label = getLabel();
                const url = getUrl(item.value, item.service);
                const isLink =
                  item.service === "email" ||
                  item.service === "phone" ||
                  item.service === "homephone" ||
                  item.service === "linkedin" ||
                  item.service === "github" ||
                  item.service === "website";

                const line = (
                  <Text className="text-sm text-neutral-800 leading-7 mb-1">
                    <Text className="font-semibold text-neutral-900">{label}</Text>
                    <Text className={isLink ? "text-blue-700 underline" : "text-neutral-800"}>{item.value}</Text>
                  </Text>
                );

                if (isLink && url) {
                  return (
                    <TouchableOpacity key={idx} onPress={() => Linking.openURL(url)}>
                      {line}
                    </TouchableOpacity>
                  );
                }
                return <View key={idx}>{line}</View>;
              })}
            </View>
          </AtsV2Section>
        ) : null}

        {sidebar?.summarySection?.summary ? (
          <AtsV2Section title={sidebar.summarySection.label || "SUMMARY"}>
            <Text className="text-sm text-neutral-800 leading-7 text-left">{sidebar.summarySection.summary}</Text>
          </AtsV2Section>
        ) : null}

        {content?.experienceSection?.items && content.experienceSection.items.length > 0 ? (
          <AtsV2Section title={content.experienceSection.label || "PROFESSIONAL EXPERIENCE"}>
            {groupItemsByCompany(content.experienceSection.items).map(([companyKey, groupItems]) => {
              const displayCompany = companyKey.startsWith("__orphan_") ? "" : companyKey;

              if (groupItems.length === 1) {
                const item = groupItems[0]!;
                const dateRange = formatDateRange(
                  item.experienceDates?.startDate,
                  item.experienceDates?.endDate,
                  item.experienceDates?.presentDate
                );
                const duration = formatDurationLabel(
                  item.experienceDates?.startDate,
                  item.experienceDates?.endDate,
                  item.experienceDates?.presentDate
                );
                const metaParts = [displayCompany || undefined, dateRange].filter(Boolean);
                const meta = metaParts.join(" | ");
                return (
                  <View key={companyKey} className="mb-7 resume-avoid-break bi-avoid">
                    <Text className="text-base font-bold text-neutral-900">{item.role || ""}</Text>
                    {meta ? (
                      <Text className="text-sm text-neutral-700 mt-1">
                        {meta}
                        {duration}
                      </Text>
                    ) : null}
                    <AtsV2BulletList items={item.duties || []} />
                  </View>
                );
              }

              const oldest = groupItems[groupItems.length - 1]!;
              const newest = groupItems[0]!;
              const startYear = formatDate(oldest.experienceDates?.startDate) || "N/A";
              const endYear = newest.experienceDates?.presentDate
                ? "Present"
                : formatDate(newest.experienceDates?.endDate) || "N/A";
              const companyDuration = formatDurationLabel(
                oldest.experienceDates?.startDate,
                newest.experienceDates?.presentDate ? undefined : newest.experienceDates?.endDate,
                newest.experienceDates?.presentDate
              );

              return (
                <View key={companyKey} className="mb-8">
                  {displayCompany ? (
                    <Text className="text-base font-bold text-neutral-900 mb-1">{displayCompany}</Text>
                  ) : null}
                  <Text className="text-sm text-neutral-700 mb-3">
                    {startYear} – {endYear}
                    {companyDuration}
                  </Text>
                  <View className="relative border-l border-neutral-300 border-solid">
                    {groupItems.map((item: any, idx: number) => {
                      const roleDuration = formatDurationLabel(
                        item.experienceDates?.startDate,
                        item.experienceDates?.endDate,
                        item.experienceDates?.presentDate
                      );
                      const yStart = formatDate(item.experienceDates?.startDate) || "N/A";
                      const yEnd = item.experienceDates?.presentDate
                        ? "Present"
                        : formatDate(item.experienceDates?.endDate) || "N/A";
                      const roleRange = `${yStart} – ${yEnd}`;
                      return (
                        <View
                          key={idx}
                          className={`relative ml-4 resume-avoid-break bi-avoid ${idx !== 0 ? "mt-6" : "mt-2"}`}
                        >
                          <View className="absolute w-2 h-2 rounded-full top-1.5 -left-[21px] bg-neutral-100 border border-neutral-400" />
                          {displayCompany ? (
                            <AtsHiddenEmployerContext
                              employer={displayCompany}
                              jobTitle={item.role || ""}
                              dateRange={roleRange}
                              durationSuffix={roleDuration}
                            />
                          ) : null}
                          <Text className="text-sm font-bold text-neutral-900">{item.role || ""}</Text>
                          <Text className="text-sm text-neutral-600 mt-0.5">
                            {yStart} – {yEnd}
                            {roleDuration}
                          </Text>
                          <AtsV2BulletList items={item.duties || []} />
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </AtsV2Section>
        ) : null}

        {content?.earlyCareerExperienceSection?.items &&
        content.earlyCareerExperienceSection.items.length > 0 ? (
          <AtsV2Section title={content.earlyCareerExperienceSection.label || "EARLY CAREER"}>
            {groupItemsByCompany(content.earlyCareerExperienceSection.items).map(([companyKey, groupItems]) => {
              const displayCompany = companyKey.startsWith("__orphan_") ? "" : companyKey;

              if (groupItems.length === 1) {
                const item = groupItems[0]!;
                const dateRange = formatDateRange(
                  item.experienceDates?.startDate,
                  item.experienceDates?.endDate,
                  item.experienceDates?.presentDate
                );
                const duration = formatDurationLabel(
                  item.experienceDates?.startDate,
                  item.experienceDates?.endDate,
                  item.experienceDates?.presentDate
                );
                const metaParts = [displayCompany || undefined, dateRange].filter(Boolean);
                const meta = metaParts.join(" | ");
                return (
                  <View key={companyKey} className="mb-6 resume-avoid-break bi-avoid">
                    <Text className="text-base font-bold text-neutral-900">{item.role || ""}</Text>
                    {meta ? (
                      <Text className="text-sm text-neutral-700 mt-1">
                        {meta}
                        {duration}
                      </Text>
                    ) : null}
                    <AtsV2EarlySingleBullet duties={item.duties} />
                  </View>
                );
              }

              const oldest = groupItems[groupItems.length - 1]!;
              const newest = groupItems[0]!;
              const startYear = formatDate(oldest.experienceDates?.startDate) || "N/A";
              const endYear = newest.experienceDates?.presentDate
                ? "Present"
                : formatDate(newest.experienceDates?.endDate) || "N/A";
              const companyDuration = formatDurationLabel(
                oldest.experienceDates?.startDate,
                newest.experienceDates?.presentDate ? undefined : newest.experienceDates?.endDate,
                newest.experienceDates?.presentDate
              );

              return (
                <View key={companyKey} className="mb-8">
                  {displayCompany ? (
                    <Text className="text-base font-bold text-neutral-900 mb-1">{displayCompany}</Text>
                  ) : null}
                  <Text className="text-sm text-neutral-700 mb-3">
                    {startYear} – {endYear}
                    {companyDuration}
                  </Text>
                  <View className="relative border-l border-neutral-300 border-solid">
                    {groupItems.map((item, idx) => {
                      const roleDuration = formatDurationLabel(
                        item.experienceDates?.startDate,
                        item.experienceDates?.endDate,
                        item.experienceDates?.presentDate
                      );
                      const yStart = formatDate(item.experienceDates?.startDate) || "N/A";
                      const yEnd = item.experienceDates?.presentDate
                        ? "Present"
                        : formatDate(item.experienceDates?.endDate) || "N/A";
                      return (
                        <View
                          key={idx}
                          className={`relative ml-4 resume-avoid-break bi-avoid ${idx > 0 ? "mt-6 mb-1" : "mt-2 mb-1"}`}
                        >
                          <View className="absolute w-2 h-2 rounded-full top-1.5 -left-[21px] bg-neutral-100 border border-neutral-400" />
                          {displayCompany ? (
                            <AtsHiddenEmployerContext
                              employer={displayCompany}
                              jobTitle={item.role || ""}
                              dateRange={`${yStart} – ${yEnd}`}
                              durationSuffix={roleDuration}
                            />
                          ) : null}
                          <Text className="text-sm font-bold text-neutral-900">{item.role || ""}</Text>
                          <Text className="text-sm text-neutral-600 mt-0.5">
                            {yStart} – {yEnd}
                            {roleDuration}
                          </Text>
                          <AtsV2EarlySingleBullet duties={item.duties} />
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </AtsV2Section>
        ) : null}

        {content?.ngoExperienceSection?.items && content.ngoExperienceSection.items.length > 0 ? (
          <AtsV2Section title={content.ngoExperienceSection.label || "VOLUNTEER / NGO EXPERIENCE"}>
            {content.ngoExperienceSection.items.map((item: any, idx: number) => {
              const dateRange = formatDateRange(
                item.experienceDates?.startDate,
                item.experienceDates?.endDate,
                item.experienceDates?.presentDate
              );
              const duration = formatDurationLabel(
                item.experienceDates?.startDate,
                item.experienceDates?.endDate,
                item.experienceDates?.presentDate
              );
              const metaParts = [item.company?.trim(), dateRange].filter(Boolean);
              const meta = metaParts.join(" | ");
              return (
                <View key={idx} className="mb-7 resume-avoid-break bi-avoid">
                  <Text className="text-base font-bold text-neutral-900">{item.role || ""}</Text>
                  {meta ? (
                    <Text className="text-sm text-neutral-700 mt-1">
                      {meta}
                      {duration}
                    </Text>
                  ) : null}
                  <AtsV2BulletList items={item.duties || []} />
                </View>
              );
            })}
          </AtsV2Section>
        ) : null}

        {content?.educationSection?.items && content.educationSection.items.length > 0 ? (
          <AtsV2Section title={content.educationSection.label || "EDUCATION"}>
            {content.educationSection.items.map((item: any, idx: number) => (
              <View key={idx} className="mb-5">
                <Text className="text-sm font-bold text-neutral-900">
                  {item.degree || ""}
                  {item.type ? ` in ${item.type}` : ""}
                </Text>
                {item.institution ? (
                  <Text className="text-sm text-neutral-700 mt-1">{item.institution}</Text>
                ) : null}
              </View>
            ))}
          </AtsV2Section>
        ) : null}

        {content?.educationSection?.items &&
        content.educationSection.items.some((item: any) => item.certifications?.length > 0) ? (
          <AtsV2Section title="CERTIFICATIONS">
            {content.educationSection.items.flatMap((item: any, idx: number) =>
              (item.certifications || []).map((cert: string, cIdx: number) => (
                <View key={`${idx}-${cIdx}`} className="flex flex-row mb-1.5">
                  <Text className="text-sm text-neutral-900 mr-2 w-3 shrink-0">•</Text>
                  <Text className="text-sm text-neutral-800 flex-1">{cert}</Text>
                </View>
              ))
            )}
          </AtsV2Section>
        ) : null}

        {allSkills.map((skillSection: any, sectionIdx: number) => {
          if (!skillSection?.items || skillSection.items.length === 0) return null;
          const labels = skillSection.items
            .map((item: { title?: string; name?: string }) => item.title || item.name)
            .filter(Boolean);
          if (labels.length === 0) return null;
          const rawTitle = (skillSection.label || "SKILLS").toUpperCase().trim();
          const title = /:\s*$/.test(rawTitle) ? rawTitle : `${rawTitle}:`;
          return (
            <AtsV2Section key={sectionIdx} title={title}>
              <Text className="text-sm text-neutral-800 leading-7">{labels.join(", ")}</Text>
            </AtsV2Section>
          );
        })}
      </View>
    </View>
  );
};

export default HomeATSv2;
