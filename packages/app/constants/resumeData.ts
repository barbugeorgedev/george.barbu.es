import { ResumeData } from "types/graphql";

export const defaultResumeData: ResumeData = {
  name: "",
  social: [],
  footer: "",
  sidebar: [
    {
      skillsSections: [],
      summarySection: { label: "Summary", summary: "" },
      contactSection: { label: "Contacts", items: [] },
    },
  ],
  header: [
    {
      fullname: "George Barbu",
      role: "Technical Solutions Leader",
      slogan: "Driving innovation through technical excellence.",
    },
  ],
  content: [
    {
      experienceSection: { label: "Experience", items: [] },
      earlyCareerExperienceSection: { label: "Early Career", items: [] },
      ngoExperienceSection: { label: "NGO Experience", items: [] },
      educationSection: { label: "Education", items: [] },
    },
  ],
  settings: [
    {
      homepage: true,
      settings: {
        template: "Default",
        themeSettings: {
          headerIconsColor: "#313638",
          mainBackground: "#525659",
          headerBackground: "#571926",
          headerTextColor: "#FFFFFF",
          sidebarBackground: "#313638",
          mainSectionBackground: "#FFFFFF",
          sidebarSectionTextColor: "#7f2437",
          sidebarTextColor: "#e5e5e5",
          mainTextColor: "#000000",
          mainSectionDotColor: "#571926",
          mainSectionLineColor: "#571926",
          mainSectionTextColor: "#571926",
          mainSectionPrimaryTextColor: "#571926",
          mainSectionSecondaryTextColor: "#232323",
          footerTextColor: "#313638",
          footerIconsColor: "#313638",
          footerLinkColor: "#571926",
        },
      },
    },
  ],
};
