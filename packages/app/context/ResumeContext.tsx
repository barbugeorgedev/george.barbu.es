import { createContext, useContext } from "react";
import { ResumeData } from "types/graphql";

const ResumeDataContext = createContext<ResumeData | undefined>(undefined);

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
  value: ResumeData;
}) => {
  return (
    <ResumeDataContext.Provider value={value}>
      {children}
    </ResumeDataContext.Provider>
  );
};
