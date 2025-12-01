import React from "react";
import { View, Text, Linking, TouchableOpacity } from "react-native";
import { useResumeData } from "app/context/ResumeContext";

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

  return (
    <View className="printColor w-full print:bg-[#313638] bg-[#313638] font-sans block [writing-mode:horizontal-tb] [text-orientation:mixed]">
      <View className="printColor print:bg-[#313638] max-w-screen-pdf w-full mx-auto box-border bg-[#313638] print:py-10 print:px-8 print:pt-10 block">
        {/* Header Section */}
        {header?.fullname && (
          <View className="mb-8 pb-5 pt-5 border-b border-b-[rgba(255,255,255,0.15)]">
            <Text className="text-4xl font-bold text-white mb-2 tracking-[-0.5px] block whitespace-normal">
              {header.fullname.toUpperCase()}
            </Text>
            {header.role && (
              <Text className="text-[15px] text-[#e5e5e5] font-normal block whitespace-normal">
                {header.role}
              </Text>
            )}
          </View>
        )}

        {/* Two Column Layout */}
        <View className="flex flex-row gap-10 [writing-mode:horizontal-tb] [text-orientation:mixed]">
          {/* Left Column - Main Content */}
          <View className="flex-1 min-w-0">
            {/* Summary Section */}
            {sidebar?.summarySection?.summary && (
              <View className="mb-3">
                <Text className="text-[15px] font-bold mb-2 uppercase tracking-[1px] text-[#c084fc] block whitespace-normal">
                  {sidebar.summarySection.label || "SUMMARY"}
                </Text>
                <Text className="text-[13px] text-white leading-[19px] text-justify block whitespace-normal">
                  {sidebar.summarySection.summary}
                </Text>
              </View>
            )}

            {/* Work Experience Section */}
            {content?.experienceSection?.items && content.experienceSection.items.length > 0 && (
              <View className="mb-7">
                <Text className="text-[15px] font-bold mb-2 mt-8 uppercase tracking-[1px] text-[#c084fc] block whitespace-normal">
                  {content.experienceSection.label || "PROFESSIONAL EXPERIENCE"}
                </Text>
                {content.experienceSection.items.map((item: any, idx: number) => {
                  const dateRange = formatDateRange(
                    item.experienceDates?.startDate,
                    item.experienceDates?.endDate,
                    item.experienceDates?.presentDate
                  );

                  return (
                    <View key={idx} className="mb-6">
                      {/* Job Title and Date */}
                      <View className="flex flex-row justify-between items-start mb-1 [writing-mode:horizontal-tb] [text-orientation:mixed]">
                        <Text className="text-sm font-bold text-white flex-1 block whitespace-normal break-normal">
                          {item.role || ""}
                        </Text>
                        {dateRange && (
                          <Text className="text-[11px] text-[#a0a0a0] ml-4 whitespace-nowrap inline-block">
                            {dateRange}
                          </Text>
                        )}
                      </View>
                      {/* Company */}
                      <Text className="text-[13px] text-white font-semibold mb-2 block whitespace-normal">
                        {item.company || ""}
                      </Text>
                      {/* Bullet Points (Duties) */}
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

            {/* Early Career Section */}
            {content?.earlyCareerExperienceSection?.items &&
              content.earlyCareerExperienceSection.items.length > 0 && (
                <View className="mb-7">
                  <Text className="text-[15px] font-bold mb-3.5 uppercase tracking-[1px] text-[#c084fc] block whitespace-normal">
                    {content.earlyCareerExperienceSection.label || "EARLY CAREER EXPERIENCE"}
                  </Text>
                  {content.earlyCareerExperienceSection.items.map((item: any, idx: number) => {
                    const dateRange = formatDateRange(
                      item.experienceDates?.startDate,
                      item.experienceDates?.endDate,
                      item.experienceDates?.presentDate
                    );

                    return (
                        <View key={idx} className="mb-8">
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

            {/* NGO Experience Section */}
            {content?.ngoExperienceSection?.items &&
              content.ngoExperienceSection.items.length > 0 && (
                <View className="mb-7">
                  <Text className="text-[15px] font-bold mb-3.5 uppercase tracking-[1px] text-[#c084fc] block whitespace-normal">
                    {content.ngoExperienceSection.label || "NGO EXPERIENCE"}
                  </Text>
                  {content.ngoExperienceSection.items.map((item: any, idx: number) => {
                    const dateRange = formatDateRange(
                      item.experienceDates?.startDate,
                      item.experienceDates?.endDate,
                      item.experienceDates?.presentDate
                    );

                    return (
                      <View key={idx} className="mb-8">
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

          {/* Right Column - Sidebar Content */}
          <View className="w-[290px] shrink-0 block [writing-mode:horizontal-tb]">
            {/* Contact Details */}
            {sidebar?.contactSection?.items && sidebar.contactSection.items.length > 0 && (
              <View className="mb-7">
                  <Text className="text-[15px] font-bold mb-2 uppercase tracking-[1px] text-[#c084fc] block whitespace-normal">
                    {sidebar.contactSection.label || "CONTACT DETAILS"}
                  </Text>
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
                  <Text className="text-[15px] font-bold mb-3.5 uppercase tracking-[1px] text-[#c084fc] block whitespace-normal">
                    {skillSection.label?.toUpperCase() || "SKILLS"}
                  </Text>
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
                  <Text className="text-[15px] font-bold mb-3.5 uppercase tracking-[1px] text-[#c084fc] block whitespace-normal">
                    CERTIFICATIONS
                  </Text>
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
                  <Text className="text-[15px] font-bold mb-3.5 uppercase tracking-[1px] text-[#c084fc] block whitespace-normal">
                    {content.educationSection.label || "EDUCATION"}
                  </Text>
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
