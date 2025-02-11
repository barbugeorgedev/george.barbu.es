import { ResumeDataProvider } from "app/context/ResumeContext";
import DefaultTemplate from "@templates/Default";
import { Home as HomeShared } from "app/screens/Home";
import { useQuery } from "@apollo/client";

import LoadingScreen from "app/screens/Loading";
import ErrorScreen from "app/screens/Error";
import env from "@dotenv";

import { ExperienceData } from "types/components";
import { GET_RESUME } from "libs/graphql/queries/resume";

console.log("env-web", env);

export default function Home(): JSX.Element {
  const { loading, error, data } = useQuery<ExperienceData>(GET_RESUME, {
    fetchPolicy: "cache-first",
  });

  const resumeData: ExperienceData = data ?? {
    label: "",
    items: [],
    footer: [],
    header: [],
    sidebar: {
      skillsSections: [],
      summarySection: { label: "", summary: "" },
      contactSection: { label: "", items: [] },
    },
    content: {
      experienceSection: { label: "", items: [] },
      earlyCareerExperienceSection: { label: "", items: [] },
      ngoExperienceSection: { label: "", items: [] },
      educationSection: { label: "", items: [] },
    },
  };

  console.log("GraphQL Data:", data);

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
