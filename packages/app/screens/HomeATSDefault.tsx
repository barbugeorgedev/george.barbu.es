import React from "react";
import { View, Text, Platform, Linking, TouchableOpacity } from "react-native";
import { useResumeData } from "app/context/ResumeContext";
import { useSettings } from "app/hooks/useSettings";
import { AtsHiddenEmployerContext } from "app/components/AtsHiddenEmployerContext";

/** DOCX v3 includes 7+ bullets for some roles */
const MAX_BULLETS_PER_ROLE = 24;

const normContactService = (s?: string) => String(s || "").toLowerCase().trim();

const isWebsiteContactRow = (item: { service?: string; label?: string }) =>
  normContactService(item.service) === "website" || /\bwebsite\b/i.test(item.label || "");

/** CMS may use another service than `website` for the personal / portfolio URL. */
const isPersonalSiteContactRow = (item: { service?: string; label?: string }) => {
  const svc = normContactService(item.service);
  if (["website", "personal", "portfolio", "homepage", "url"].includes(svc)) return true;
  const lb = (item.label || "").toLowerCase();
  if (/\bwebsite\b/.test(lb) || /\bportfolio\b/.test(lb) || /\bhomepage\b/.test(lb)) return true;
  if (/\bpersonal\b/.test(lb) && /\bsite\b/.test(lb)) return true;
  return false;
};

const looksLikeBareHostname = (value: string) => {
  const v = value.trim();
  if (!v || v.includes("@") || /\s/.test(v)) return false;
  if (/^www\./i.test(v)) return true;
  return /^[a-z0-9]([a-z0-9.-]*[a-z0-9])?\.[a-z]{2,}(\/[^\s]*)?$/i.test(v);
};

const isLanguagesSection = (label?: string) => /^languages?$/i.test((label || "").trim());

/** ATS: category line reads "Frontend: …" — don’t double if CMS already ends with ":" */
const skillLabelWithColon = (label: string) => {
  const t = (label || "Skills").trim();
  return /:\s*$/.test(t) ? t : `${t}:`;
};

/** "English — C1 — Professional …" → name + level (DOCX v3 languages table). */
const splitLanguageTitle = (title: string): { name: string; level: string } => {
  const t = title.trim();
  const m = t.match(/^(.+?)\s+[—–\-]\s+(.+)$/);
  if (!m) return { name: t, level: "" };
  return { name: m[1]!.trim(), level: m[2]!.trim() };
};

/**
 * Default ATS (`/ats`, `/{slug}-ats`): aligned with Frontend-Platform-Lead v3 DOCX — section rules,
 * name uppercase, role · company row, skills/languages grid, education + certs, NGO. Accent from theme.
 */
