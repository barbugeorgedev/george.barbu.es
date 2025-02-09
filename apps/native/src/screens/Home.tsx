import { ResumeDataProvider } from "app/context/ResumeContext";
import DefaultTemplate from "@templates/Default";
import { Home as HomeShared } from "app/screens/Home";
import { useQuery } from "@apollo/client";

import LoadingScreen from "app/screens/Loading";
import ErrorScreen from "app/screens/Error";
import env from "@dotenv";

import { ResumeData } from "types/graphql";
import { GET_RESUME } from "libs/graphql/queries/resume";

console.log("env-web", env);

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

export default function Home(): JSX.Element {
  const { loading, error, data } = useQuery<ResumeData>(GET_RESUME, {
    fetchPolicy: "cache-first",
  });

  const resumeData = data ?? defaultResumeData;

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
