import { useResumeData } from "app/context/ResumeContext";
import { defaultResumeData } from "app/constants";
import { ThemeSettings } from "types/graphql";

export const useSettings = (): ThemeSettings => {
  const resumeData = useResumeData();

  return (
    resumeData?.settings?.[0]?.settings?.themeSettings ??
    defaultResumeData.settings?.[0]?.settings?.themeSettings ??
    {}
  );
};
