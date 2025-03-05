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
  headerIconsColor?: {
    hex: string;
  };
  mainBackground?: {
    hex: string;
  };
  headerBackground?: {
    hex: string;
  };
  headerTextColor?: {
    hex: string;
  };
  sidebarBackground?: {
    hex: string;
  };
  mainSectionBackground?: {
    hex: string;
  };
  sidebarSectionTextColor?: {
    hex: string;
  };
  sidebarTextColor?: {
    hex: string;
  };
  mainTextColor?: {
    hex: string;
  };
  mainSectionDotColor?: {
    hex: string;
  };
  mainSectionLineColor?: {
    hex: string;
  };
  mainSectionTextColor?: {
    hex: string;
  };
  mainSectionPrimaryTextColor?: {
    hex: string;
  };
  mainSectionSecondaryTextColor?: {
    hex: string;
  };
  footerTextColor?: {
    hex: string;
  };
  footerIconsColor?: {
    hex: string;
  };
  footerLinkColor?: {
    hex: string;
  };
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
