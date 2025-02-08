export interface NetworkCheckProps {
  title?: string;
  tryAgain?: string;
}

export interface Resume {
  cvpurpose: string;
  fullname: string;
  role: string;
  slogan: string;
}

export interface ResumeData {
  allResume: Resume[];
}
