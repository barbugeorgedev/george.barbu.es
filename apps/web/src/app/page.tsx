"use client";
import { ResumeDataProvider } from "app/context/ResumeContext";
import { useQuery } from "@apollo/client";
import DefaultTemplate from "@templates/Default";
import { Home } from "app/screens/Home";
import LoadingScreen from "app/screens/Loading";
import ErrorScreen from "app/screens/Error";
import env from "@dotenv";

import { ExperienceData } from "types/components";
import { GET_RESUME } from "libs/graphql/queries/resume";

console.log("env-web", env);

export default function Page() {
  const { loading, error, data } = useQuery<ExperienceData>(GET_RESUME, {
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
  const resumeData = data;

  return (
    <ResumeDataProvider value={data ?? ({} as ExperienceData)}>
      <DefaultTemplate>
        {loading && <LoadingScreen />}
        {error && <ErrorScreen message={error.message} />}
        {!loading && !error && <Home />}
      </DefaultTemplate>
    </ResumeDataProvider>
  );
}
