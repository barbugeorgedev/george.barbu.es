import { createContext, useContext } from "react";
import { ExperienceData } from "types/components";

const ResumeDataContext = createContext<ExperienceData | undefined>(undefined);

// Custom hook to consume the context
export const useResumeData = () => {
  const context = useContext(ResumeDataContext);
  if (!context) {
    throw new Error("useResumeData must be used within a ResumeDataProvider");
  }
  return context;
};

// Provider component
export const ResumeDataProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: ExperienceData;
}) => {
  return (
    <ResumeDataContext.Provider value={value}>
      {children}
    </ResumeDataContext.Provider>
  );
};