export const HomeATSDefault: React.FC = () => {
  const resumeData = useResumeData();
  const settings = useSettings();
  const accent = settings?.mainSectionSecondaryTextColor?.hex ?? "#232323";
  const metaColor = "#525252";

  const header = resumeData?.header?.[0];
  const sidebar = resumeData?.sidebar?.[0];
  const content = resumeData?.content?.[0];

  const allSkills = sidebar?.skillsSections || [];
  const skillBlocks = allSkills.filter(
    (s: { label?: string; items?: unknown[] }) =>
      s?.items && Array.isArray(s.items) && s.items.length > 0 && !isLanguagesSection(s.label),
  );
  const languageBlocks = allSkills.filter(
    (s: { label?: string; items?: unknown[] }) =>
      s?.items && Array.isArray(s.items) && s.items.length > 0 && isLanguagesSection(s.label),
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

  const getContactHref = (value?: string, service?: string, label?: string) => {
    if (!value) return "";
    const v = value.trim();
    if (v.startsWith("http://") || v.startsWith("https://")) return v;
    const svc = normContactService(service);
    if (svc === "email") return `mailto:${v}`;
    if (svc === "phone" || svc === "homephone") return `tel:${v}`;
    if (svc === "linkedin") return `https://linkedin.com/in/${v.replace(/^.*\//, "")}`;
    if (svc === "github") return `https://github.com/${v.replace(/^.*\//, "")}`;
    const siteRow = { service, label };
    if (
      isPersonalSiteContactRow(siteRow) &&
      !/^https?:\/\//i.test(v) &&
      (looksLikeBareHostname(v) || /^www\./i.test(v))
    ) {
      return `https://${v.replace(/^\/+/, "")}`;
    }
    return v;
  };

  const contactHrefIsActionable = (href: string) =>
    /^mailto:|^tel:|^https?:\/\//i.test(href.trim());

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

  type ContactSeg = { key: string; display: string; href: string | null };

  /** One-line contact, pipe-separated; link-capable where CMS service implies URL (same rules as HomeATS). */
  const buildContactSegments = (): ContactSeg[] => {
    const raw = sidebar?.contactSection?.items || [];
    const itemsWithValue = raw.filter((item: { value?: string }) => item.value);
    const linkedinCms = itemsWithValue.find((i: { service?: string }) => normContactService(i.service) === "linkedin");
    const liFromSocial = !linkedinCms ? linkedinFromSocial() : null;
    const ordered = itemsWithValue.filter((i: { service?: string }) => normContactService(i.service) !== "linkedin");
    const segs: ContactSeg[] = [];
    let linkedinInserted = false;
    let segKey = 0;
    const nextKey = () => `c-${segKey++}`;

    const pushSeg = (display: string, href: string | null) => {
      const d = display.trim();
      if (!d) return;
      segs.push({ key: nextKey(), display: d, href: href && href.length ? href : null });
    };

    const pushLinkedin = () => {
      if (linkedinInserted) return;
      if (linkedinCms?.value) {
        const url = getContactHref(linkedinCms.value, linkedinCms.service, linkedinCms.label);
        const display =
          contactHrefIsActionable(url) && normContactService(linkedinCms.service) === "linkedin"
            ? url
            : String(linkedinCms.value);
        pushSeg(display, contactHrefIsActionable(url) ? url : null);
      } else if (liFromSocial) {
        pushSeg(liFromSocial, liFromSocial);
      }
      linkedinInserted = true;
    };

    ordered.forEach((item: { service?: string; value?: string; label?: string }) => {
      const svc = normContactService(item.service);
      const href = getContactHref(item.value, item.service, item.label);
      const actionable = contactHrefIsActionable(href);
      const display =
        svc === "linkedin" && actionable ? href : String(item.value);
      pushSeg(display, actionable ? href : null);
      if (isWebsiteContactRow(item) || isPersonalSiteContactRow(item)) pushLinkedin();
    });
    if (!linkedinInserted && (linkedinCms || liFromSocial)) pushLinkedin();

    return segs;
  };

  const headerTagline = header?.slogan?.trim() || header?.cvpurpose?.trim() || "";
  const contactSegments = buildContactSegments();

  const sectionHeading = (label: string) =>
    Platform.OS === "web" ? (
      <h2
        className="resume-section-title text-sm font-bold uppercase tracking-wide mb-3 pb-2 border-b border-neutral-300"
        style={{ color: accent }}
      >
        {label}
      </h2>
    ) : (
      <Text
        role="heading"
        aria-level={2}
        className="text-sm font-bold uppercase tracking-wide mb-3 pb-2 border-b border-neutral-300"
        style={{ color: accent }}
      >
        {label}
      </Text>
    );

  const stackLine = (skills?: { title?: string }[]) => {
    const titles = (skills || []).map((x) => x.title).filter(Boolean) as string[];
    if (!titles.length) return null;
    if (Platform.OS === "web") {
      return (
        <p className="text-sm text-neutral-800 mt-2 mb-0 leading-6">
          <span className="font-semibold text-neutral-900">Stack: </span>
          {titles.join(", ")}
        </p>
      );
    }
    return (
      <Text className="text-sm text-neutral-800 mt-2 leading-6">
        <Text className="font-semibold text-neutral-900">Stack: </Text>
        {titles.join(", ")}
      </Text>
    );
  };

  const renderExperienceRoleWeb = (
    reactKey: React.Key,
    roleTitle: string,
    companyDisplay: string,
    dateRange: string,
    duties: string[] | undefined,
    skills: { title?: string }[] | undefined,
    marginClass: string,
    hiddenEmployerContext?: React.ReactNode,
  ) => {
    const bullets = (duties ?? []).filter(Boolean).slice(0, MAX_BULLETS_PER_ROLE);
    return (
      <section
        key={reactKey}
        className={`experience-item ats-default-exp-item flex flex-col items-stretch ${marginClass} resume-avoid-break bi-avoid`}
      >
        <div className="flex flex-row justify-between gap-4 items-start w-full">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-neutral-900 leading-snug m-0">
              {roleTitle}
              {companyDisplay ? (
                <>
                  <span className="text-neutral-900 font-bold">{"  ·  "}</span>
                  <span className="font-bold" style={{ color: accent }}>
                    {companyDisplay}
                  </span>
                </>
              ) : null}
            </h3>
          </div>
          {dateRange ? (
            <p className="text-sm shrink-0 text-right m-0 leading-snug" style={{ color: metaColor }}>
              {dateRange}
            </p>
          ) : null}
        </div>
        {bullets.length > 0 ? (
          <ul className="mt-2 list-disc pl-5 text-sm text-neutral-800 leading-6 space-y-1 [list-style-position:outside]">
            {bullets.map((duty, i) => (
              <li key={i} className="ps-1">
                {duty}
              </li>
            ))}
          </ul>
        ) : null}
        {stackLine(skills)}
        {(hiddenEmployerContext ?? null) as React.ReactNode}
      </section>
    );
  };

  const renderExperienceRoleNative = (
    reactKey: React.Key,
    roleTitle: string,
    companyDisplay: string,
    dateRange: string,
    duties: string[] | undefined,
    skills: { title?: string }[] | undefined,
    marginClass: string,
    hiddenEmployerContext?: React.ReactNode,
  ) => {
    const bullets = (duties ?? []).filter(Boolean).slice(0, MAX_BULLETS_PER_ROLE);
    return (
      <View key={reactKey} className={`flex flex-col ${marginClass} resume-avoid-break bi-avoid`}>
        <Text className="text-base font-bold text-neutral-900 leading-snug">
          {roleTitle}
          {companyDisplay ? (
            <Text>
              <Text className="text-neutral-900 font-bold">{"  ·  "}</Text>
              <Text className="font-bold" style={{ color: accent }}>
                {companyDisplay}
              </Text>
            </Text>
          ) : null}
        </Text>
        {!!dateRange && (
          <Text className="text-sm mt-0.5" style={{ color: metaColor }}>
            {dateRange}
          </Text>
        )}
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
        {stackLine(skills)}
        {(hiddenEmployerContext ?? null) as React.ReactNode}
      </View>
    );
  };

  const renderGroupedExperience = (items: any[]) =>
    groupItemsByCompany(items).map(([companyKey, groupItems]) => {
      const displayCompany = companyKey.startsWith("__orphan_") ? "" : companyKey;

      if (groupItems.length === 1) {
        const item = groupItems[0]!;
        const range = formatDateRange(
          item.experienceDates?.startDate,
          item.experienceDates?.endDate,
          item.experienceDates?.presentDate,
        );
        if (Platform.OS === "web") {
          return renderExperienceRoleWeb(
            companyKey,
            item.role || "",
            displayCompany,
            range,
            item.duties,
            item.skills,
            "mb-6",
            undefined,
          );
        }
        return renderExperienceRoleNative(
          companyKey,
          item.role || "",
          displayCompany,
          range,
          item.duties,
          item.skills,
          "mb-6",
          undefined,
        );
      }

      const grouped = groupItems.map((item: any, idx: number) => {
        const yStart = formatDate(item.experienceDates?.startDate) || "";
        const yEnd = item.experienceDates?.presentDate
          ? "Present"
          : formatDate(item.experienceDates?.endDate) || "";
        const roleRange = yStart && yEnd ? `${yStart} – ${yEnd}` : "";
        const hidden =
          !!displayCompany && (
            <AtsHiddenEmployerContext employer={displayCompany} jobTitle={item.role || ""} dateRange={roleRange} />
          );
        if (Platform.OS === "web") {
          return renderExperienceRoleWeb(
            idx,
            item.role || "",
            displayCompany,
            roleRange,
            item.duties,
            item.skills,
            idx === 0 ? "mb-6" : "mb-6 mt-2",
            hidden,
          );
        }
        return renderExperienceRoleNative(
          idx,
          item.role || "",
          displayCompany,
          roleRange,
          item.duties,
          item.skills,
          idx === 0 ? "mb-6" : "mb-6 mt-2",
          hidden,
        );
      });

      if (Platform.OS === "web") {
        return (
          <div key={companyKey} className="mb-8 flex flex-col w-full">
            {grouped}
          </div>
        );
      }
      return (
        <View key={companyKey} className="mb-8 flex flex-col">
          {grouped}
        </View>
      );
    });

  const renderSkillTableRows = (
    blocks: { label?: string; items?: { title?: string; name?: string }[] }[],
    keyPrefix: string,
  ) => {
    if (!blocks.length) return null;
    return blocks.map(
      (skillSection: { label?: string; items?: { title?: string; name?: string }[] }, sectionIdx: number) => {
        const names = (skillSection.items || [])
          .map((item) => item.title || item.name)
          .filter(Boolean) as string[];
        if (!names.length) return null;
        const label = skillLabelWithColon(skillSection.label || "Skills");
        const k = `${keyPrefix}-${sectionIdx}`;
        if (Platform.OS === "web") {
          return (
            <div
              key={k}
              className="grid grid-cols-[minmax(10.5rem,auto)_1fr] gap-x-6 gap-y-1 mb-2 items-start"
            >
              <span className="text-sm font-bold text-neutral-900">{label}</span>
              <span className="text-sm text-neutral-800 leading-6">{names.join(", ")}</span>
            </div>
          );
        }
        return (
          <View key={k} className="flex flex-row gap-6 mb-2 items-start">
            <Text className="text-sm font-bold text-neutral-900 w-[168px] shrink-0">{label}</Text>
            <Text className="text-sm text-neutral-800 leading-6 flex-1">{names.join(", ")}</Text>
          </View>
        );
      },
    );
  };

  const renderLanguageRows = (
    blocks: { label?: string; items?: { title?: string; name?: string }[] }[],
  ) => {
    const rows: { name: string; level: string }[] = [];
    for (const block of blocks) {
      for (const item of block.items || []) {
        const raw = (item.title || item.name || "").trim();
        if (!raw) continue;
        rows.push(splitLanguageTitle(raw));
      }
    }
    if (!rows.length) return null;
    return rows.map((row, idx) => {
      const k = `lang-row-${idx}`;
      if (Platform.OS === "web") {
        return (
          <div
            key={k}
            className="grid grid-cols-[minmax(10.5rem,auto)_1fr] gap-x-6 gap-y-1 mb-2 items-start"
          >
            <span className="text-sm font-bold text-neutral-900">{row.name}</span>
            <span className="text-sm text-neutral-800 leading-6">{row.level}</span>
          </div>
        );
      }
      return (
        <View key={k} className="flex flex-row gap-6 mb-2 items-start">
          <Text className="text-sm font-bold text-neutral-900 w-[168px] shrink-0">{row.name}</Text>
          <Text className="text-sm text-neutral-800 leading-6 flex-1">{row.level}</Text>
        </View>
      );
    });
  };

  return (
    <View className="ats-default-pdf-root printColor flex flex-col w-full bg-white font-sans [writing-mode:horizontal-tb] print:bg-white">
      <View className="ats-default-pdf-inner flex flex-col w-full max-w-[820px] mx-auto box-border bg-white print:bg-white print:px-[15mm] print:py-[12mm] px-4 py-6 md:px-8 md:py-8">
        {header?.fullname ? (
          <View className="ats-default-pdf-header w-full shrink-0 pb-5 border-b border-neutral-200 mb-8">
            {Platform.OS === "web" ? (
              <h1 className="text-3xl font-bold text-neutral-950 tracking-tight m-0 uppercase">
                {header.fullname}
              </h1>
            ) : (
              <Text
                role="heading"
                aria-level={1}
                className="text-3xl font-bold text-neutral-950 tracking-tight uppercase"
              >
                {header.fullname}
              </Text>
            )}
            {header.role ? (
              <Text className="text-base font-bold mt-2 leading-snug" style={{ color: accent }}>
                {header.role}
              </Text>
            ) : null}
            {headerTagline ? (
              <Text className="text-sm mt-2 leading-6" style={{ color: metaColor }}>
                {headerTagline}
              </Text>
            ) : null}
            {contactSegments.length > 0 ? (
              Platform.OS === "web" ? (
                <p className="text-sm mt-4 mb-0 leading-6" style={{ color: metaColor }}>
                  {contactSegments.map((seg, i) => (
                    <React.Fragment key={seg.key}>
                      {i > 0 ? <span>{"  |  "}</span> : null}
                      {seg.href ? (
                        <a
                          href={seg.href}
                          className="underline underline-offset-2 decoration-neutral-500 hover:opacity-80 text-inherit"
                          {...(seg.href.startsWith("http")
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                        >
                          {seg.display}
                        </a>
                      ) : (
                        <span>{seg.display}</span>
                      )}
                    </React.Fragment>
                  ))}
                </p>
              ) : (
                <View className="flex-row flex-wrap mt-4 items-center">
                  {contactSegments.map((seg, i) => (
                    <React.Fragment key={seg.key}>
                      {i > 0 ? (
                        <Text className="text-sm" style={{ color: metaColor }}>
                          {"  |  "}
                        </Text>
                      ) : null}
                      {seg.href ? (
                        <TouchableOpacity onPress={() => Linking.openURL(seg.href!)} accessibilityRole="link">
                          <Text
                            className="text-sm underline"
                            style={{ color: metaColor }}
                          >
                            {seg.display}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <Text className="text-sm" style={{ color: metaColor }}>
                          {seg.display}
                        </Text>
                      )}
                    </React.Fragment>
                  ))}
                </View>
              )
            ) : null}
          </View>
        ) : null}

        {sidebar?.summarySection?.summary ? (
          <View className="w-full shrink-0 mb-8">
            {sectionHeading((sidebar.summarySection.label || "Summary").toUpperCase())}
            <Text className="text-sm text-neutral-800 leading-6">{sidebar.summarySection.summary}</Text>
          </View>
        ) : null}

        {content?.experienceSection?.items && content.experienceSection.items.length > 0 ? (
          <View className="cv-experience ats-default-experience-section w-full max-w-full box-border flex flex-col mb-2">
            {sectionHeading((content.experienceSection.label || "Professional experience").toUpperCase())}
            <View className="flex w-full flex-col">{renderGroupedExperience(content.experienceSection.items)}</View>
          </View>
        ) : null}

        {content?.earlyCareerExperienceSection?.items &&
        content.earlyCareerExperienceSection.items.length > 0 ? (
          <View className="cv-experience ats-default-experience-section w-full max-w-full box-border flex flex-col mt-8 mb-2">
            {sectionHeading((content.earlyCareerExperienceSection.label || "Early career").toUpperCase())}
            <View className="flex w-full flex-col">
              {renderGroupedExperience(content.earlyCareerExperienceSection.items)}
            </View>
          </View>
        ) : null}

        {skillBlocks.length > 0 ? (
          <View className="w-full mt-8 mb-2">
            {sectionHeading("Skills")}
            {renderSkillTableRows(skillBlocks, "sk")}
          </View>
        ) : null}

        {content?.educationSection?.items && content.educationSection.items.length > 0 ? (
          <View className="w-full mt-8 mb-2">
            {sectionHeading((content.educationSection.label || "Education & certifications").toUpperCase())}
            {content.educationSection.items.map((item: any, idx: number) => {
              const eduBits = [item.degree, item.type, item.institution].filter(
                (p: string | undefined) => p && String(p).trim(),
              ) as string[];
              const primaryLine = eduBits.join("  ·  ");
              const certs = (item.certifications || []).filter((c: string) => c?.trim());
              return (
                <View key={idx} className={idx > 0 ? "mt-4" : ""}>
                  {primaryLine ? (
                    <Text className="text-sm font-bold text-neutral-900 leading-6">{primaryLine}</Text>
                  ) : null}
                  {certs.map((cert: string, cIdx: number) => (
                    <Text
                      key={cIdx}
                      className={`text-sm text-neutral-800 leading-6 ${
                        primaryLine ? (cIdx === 0 ? "mt-1.5" : "mt-1") : cIdx > 0 ? "mt-1" : ""
                      }`}
                    >
                      {cert}
                    </Text>
                  ))}
                </View>
              );
            })}
          </View>
        ) : null}

        {languageBlocks.length > 0 ? (
          <View className="w-full mt-8 mb-2">
            {sectionHeading((languageBlocks[0]?.label || "Languages").toUpperCase())}
            {renderLanguageRows(languageBlocks)}
          </View>
        ) : null}

        {content?.ngoExperienceSection?.items && content.ngoExperienceSection.items.length > 0 ? (
          <View className="w-full mt-8 mb-2">
            {sectionHeading((content.ngoExperienceSection.label || "Leadership").toUpperCase())}
            <View className="flex w-full flex-col">{renderGroupedExperience(content.ngoExperienceSection.items)}</View>
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default HomeATSDefault;
