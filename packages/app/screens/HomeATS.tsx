import React from "react";
import { View, Text, Linking, TouchableOpacity } from "react-native";
import { useResumeData } from "app/context/ResumeContext";
import { formatDurationLabel } from "app/utils/experienceDuration";
import { AtsHiddenEmployerContext } from "app/components/AtsHiddenEmployerContext";

/**
 * ATS-optimized resume layout
 * Two-column design matching modern resume templates, optimized for ATS parsing
 */
export const HomeATS: React.FC = () => {
  const resumeData = useResumeData();
  const header = resumeData?.header?.[0];
  const sidebar = resumeData?.sidebar?.[0];
  const content = resumeData?.content?.[0];

  // Get all skills sections
  const allSkills = sidebar?.skillsSections || [];

  // Format date to "YYYY" format (e.g., "2022")
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const year = date.getFullYear();
    return `${year}`;
  };

  // Format date range for experience
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

  const atsDutySingleBullet = (duties?: string[]) => {
    const text = duties?.filter(Boolean).join(" ");
    if (!text) return null;
    return (
      <View className="mt-1.5 flex flex-row [writing-mode:horizontal-tb]">
        <Text className="text-xs text-white mr-2 inline-block">•</Text>
        <Text className="text-xs text-white leading-[19px] flex-1 text-justify block whitespace-normal">
          {text}
        </Text>
      </View>
    );
  };

  // Get URL from contact item value
  const getUrl = (value?: string, service?: string) => {
    if (!value) return "";
    if (value.startsWith("http://") || value.startsWith("https://")) return value;
    if (service === "email") return `mailto:${value}`;
    if (service === "phone" || service === "homephone") return `tel:${value}`;
    if (service === "linkedin") return `https://linkedin.com/in/${value.replace(/^.*\//, "")}`;
    if (service === "github") return `https://github.com/${value.replace(/^.*\//, "")}`;
    return value;
  };

  /** Purple rule under section headings (matches title accent #c084fc) */
  const SectionUnderline = () => (
    <View className="h-[2px] w-full bg-[#c084fc] rounded-full mb-3 mt-0" />
  );

  const headerTagline =
    header?.slogan?.trim() || header?.cvpurpose?.trim() || "";

  return (
    <View className="ats-pdf-root printColor flex flex-col w-full print:bg-[#313638] bg-[#313638] font-sans [writing-mode:horizontal-tb] [text-orientation:mixed]">
      <View className="ats-pdf-inner printColor print:bg-[#313638] flex flex-col w-full max-w-screen-pdf mx-auto box-border bg-[#313638] print:py-10 print:px-8 py-0 px-0">
        {/* Header Section */}
        {header?.fullname && (
          <View className="ats-pdf-header mb-8 pb-5 pt-5 border-b border-b-[rgba(255,255,255,0.15)] w-full shrink-0">
            <Text className="text-4xl font-bold text-white mb-2 tracking-[-0.5px] block whitespace-normal">
              {header.fullname.toUpperCase()}
            </Text>
            {header.role && (
              <Text className="text-[15px] text-[#e5e5e5] font-normal block whitespace-normal">
                {header.role}
              </Text>
            )}
            {headerTagline ? (
              <Text className="text-[13px] text-[#a3a3a3] font-normal mt-2 leading-[20px] block whitespace-normal italic">
                {headerTagline}
              </Text>
            ) : null}
          </View>
        )}

        {/* Full-width summary above the two-column block (PDF + screen) */}
        {sidebar?.summarySection?.summary && (
          <View className="ats-pdf-summary w-full max-w-full shrink-0 mb-6 self-stretch">
            <Text className="text-[15px] font-bold mb-1.5 uppercase tracking-[1px] text-[#c084fc] block whitespace-normal">
              {sidebar.summarySection.label || "SUMMARY"}
            </Text>
            <SectionUnderline />
            <Text className="text-[13px] text-white leading-[19px] text-justify block whitespace-normal">
              {sidebar.summarySection.summary}
            </Text>
          </View>
        )}

        {/* Experience (left) + sidebar (right) start at PROFESSIONAL EXPERIENCE */}
        <View className="ats-pdf-columns flex flex-row gap-10 items-start [writing-mode:horizontal-tb] [text-orientation:mixed]">
          <View className="flex-1 min-w-0">
            {/* Work Experience Section — grouped by employer (e.g. Entain); sr-only repeats employer per role for ATS */}
            {content?.experienceSection?.items && content.experienceSection.items.length > 0 && (
              <View className="mb-7">
                <Text className="text-[15px] font-bold mb-1.5 uppercase tracking-[1px] text-[#c084fc] block whitespace-normal">
                  {content.experienceSection.label || "PROFESSIONAL EXPERIENCE"}
                </Text>
                <SectionUnderline />
                {groupItemsByCompany(content.experienceSection.items).map(([companyKey, groupItems]) => {
                  const displayCompany = companyKey.startsWith("__orphan_") ? "" : companyKey;

                  const renderRoleBullets = (item: any) =>
                    item.duties && item.duties.length > 0 ? (
                      <View className="mt-1.5">
                        {item.duties.map((duty: string, dIdx: number) => (
                          <View key={dIdx} className="flex flex-row mb-1.5 [writing-mode:horizontal-tb]">
                            <Text className="text-xs text-white mr-2 inline-block">•</Text>
                            <Text className="text-xs text-white leading-[19px] flex-1 text-justify block whitespace-normal">
                              {duty}
                            </Text>
                          </View>
                        ))}
                      </View>
                    ) : null;

                  if (groupItems.length === 1) {
                    const item = groupItems[0]!;
                    const dateRange = formatDateRange(
                      item.experienceDates?.startDate,
                      item.experienceDates?.endDate,
                      item.experienceDates?.presentDate
                    );
                    const durationLabel = formatDurationLabel(
                      item.experienceDates?.startDate,
                      item.experienceDates?.endDate,
                      item.experienceDates?.presentDate
                    );
                    const companyLineRight = `${dateRange || ""}${durationLabel}`;
                    return (
                      <View key={companyKey} className="mb-6 resume-avoid-break bi-avoid">
                        <View className="flex flex-row justify-between items-start mb-1 [writing-mode:horizontal-tb] [text-orientation:mixed]">
                          <Text className="text-sm font-bold text-white flex-1 block whitespace-normal break-normal">
                            {item.role || ""}
                          </Text>
                        </View>
                        <View className="flex flex-row items-center flex-wrap gap-x-2 mb-2">
                          {!!displayCompany && (
                            <Text className="text-[13px] text-white font-bold whitespace-normal">
                              {displayCompany}
                            </Text>
                          )}
                          {!!displayCompany && !!companyLineRight.trim() && (
                            <View className="w-px h-[14px] bg-[rgba(255,255,255,0.35)] shrink-0" />
                          )}
                          {!!companyLineRight.trim() && (
                            <Text className="text-[13px] text-white font-bold whitespace-normal">
                              {dateRange}
                              {durationLabel}
                            </Text>
                          )}
                        </View>
                        {renderRoleBullets(item)}
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
                      {!!displayCompany && (
                        <Text className="text-sm font-bold text-white mb-1 block whitespace-normal">
                          {displayCompany}
                        </Text>
                      )}
                      <Text className="text-[13px] text-white font-semibold mb-3 block whitespace-normal">
                        {startYear} – {endYear}
                        {companyDuration}
                      </Text>
                      <View className="relative border-l border-[rgba(255,255,255,0.35)] border-solid">
                        {groupItems.map((item: any, idx: number) => {
                          const durationLabel = formatDurationLabel(
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
                              <View className="absolute w-2 h-2 rounded-full top-1.5 -left-[21px] bg-white border border-[rgba(255,255,255,0.5)]" />
                              {!!displayCompany && (
                                <AtsHiddenEmployerContext
                                  employer={displayCompany}
                                  jobTitle={item.role || ""}
                                  dateRange={roleRange}
                                  durationSuffix={durationLabel}
                                />
                              )}
                              <Text className="text-sm font-bold text-white block whitespace-normal">
                                {item.role || ""}
                              </Text>
                              <Text className="text-[12px] text-[#a0a0a0] mb-2 block whitespace-normal">
                                {yStart} – {yEnd}
                                {durationLabel}
                              </Text>
                              {renderRoleBullets(item)}
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Early Career Section — grouped by company; one • per role */}
            {content?.earlyCareerExperienceSection?.items &&
              content.earlyCareerExperienceSection.items.length > 0 && (
                <View className="mb-7">
                  <Text className="text-[15px] font-bold mb-1.5 uppercase tracking-[1px] text-[#c084fc] block whitespace-normal">
                    {content.earlyCareerExperienceSection.label || "EARLY CAREER EXPERIENCE"}
                  </Text>
                  <SectionUnderline />
                  {groupItemsByCompany(content.earlyCareerExperienceSection.items).map(
                    ([companyKey, groupItems]) => {
                      const displayCompany = companyKey.startsWith("__orphan_") ? "" : companyKey;

                      if (groupItems.length === 1) {
                        const item = groupItems[0]!;
                        const dateRange = formatDateRange(
                          item.experienceDates?.startDate,
                          item.experienceDates?.endDate,
                          item.experienceDates?.presentDate
                        );
                        const durationLabel = formatDurationLabel(
                          item.experienceDates?.startDate,
                          item.experienceDates?.endDate,
                          item.experienceDates?.presentDate
                        );
                        const companyLineRight = `${dateRange || ""}${durationLabel}`;
                        return (
                          <View key={companyKey} className="mb-8 resume-avoid-break bi-avoid">
                            <View className="flex flex-row justify-between items-start mb-1 [writing-mode:horizontal-tb]">
                              <Text className="text-sm font-bold text-white flex-1 block whitespace-normal">
                                {item.role || ""}
                              </Text>
                            </View>
                            <View className="flex flex-row items-center flex-wrap gap-x-2 mb-2">
                              {!!displayCompany && (
                                <Text className="text-[13px] text-white font-semibold whitespace-normal">
                                  {displayCompany}
                                </Text>
                              )}
                              {!!displayCompany && !!companyLineRight.trim() && (
                                <View className="w-px h-[14px] bg-[rgba(255,255,255,0.35)] shrink-0" />
                              )}
                              {!!companyLineRight.trim() && (
                                <Text className="text-[13px] text-white font-semibold whitespace-normal">
                                  {dateRange}
                                  {durationLabel}
                                </Text>
                              )}
                            </View>
                            {atsDutySingleBullet(item.duties)}
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
                        newest.experienceDates?.presentDate
                          ? undefined
                          : newest.experienceDates?.endDate,
                        newest.experienceDates?.presentDate
                      );

                      return (
                        <View key={companyKey} className="mb-8">
                          {!!displayCompany && (
                            <Text className="text-sm font-bold text-white mb-1 block whitespace-normal">
                              {displayCompany}
                            </Text>
                          )}
                          <Text className="text-[13px] text-white font-semibold mb-3 block whitespace-normal">
                            {startYear} – {endYear}
                            {companyDuration}
                          </Text>
                          <View className="relative border-l border-[rgba(255,255,255,0.35)] border-solid">
                            {groupItems.map((item, idx) => {
                              const roleDuration = formatDurationLabel(
                                item.experienceDates?.startDate,
                                item.experienceDates?.endDate,
                                item.experienceDates?.presentDate
                              );
                              const yStart =
                                formatDate(item.experienceDates?.startDate) || "N/A";
                              const yEnd = item.experienceDates?.presentDate
                                ? "Present"
                                : formatDate(item.experienceDates?.endDate) || "N/A";
                              const roleRange = `${yStart} – ${yEnd}`;
                              return (
                                <View
                                  key={idx}
                                  className={`relative ml-4 resume-avoid-break bi-avoid ${idx !== 0 ? "mt-6" : "mt-2"}`}
                                >
                                  <View className="absolute w-2 h-2 rounded-full top-1.5 -left-[21px] bg-white border border-[rgba(255,255,255,0.5)]" />
                                  {!!displayCompany && (
                                    <AtsHiddenEmployerContext
                                      employer={displayCompany}
                                      jobTitle={item.role || ""}
                                      dateRange={roleRange}
                                      durationSuffix={roleDuration}
                                    />
                                  )}
                                  <Text className="text-sm font-bold text-white block whitespace-normal">
                                    {item.role || ""}
                                  </Text>
                                  <Text className="text-[12px] text-[#a0a0a0] mb-2 block whitespace-normal">
                                    {yStart} – {yEnd}
                                    {roleDuration}
                                  </Text>
                                  {atsDutySingleBullet(item.duties)}
                                </View>
                              );
                            })}
                          </View>
                        </View>
                      );
                    }
                  )}
                </View>
              )}

            {/* NGO Experience Section */}
            {content?.ngoExperienceSection?.items &&
              content.ngoExperienceSection.items.length > 0 && (
                <View className="mb-7">
                  <Text className="text-[15px] font-bold mb-1.5 uppercase tracking-[1px] text-[#c084fc] block whitespace-normal">
                    {content.ngoExperienceSection.label || "NGO EXPERIENCE"}
                  </Text>
                  <SectionUnderline />
                  {content.ngoExperienceSection.items.map((item: any, idx: number) => {
                    const dateRange = formatDateRange(
                      item.experienceDates?.startDate,
                      item.experienceDates?.endDate,
                      item.experienceDates?.presentDate
                    );

                    return (
                      <View key={idx} className="mb-8 resume-avoid-break bi-avoid">
                        <View className="flex flex-row justify-between items-start mb-1 [writing-mode:horizontal-tb]">
                          <Text className="text-sm font-bold text-white flex-1 block whitespace-normal">
                            {item.role || ""}
                          </Text>
                          {dateRange && (
                            <Text className="text-[11px] text-[#a0a0a0] ml-4 whitespace-nowrap inline-block">
                              {dateRange}
                            </Text>
                          )}
                        </View>
                        <Text className="text-[13px] text-white font-semibold mb-2 block whitespace-normal">
                          {item.company || ""}
                        </Text>
                        {item.duties && item.duties.length > 0 && (
                          <View className="mt-1.5">
                            {item.duties.map((duty: string, dIdx: number) => (
                              <View key={dIdx} className="flex flex-row mb-1.5 [writing-mode:horizontal-tb]">
                                <Text className="text-xs text-white mr-2 inline-block">•</Text>
                                <Text className="text-xs text-white leading-[19px] flex-1 text-justify block whitespace-normal">
                                  {duty}
                                </Text>
                              </View>
                            ))}
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              )}
          </View>

          <View className="ats-pdf-sidebar w-[290px] shrink-0 self-start block [writing-mode:horizontal-tb]">
            {/* Contact Details */}
            {sidebar?.contactSection?.items && sidebar.contactSection.items.length > 0 && (
              <View className="mb-7">
                  <Text className="text-[15px] font-bold mb-1.5 uppercase tracking-[1px] text-[#c084fc] block whitespace-normal">
                    {sidebar.contactSection.label || "CONTACT DETAILS"}
                  </Text>
                  <SectionUnderline />
                <View>
                  {sidebar.contactSection.items.map((item: any, idx: number) => {
                    // Only show labels if showLabel is true
                    const getLabel = () => {
                      if (!item.showLabel) return "";
                      
                      // Use custom label first if it exists
                      if (item.label) return `${item.label}`;
                      
                      // Fall back to service-based labels
                      if (item.service === "phone" || item.service === "homephone") return "Phone: ";
                      if (item.service === "email") return "Email: ";
                      if (item.service === "location") return "Location: ";
                      if (item.service === "website") return "Website: ";
                      if (item.service === "linkedin") return "LinkedIn: ";
                      if (item.service === "github") return "GitHub: ";
                      return "";
                    };

                    const label = getLabel();
                    if (!item.value) return null;

                    const url = getUrl(item.value, item.service);
                    const isLink = item.service === "email" || item.service === "phone" || item.service === "homephone" || item.service === "linkedin" || item.service === "github" || item.service === "website";

                    const content = (
                      <Text className="text-[11.5px] leading-5 mb-2 block whitespace-normal">
                        <Text className="font-semibold text-white inline">{label}</Text>
                        <Text className={`${isLink ? "text-blue-400 underline" : "text-white"} inline whitespace-normal`}>
                          {item.value}
                        </Text>
                      </Text>
                    );

                    if (isLink && url) {
                      return (
                        <TouchableOpacity 
                          key={idx}
                          onPress={() => Linking.openURL(url)}
                        >
                          {content}
                        </TouchableOpacity>
                      );
                    }

                    return (
                      <View key={idx}>
                        {content}
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Skills Sections */}
            {allSkills.map((skillSection: any, sectionIdx: number) => {
              if (!skillSection?.items || skillSection.items.length === 0) return null;
              const isTagsView = skillSection.view === "tags";
              const isStyledListView = skillSection.view === "styled-list";
              
              return (
                <View key={sectionIdx} className="mb-7">
                  <Text className="text-[15px] font-bold mb-1.5 uppercase tracking-[1px] text-[#c084fc] block whitespace-normal">
                    {skillSection.label?.toUpperCase() || "SKILLS"}
                  </Text>
                  <SectionUnderline />
                  <View className={`flex flex-wrap ${isTagsView ? "flex-row" : "flex-col"}`}>
                    {skillSection.items.map((item: { title?: string; name?: string }, idx: number) => {
                      const itemText = item.title || item.name;
                      const isLastItem = idx === skillSection.items.length - 1;
                      
                      if (isTagsView) {
                        // Tags view: comma-separated, no bullets
                        return (
                          <Text key={idx} className="text-[11.5px] text-white leading-[19px] inline-block whitespace-normal">
                            {itemText + (!isLastItem ? `,\u00A0` : '')}
                          </Text>
                        );
                      } else if (isStyledListView) {
                        // Styled list view: with bullets
                        return (
                          <View key={idx} className="flex flex-row mb-1.5 [writing-mode:horizontal-tb]">
                            <Text className="text-[11.5px] text-white mr-2 inline-block">•</Text>
                            <Text className="text-[11.5px] text-white leading-[19px] flex-1 block whitespace-normal">
                              {itemText}
                            </Text>
                          </View>
                        );
                      } else {
                        // Default list view: no bullets, column layout
                        return (
                          <Text key={idx} className="text-[11.5px] text-white leading-[19px] mb-1.5 block whitespace-normal">
                            {itemText}
                          </Text>
                        );
                      }
                    })}
                  </View>
                </View>
              );
            })}

            {/* Certifications Section */}
            {content?.educationSection?.items &&
              content.educationSection.items.some(item => item.certifications && item.certifications.length > 0) && (
                <View className="mb-7">
                  <Text className="text-[15px] font-bold mb-1.5 uppercase tracking-[1px] text-[#c084fc] block whitespace-normal">
                    CERTIFICATIONS
                  </Text>
                  <SectionUnderline />
                  <View>
                    {content.educationSection.items.map((item: any, idx: number) =>
                      item.certifications?.map((cert: string, cIdx: number) => (
                        <View key={`${idx}-${cIdx}`} className="flex flex-row mb-1.5 [writing-mode:horizontal-tb]">
                            <Text className="text-[11.5px] text-white mr-2 inline-block">•</Text>
                            <Text className="text-[11.5px] text-white leading-[19px] flex-1 block whitespace-normal">
                            {cert}
                          </Text>
                        </View>
                      ))
                    )}
                  </View>
                </View>
              )}

            {/* Education Section */}
            {content?.educationSection?.items &&
              content.educationSection.items.length > 0 && (
                <View className="mb-7">
                  <Text className="text-[15px] font-bold mb-1.5 uppercase tracking-[1px] text-[#c084fc] block whitespace-normal">
                    {content.educationSection.label || "EDUCATION"}
                  </Text>
                  <SectionUnderline />
                  {content.educationSection.items.map((item: any, idx: number) => (
                    <View key={idx} className="mb-3.5">
                      <Text className="text-[12.5px] font-bold text-white mb-1.5 leading-[18px] block whitespace-normal">
                        {item.degree || ""}
                        {item.type && ` in ${item.type}`}
                      </Text>
                      <Text className="text-[11.5px] text-[#e5e5e5] leading-[18px] block whitespace-normal">
                        {item.institution || ""}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default HomeATS;
