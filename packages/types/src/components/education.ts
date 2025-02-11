export interface EducationProps {
  className?: string;
  data: EducationData; // data is an array
}

interface EducationItem {
  institution: string;
  degree: string;
  type: string;
  certifications: string[];
}

export interface EducationData {
  label: string;
  items: EducationItem[];
}
