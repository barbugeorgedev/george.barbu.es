export interface ExperienceDates {
  startDate: string;
  endDate?: string;
  presentDate: boolean;
}

export interface ExperienceItem {
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
