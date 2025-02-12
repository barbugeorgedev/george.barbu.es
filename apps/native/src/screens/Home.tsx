import { ResumeDataProvider } from "app/context/ResumeContext";
import DefaultTemplate from "@templates/Default";
import { Home as HomeShared } from "app/screens/Home";
import { useQuery } from "@apollo/client";

import LoadingScreen from "app/screens/Loading";
import ErrorScreen from "app/screens/Error";

import { ResumeData } from "types/graphql";
import { GET_RESUME } from "libs/graphql/queries/resume";

// Define a fallback `resumeData` object
const defaultResumeData: ResumeData = {
  name: "",
  social: [],
  footer: "",
  sidebar: [
    {
      skillsSections: [],
      summarySection: { label: "Summary", summary: "" }, // Ensure object format
      contactSection: { label: "Contacts", items: [] },
    },
  ],
  header: [
    {
      fullname: "John Doe",
      role: "Software Engineer",
      slogan: "Building the future, one line at a time.",
    },
  ],
  content: [
    {
      experienceSection: { label: "Experience", items: [] },
      earlyCareerExperienceSection: { label: "Early Career", items: [] },
      ngoExperienceSection: { label: "NGO Experience", items: [] },
      educationSection: { label: "Education", items: [] },
    },
  ],
};

export default function Home(): JSX.Element {
  const { loading, error, data } = useQuery<ResumeData>(GET_RESUME, {
    fetchPolicy: "cache-first",
  });

  const resumeData = data ?? defaultResumeData;

  return (
    <ResumeDataProvider value={resumeData}>
      <DefaultTemplate>
        {loading && <LoadingScreen />}
        {error && <ErrorScreen message={error.message} />}
        {!loading && !error && <HomeShared />}
      </DefaultTemplate>
    </ResumeDataProvider>
  );
}
