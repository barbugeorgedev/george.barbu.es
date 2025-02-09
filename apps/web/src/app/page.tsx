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
  sidebar: function (arg0: string, sidebar: any): unknown {
    throw new Error("Function not implemented.");
  },
  header: function (arg0: string, header: any): unknown {
    throw new Error("Function not implemented.");
  },
  content: function (arg0: string, content: any): unknown {
    throw new Error("Function not implemented.");
  },
};

export default function Page() {
  const { loading, error, data } = useQuery<ResumeData>(GET_RESUME, {
    fetchPolicy: "cache-first",
  });

  console.log("GraphQL Data:", data);

  // Use the fetched data or fallback to the default
  const resumeData = data ?? defaultResumeData;

  return (
    <ResumeDataProvider value={resumeData}>
      <DefaultTemplate>
        {loading && <LoadingScreen />}
        {error && <ErrorScreen message={error.message} />}
        {!loading && !error && <Home />}
      </DefaultTemplate>
    </ResumeDataProvider>
  );
}
