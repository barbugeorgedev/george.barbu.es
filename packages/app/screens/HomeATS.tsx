import React from "react";
import { View, Text, Linking, TouchableOpacity, Platform } from "react-native";
import { useResumeData } from "app/context/ResumeContext";
import { AtsHiddenEmployerContext } from "app/components/AtsHiddenEmployerContext";

const MAX_BULLETS_PER_ROLE = 6;

/** Sanity / CMS may use mixed casing for `service` */
const normContactService = (s?: string) => String(s || "").toLowerCase().trim();

/** CMS contact row we treat as “website” so LinkedIn can follow it */
const isWebsiteContactRow = (item: { service?: string; label?: string }) =>
  normContactService(item.service) === "website" || /\bwebsite\b/i.test(item.label || "");

/** CMS skill group titled "AI" (or similar) — excluded from ATS skills block */
const isAiSkillsSection = (label?: string) => {
  const t = (label || "").trim();
  return /^ai$/i.test(t) || /^artificial intelligence$/i.test(t);
};

/**
 * ATS resume: single column, linear order, minimal chrome — optimized for parsers and quick scanning.
 */
export const HomeATS: React.FC = () => {
  const resumeData = useResumeData();
  const header = resumeData?.header?.[0];
  const sidebar = resumeData?.sidebar?.[0];
  const content = resumeData?.content?.[0];

  const allSkills = sidebar?.skillsSections || [];
  const skillBlocks = allSkills.filter(
    (s: { label?: string; items?: unknown[] }) =>
      s?.items && Array.isArray(s.items) && s.items.length > 0 && !isAiSkillsSection(s.label),
  );

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
    const svc = normContactService(service);
    if (svc === "email") return `mailto:${value}`;
    if (svc === "phone" || svc === "homephone") return `tel:${value}`;
    if (svc === "linkedin") return `https://linkedin.com/in/${value.replace(/^.*\//, "")}`;
    if (svc === "github") return `https://github.com/${value.replace(/^.*\//, "")}`;
    return value;
  };

  const companyDatesLine = (displayCompany: string, startDate?: string, endDate?: string, presentDate?: boolean) => {
    const range = formatDateRange(startDate, endDate, presentDate).trim();
    const parts = [displayCompany.trim(), range].filter(Boolean);
    return parts.join(" | ");
  };

  /**
   * One job role: strict DOM order for ATS + print/PDF (no flex reordering).
   * Web: native <section>/<h3>/<p>/<ul><li>; native: column stack, bullets without flex-row rows.
   */
  const renderExperienceRole = (
    reactKey: React.Key,
    roleTitle: string,
    metaLine: string,
    duties: string[] | undefined,
    marginClass: string,
    hiddenEmployerContext?: React.ReactNode,
  ) => {
    const bullets = (duties ?? []).filter(Boolean).slice(0, MAX_BULLETS_PER_ROLE);

    if (Platform.OS === "web") {
      return (
        <section
          key={reactKey}
          className={`experience-item ats-exp-role flex flex-col items-stretch ${marginClass} resume-avoid-break bi-avoid`}
        >
          <h3 className="text-base font-bold text-neutral-900">{roleTitle}</h3>
          {metaLine ? <p className="text-sm text-neutral-700 mt-0.5 mb-0">{metaLine}</p> : null}
          {bullets.length > 0 ? (
            <ul className="mt-2 list-disc pl-5 text-sm text-neutral-800 leading-6 space-y-1 [list-style-position:outside]">
              {bullets.map((duty, i) => (
                <li key={i} className="ps-1">
                  {duty}
                </li>
              ))}
            </ul>
          ) : null}
          {(hiddenEmployerContext ?? null) as any}
        </section>
      );
    }

    return (
      <View key={reactKey} className={`flex flex-col ${marginClass} resume-avoid-break bi-avoid`}>
        <Text role="heading" aria-level={3} className="text-base font-bold text-neutral-900">
          {roleTitle}
        </Text>
        {!!metaLine && <Text className="text-sm text-neutral-700 mt-0.5">{metaLine}</Text>}
        {bullets.length > 0 ? (
          <View className="mt-2" accessibilityRole="list">
            {bullets.map((duty, dIdx) => (
              <Text key={dIdx} className="text-sm text-neutral-800 leading-6 mb-1">
                {"\u2022 "}
                {duty}
              </Text>
            ))}
          </View>
        ) : null}
        {(hiddenEmployerContext ?? null) as any}
      </View>
    );
  };

  const renderGroupedExperience = (items: any[]) =>
    groupItemsByCompany(items).map(([companyKey, groupItems]) => {
      const displayCompany = companyKey.startsWith("__orphan_") ? "" : companyKey;

      if (groupItems.length === 1) {
        const item = groupItems[0]!;
        const meta = companyDatesLine(
          displayCompany,
          item.experienceDates?.startDate,
          item.experienceDates?.endDate,
          item.experienceDates?.presentDate,
        );
        return renderExperienceRole(companyKey, item.role || "", meta, item.duties, "mb-6", undefined);
      }

      const groupedRoles = groupItems.map((item: any, idx: number) => {
        const yStart = formatDate(item.experienceDates?.startDate) || "";
        const yEnd = item.experienceDates?.presentDate
          ? "Present"
          : formatDate(item.experienceDates?.endDate) || "";
        const roleRange =
          yStart && yEnd
            ? `${yStart} – ${yEnd}`
            : formatDateRange(
                item.experienceDates?.startDate,
                item.experienceDates?.endDate,
                item.experienceDates?.presentDate,
              );
        const meta =
          displayCompany && roleRange
            ? `${displayCompany} | ${roleRange}`
            : displayCompany || roleRange;

        const hidden =
          !!displayCompany && (
            <AtsHiddenEmployerContext
              employer={displayCompany}
              jobTitle={item.role || ""}
              dateRange={roleRange}
            />
          );

        return renderExperienceRole(idx, item.role || "", meta, item.duties, "", hidden);
      });

      if (Platform.OS === "web") {
        return (
          <div key={companyKey} className="mb-8 flex flex-col gap-6 w-full">
            {groupedRoles}
          </div>
        );
      }

      return (
        <View key={companyKey} className="mb-8 flex flex-col gap-6">
          {groupedRoles}
        </View>
      );
    });

  const headerTagline = header?.slogan?.trim() || header?.cvpurpose?.trim() || "";

  const sectionTitle = (label: string) => (
    <Text
      role="heading"
      aria-level={2}
      className="resume-section-title text-sm font-bold uppercase tracking-wide text-neutral-900 mb-3"
    >
      {label}
    </Text>
  );

  /** GET_RESUME puts `social` on `footer[]`, not top-level `social` */
  const linkedinFromSocial = (): string | null => {
    const rd = resumeData as typeof resumeData & {
      footer?: { social?: { service?: string; name?: string; url?: string }[] }[];
    };
    const entries: { service?: string; name?: string; url?: string }[] = [];
    const topSocial = (resumeData as { social?: { service?: string; name?: string; url?: string }[] })
      .social;
    if (Array.isArray(topSocial)) entries.push(...topSocial);
    if (Array.isArray(rd.footer)) {
      for (const block of rd.footer) {
        if (Array.isArray(block?.social)) entries.push(...block.social);
      }
    }
    const entry = entries.find((s) => {
      const svc = normContactService(s.service);
      const nm = String(s.name || "");
      return svc === "linkedin" || /linkedin/i.test(nm) || /linkedin\.com/i.test(s.url || "");
    });
    return entry?.url?.trim() || null;
  };

  const renderContactRows = () => {
    const raw = sidebar?.contactSection?.items || [];
    const itemsWithValue = raw.filter((item: any) => item.value);

    const linkedinCms = itemsWithValue.find((i: any) => normContactService(i.service) === "linkedin");
    const liFromSocial = !linkedinCms ? linkedinFromSocial() : null;
    type LiSource = { kind: "cms"; item: any } | { kind: "social"; url: string };
    const linkedinSource: LiSource | null = linkedinCms
      ? { kind: "cms", item: linkedinCms }
      : liFromSocial
        ? { kind: "social", url: liFromSocial }
        : null;

    const ordered = itemsWithValue.filter((i: any) => normContactService(i.service) !== "linkedin");
    const rows: React.ReactNode[] = [];
    let linkedinInserted = false;
    let rowKey = 0;
    const nextKey = () => rowKey++;

    const appendRowForItem = (item: any, key: React.Key) => {
      const svc = normContactService(item.service);
      const getLabel = () => {
        if (!item.showLabel) return "";
        if (item.label) return `${item.label}`;
        if (svc === "phone" || svc === "homephone") return "Phone: ";
        if (svc === "email") return "Email: ";
        if (svc === "location") return "Location: ";
        if (svc === "website") return "Website: ";
        if (svc === "linkedin") return "LinkedIn: ";
        if (svc === "github") return "GitHub: ";
        return "";
      };
      const label = getLabel();
      const url = getUrl(item.value, item.service);
      const isLink =
        svc === "email" ||
        svc === "phone" ||
        svc === "homephone" ||
        svc === "linkedin" ||
        svc === "github" ||
        svc === "website";

      const displayValue = svc === "linkedin" && url ? url : item.value;

      const row = (
        <Text className="text-sm text-neutral-800 leading-6 mb-1">
          {!!label && <Text className="font-semibold text-neutral-900">{label}</Text>}
          <Text className={`text-neutral-800 ${isLink ? "underline" : ""}`}>{displayValue}</Text>
        </Text>
      );

      if (isLink && url) {
        rows.push(
          <TouchableOpacity key={key} onPress={() => Linking.openURL(url)}>
            {row}
          </TouchableOpacity>,
        );
      } else {
        rows.push(<View key={key}>{row}</View>);
      }
    };

    const appendLinkedinAfterWebsite = () => {
      if (!linkedinSource || linkedinInserted) return;
      if (linkedinSource.kind === "cms") {
        appendRowForItem(linkedinSource.item, `linkedin-${nextKey()}`);
      } else {
        const url = linkedinSource.url;
        rows.push(
          <TouchableOpacity key={`linkedin-${nextKey()}`} onPress={() => Linking.openURL(url)}>
            <Text className="text-sm text-neutral-800 leading-6 mb-1">
              <Text className="font-semibold text-neutral-900">LinkedIn: </Text>
              <Text className="text-neutral-800 underline">{url}</Text>
            </Text>
          </TouchableOpacity>,
        );
      }
      linkedinInserted = true;
    };

    ordered.forEach((item: any) => {
      appendRowForItem(item, nextKey());
      if (isWebsiteContactRow(item)) {
        appendLinkedinAfterWebsite();
      }
    });

    if (linkedinSource && !linkedinInserted) {
      appendLinkedinAfterWebsite();
    }

    if (!rows.length) return null;
    return <View className="mt-4">{rows}</View>;
  };

  /** One SKILLS section: each CMS group is a single "Label: a, b, c" line */
  const renderMergedSkills = () => {
    if (!skillBlocks.length) return null;
    return (
      <View>
        {skillBlocks.map(
          (
            skillSection: { label?: string; items?: { title?: string; name?: string }[] },
            sectionIdx: number,
          ) => {
            const names = (skillSection.items || [])
              .map((item) => item.title || item.name)
              .filter(Boolean) as string[];
            if (!names.length) return null;
            const line = `${skillSection.label || "Skills"}: ${names.join(", ")}`;
            return (
              <Text key={sectionIdx} className="text-sm text-neutral-800 leading-6 mb-2">
                {line}
              </Text>
            );
          },
        )}
      </View>
    );
  };

  const educationOneLiner = () => {
    const eduItems = content?.educationSection?.items;
    if (!eduItems?.length) return null;
    const first = eduItems[0];
    if (!first) return null;
    const parts = [first.degree, first.type].filter((p: string | undefined) => !!p?.trim()) as string[];
    if (!parts.length) return null;
    return `Education: ${parts.join(" & ")}`;
  };

  const eduLine = educationOneLiner();

  const hasIntro =
    !!(header?.fullname || sidebar?.summarySection?.summary || skillBlocks.length > 0);

  return (
    <View className="ats-pdf-root printColor flex flex-col w-full bg-white font-sans [writing-mode:horizontal-tb] print:bg-white">
      <View className="ats-pdf-inner flex flex-col w-full max-w-screen-pdf mx-auto box-border bg-white print:bg-white print:px-[15mm] print:py-[12mm] px-4 py-6 md:px-8 md:py-8">
        {Platform.OS === "web" ? (
          <>
            {hasIntro ? (
              <div className="cv-intro-block flex w-full flex-col gap-10 box-border">
                {header?.fullname ? (
                  <View className="ats-pdf-header w-full shrink-0 pb-5 border-b border-neutral-200">
                    <Text role="heading" aria-level={1} className="text-3xl font-bold text-neutral-900">
                      {header.fullname}
                    </Text>
                    {header.role && <Text className="text-base text-neutral-700 mt-1">{header.role}</Text>}
                    {headerTagline ? (
                      <Text className="text-sm text-neutral-600 mt-2 leading-6">{headerTagline}</Text>
                    ) : null}
                    {renderContactRows()}
                  </View>
                ) : null}
                {sidebar?.summarySection?.summary ? (
                  <View className="ats-pdf-summary w-full shrink-0">
                    {sectionTitle(sidebar.summarySection.label || "Summary")}
                    <Text className="text-sm text-neutral-800 leading-6">{sidebar.summarySection.summary}</Text>
                  </View>
                ) : null}
                {skillBlocks.length > 0 ? (
                  <View>
                    {sectionTitle("Skills")}
                    {renderMergedSkills()}
                  </View>
                ) : null}
              </div>
            ) : null}

            {content?.experienceSection?.items && content.experienceSection.items.length > 0 ? (
              <section className="cv-experience ats-experience-section mt-10 w-full max-w-full box-border flex flex-col">
                <h2 className="resume-section-title text-sm font-bold uppercase tracking-wide text-neutral-900 mb-3">
                  {content.experienceSection.label || "Experience"}
                </h2>
                <div className="ats-experience-entries flex w-full flex-col">
                  {renderGroupedExperience(content.experienceSection.items)}
                </div>
              </section>
            ) : null}

            {content?.earlyCareerExperienceSection?.items &&
            content.earlyCareerExperienceSection.items.length > 0 ? (
              <section className="cv-experience ats-experience-section mt-8 w-full max-w-full box-border flex flex-col">
                <h2 className="resume-section-title text-sm font-bold uppercase tracking-wide text-neutral-900 mb-3">
                  {content.earlyCareerExperienceSection.label || "Early career"}
                </h2>
                <div className="ats-experience-entries flex w-full flex-col">
                  {renderGroupedExperience(content.earlyCareerExperienceSection.items)}
                </div>
              </section>
            ) : null}

            {eduLine ? (
              <View className="mt-10">
                <Text className="text-sm text-neutral-800 leading-6">{eduLine}</Text>
              </View>
            ) : null}
          </>
        ) : (
          <>
            {header?.fullname && (
              <View className="ats-pdf-header w-full shrink-0 pb-5 border-b border-neutral-200">
                <Text role="heading" aria-level={1} className="text-3xl font-bold text-neutral-900">
                  {header.fullname}
                </Text>
                {header.role && <Text className="text-base text-neutral-700 mt-1">{header.role}</Text>}
                {headerTagline ? (
                  <Text className="text-sm text-neutral-600 mt-2 leading-6">{headerTagline}</Text>
                ) : null}
                {renderContactRows()}
              </View>
            )}

            {sidebar?.summarySection?.summary && (
              <View className="ats-pdf-summary w-full shrink-0 mt-10">
                {sectionTitle(sidebar.summarySection.label || "Summary")}
                <Text className="text-sm text-neutral-800 leading-6">{sidebar.summarySection.summary}</Text>
              </View>
            )}

            {skillBlocks.length > 0 && (
              <View className="mt-10">
                {sectionTitle("Skills")}
                {renderMergedSkills()}
              </View>
            )}

            {content?.experienceSection?.items && content.experienceSection.items.length > 0 && (
              <View className="mt-10">
                {sectionTitle(content.experienceSection.label || "Experience")}
                {renderGroupedExperience(content.experienceSection.items)}
              </View>
            )}

            {content?.earlyCareerExperienceSection?.items &&
              content.earlyCareerExperienceSection.items.length > 0 && (
                <View className="mt-8">
                  {sectionTitle(content.earlyCareerExperienceSection.label || "Early career")}
                  {renderGroupedExperience(content.earlyCareerExperienceSection.items)}
                </View>
              )}

            {eduLine && (
              <View className="mt-10">
                <Text className="text-sm text-neutral-800 leading-6">{eduLine}</Text>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default HomeATS;
