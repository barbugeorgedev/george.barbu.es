export interface ExperienceProps {
  className?: string;
  data: ExperienceData;
}

export interface ExperienceItem {
  company: string;
  role: string;
  experienceDates: ExperienceDates;
  duties: string[];
}

interface ExperienceDates {
  startDate: string; // Now required
  endDate?: string;
  presentDate: boolean;
}

export interface ExperienceData {
  label: string;
  items: ExperienceItem[];
  footer?: { social?: any[] }[];
  header?: { text?: { fullname?: string; role?: string; slogan?: string } }[];
  sidebar?: {
    skillsSections?: any[];
    summarySection?: { label: string; summary: string };
    contactSection?: { label: string; items: any[] };
  };
  content?: {
    // Change from an array to an object
    experienceSection?: { label: string; items: any[] };
    earlyCareerExperienceSection?: { label: string; items: any[] };
    ngoExperienceSection?: {
      label: string;
      items: {
        company: string;
        role: string;
        experienceDates?: {
          startDate?: string;
          endDate?: string;
          presentDate?: boolean;
        };
        duties: string[];
      }[];
    };
    educationSection?: {
      label: string;
      items: {
        institution: string;
        degree: string;
        type?: string;
        certifications: string[];
      }[];
    };
  };
}
