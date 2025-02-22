import { ResumeDataProvider } from "app/context/ResumeContext";
import DefaultTemplate from "@templates/Default";
import { Home as HomeShared } from "app/screens/Home";
import { useQuery } from "@apollo/client";

import LoadingScreen from "app/screens/Loading";
import ErrorScreen from "app/screens/Error";

import { ResumeData } from "types/graphql";
import { GET_RESUME } from "libs/graphql/queries/resume";
import { defaultResumeData } from "app/constants";

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
