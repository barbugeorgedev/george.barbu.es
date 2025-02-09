import DefaultTemplate from "@templates/Default";
import { Home as HomeShared } from "app/screens/Home";
import { gql, useQuery } from "@apollo/client";

import LoadingScreen from "app/screens/Loading";
import ErrorScreen from "app/screens/Error";
import env from "@dotenv";

import { ResumeData } from "types/graphql";
import { GET_RESUME } from "libs/graphql/queries/resume";

console.log("env-web", env);

export default function Home(): JSX.Element {
  const { loading, error, data } = useQuery<ResumeData>(GET_RESUME, {
    fetchPolicy: "cache-first",
  });

  console.log("GraphQL Data:", data);

  return (
    <DefaultTemplate>
      {loading && <LoadingScreen />}
      {error && <ErrorScreen message={error.message} />}
      {!loading && !error && <HomeShared />}
    </DefaultTemplate>
  );
}
