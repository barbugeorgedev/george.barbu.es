import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import DefaultComponentProps from "types/components";
import { ProjectItem } from "types/graphql";
import { useResumeData } from "app/context/ResumeContext";
import { useSettings } from "app/hooks/useSettings";

/**
 * Which `project` documents reach the CV, in display order.
 *
 * The CMS holds nine; the rest are WordPress/Divi/Elementor builds that read as
 * agency work next to a senior React rate, so they stay in Sanity but off the
 * page. There is no `featured` field on the schema to drive this from the
 * Studio — add one and this list can go.
 */
const PROMOTED_PROJECTS = [
  "liceul-luca-app",
  "echo404studios.com",
  "george.barbu.es",
  "marketing-website-exp",
];

const MAX_TECHNOLOGIES = 8;
const MAX_SUMMARY_CHARS = 180;

/**
 * `objective` is written as a full case-study paragraph in the CMS. Four of
 * those would fill half a page, so take the first sentence and hard-cap it.
 */
function summarise(objective?: string): string {
  const text = (objective ?? "").trim().replace(/\s+/g, " ");
  if (!text) return "";

  const sentenceEnd = text.search(/\.(\s|$)/);
  const firstSentence =
    sentenceEnd > 0 ? text.slice(0, sentenceEnd + 1) : text;
  if (firstSentence.length <= MAX_SUMMARY_CHARS) return firstSentence;

  const clipped = firstSentence.slice(0, MAX_SUMMARY_CHARS);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${(lastSpace > 0 ? clipped.slice(0, lastSpace) : clipped).replace(/[,;:]$/, "")}…`;
}

function withProtocol(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

/** Store listings first — an app a reader can install is the strongest proof here. */
function linksFor(project: ProjectItem): { label: string; url: string }[] {
  const links: { label: string; url: string }[] = [];
  if (project.appStoreLink) links.push({ label: "App Store", url: project.appStoreLink });
  if (project.playStoreLink) links.push({ label: "Google Play", url: project.playStoreLink });
  if (project.website) links.push({ label: "Live", url: project.website });
  for (const link of project.customLinks ?? []) {
    if (link?.url && link?.label) links.push({ label: link.label, url: link.url });
  }
  return links;
}

const Projects: React.FC<DefaultComponentProps> = ({ className }) => {
  const settings = useSettings();
  const resumeData = useResumeData();

  const all = resumeData?.projects ?? [];
  const projects = PROMOTED_PROJECTS.map((slug) =>
    all.find((p) => p?.slug?.current === slug),
  ).filter((p): p is ProjectItem => Boolean(p));

  if (projects.length === 0) return null;

  return (
    <View className={className ?? ""}>
      <Text
        className="resume-section-title uppercase font-['Norwester'] text-xl mb-4"
        style={{ color: settings?.mainSectionTextColor?.hex }}
      >
        Selected projects
      </Text>

      {projects.map((project, index) => {
        const links = linksFor(project);
        const technologies = (project.technologies ?? [])
          .filter(Boolean)
          .slice(0, MAX_TECHNOLOGIES);
        const summary = summarise(project.objective);

        return (
          <View className="mb-5" key={project.slug?.current ?? index}>
            <Text
              className="font-['MontserratSemiBold'] text-[0.8rem] leading-5"
              style={{ color: settings?.mainSectionPrimaryTextColor?.hex }}
            >
              {project.title}
              {project.client?.name ? ` — ${project.client.name}` : ""}
            </Text>

            {technologies.length > 0 && (
              <Text
                className="font-['Lato'] text-[0.65rem] leading-4 mt-1"
                style={{ color: settings?.mainSectionSecondaryTextColor?.hex }}
              >
                {technologies.join(" · ")}
              </Text>
            )}

            {summary ? (
              <Text
                className="font-['Lato'] text-[0.70rem] leading-4 mt-1"
                style={{ color: settings?.mainSectionSecondaryTextColor?.hex }}
              >
                {summary}
              </Text>
            ) : null}

            {links.length > 0 && (
              <View className="flex flex-row flex-wrap mt-1">
                {links.map((link, i) => (
                  <TouchableOpacity
                    key={i}
                    className="mr-3"
                    onPress={() => Linking.openURL(withProtocol(link.url))}
                  >
                    <Text
                      className="font-['LatoBlack'] text-[0.65rem] leading-4 underline"
                      style={{ color: settings?.mainSectionTextColor?.hex }}
                    >
                      {link.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

export default Projects;
