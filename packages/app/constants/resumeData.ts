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
          headerIconsColor: { hex: "#313638" },
          mainBackground: { hex: "#525659" },
          headerBackground: { hex: "#571926" },
          headerTextColor: { hex: "#FFFFFF" },
          sidebarBackground: { hex: "#313638" },
          mainSectionBackground: { hex: "#FFFFFF" },
          sidebarSectionTextColor: { hex: "#7f2437" },
          sidebarTextColor: { hex: "#e5e5e5" },
          mainTextColor: { hex: "#000000" },
          mainSectionDotColor: { hex: "#571926" },
          mainSectionLineColor: { hex: "#571926" },
          mainSectionTextColor: { hex: "#571926" },
          mainSectionPrimaryTextColor: { hex: "#571926" },
          mainSectionSecondaryTextColor: { hex: "#232323" },
          footerTextColor: { hex: "#313638" },
          footerIconsColor: { hex: "#313638" },
          footerLinkColor: { hex: "#571926" },
        },
      },
    },
  ],
  page: {
    slug: {
      current: "/",
      source: "",
    },
  },
};
