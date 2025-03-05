import { useResumeData } from "app/context/ResumeContext";
import { PageData } from "types/graphql";

export const usePage = (): PageData | undefined => {
  const resumeData = useResumeData();
  return resumeData?.page?.[0];
};
