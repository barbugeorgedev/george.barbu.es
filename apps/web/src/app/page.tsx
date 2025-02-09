"use client";
import { ResumeDataProvider } from "app/context/ResumeContext";
import { useQuery } from "@apollo/client";
import DefaultTemplate from "@templates/Default";
import { Home } from "app/screens/Home";
import LoadingScreen from "app/screens/Loading";
import ErrorScreen from "app/screens/Error";
import env from "@dotenv";

import { ResumeData } from "types/graphql";
import { GET_RESUME } from "libs/graphql/queries/resume";

console.log("env-web", env);

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

export default function Page() {
  const { loading, error, data } = useQuery<ResumeData>(GET_RESUME, {
    fetchPolicy: "cache-first",
    onCompleted: (data) => console.log("✅ Query completed:", data),
    onError: (error) => console.error("❌ Query error:", error),
  });

  console.log("Loading:", loading);
  console.log("Error:", error);
  if (data) {
    console.log("Data:", data);
  }

  // Use the fetched data or fallback to the default
  const resumeData = data ?? defaultResumeData;

  return (
    <ResumeDataProvider value={data ?? resumeData}>
      <DefaultTemplate>
        {loading && <LoadingScreen />}
        {error && <ErrorScreen message={error.message} />}
        {!loading && !error && <Home />}
      </DefaultTemplate>
    </ResumeDataProvider>
  );
}
