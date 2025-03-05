interface ExperienceItem {
  certifications: string[];
  institution: string | undefined;
  degree: string;
  type: string;
  company?: string;
  role: string;
  experienceDates: {
    startDate?: string;
    endDate?: string;
    presentDate?: boolean;
  };
  duties: string[];
  skills: { title: string }[];
}

interface ExperienceData {
  label: string;
  items: ExperienceItem[];
}

export interface ContactItem {
  service: string;
  value: string;
}

export interface ContactProps {
  data: {
    label: string;
    items: ContactItem[];
  };
  className?: string;
}

export interface ThemeSettings {
  headerIconsColor?: string;
  mainBackground?: string;
  headerBackground?: string;
  headerTextColor?: string;
  sidebarBackground?: string;
  mainSectionBackground?: string;
  sidebarSectionTextColor?: string;
  sidebarTextColor?: string;
  mainTextColor?: string;
  mainSectionDotColor?: string;
  mainSectionLineColor?: string;
  mainSectionTextColor?: string;
  mainSectionPrimaryTextColor?: string;
  mainSectionSecondaryTextColor?: string;
  footerTextColor?: string;
  footerIconsColor?: string;
  footerLinkColor?: string;
}

export interface Settings {
  homepage: boolean;
  settings: {
    template: string;
    themeSettings: ThemeSettings;
  };
}

export interface PageData {
  slug: {
    current: string;
    source: string;
  };
}

export interface ResumeData {
  page: PageData;
  content: {
    experienceSection?: ExperienceData;
    earlyCareerExperienceSection?: ExperienceData;
    ngoExperienceSection?: ExperienceData;
    educationSection?: ExperienceData;
  }[];
  header: { fullname?: string; role?: string; slogan?: string }[];
  sidebar: {
    skillsSections?: any[];
    summarySection?: { label: string; summary: string };
    contactSection?: { label: string; items: ContactItem[] };
  }[];
  name: string;
  social: { name: string; url: string }[];
  footer: string;
  settings: Settings[];
}
