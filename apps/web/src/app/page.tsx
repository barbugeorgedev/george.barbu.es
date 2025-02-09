"use client";
import { useQuery } from "@apollo/client";
import DefaultTemplate from "@templates/Default";
import { Home } from "app/screens/Home";
import LoadingScreen from "app/screens/Loading";
import ErrorScreen from "app/screens/Error";
import env from "@dotenv";

import { ResumeData } from "types/graphql";
import { GET_RESUME } from "libs/graphql/queries/resume";

console.log("env-web", env);

// Type Definitions

export default function Page() {
  const { loading, error, data } = useQuery<ResumeData>(GET_RESUME, {
    fetchPolicy: "cache-first",
  });

  console.log("GraphQL Data:", data);

  return (
    <DefaultTemplate>
      {loading && <LoadingScreen />}
      {error && <ErrorScreen message={error.message} />}
      {!loading && !error && <Home />}
    </DefaultTemplate>
  );
}
