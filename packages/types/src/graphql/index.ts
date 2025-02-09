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
}

interface ExperienceData {
  label: string;
  items: ExperienceItem[];
}

interface ExperienceProps {
  className?: string;
  data: ExperienceData;
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

export interface ResumeData {
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
}
