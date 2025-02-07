"use client";
import { gql, useQuery } from "@apollo/client";
import { useEffect } from "react";

import DefaultTemplate from "@templates/Default";
import { Home } from "app/screens/Home";
import LoadingScreen from "app/screens/Loading";
import ErrorScreen from "app/screens/Error";
import env from "@dotenv";

console.log("env-web", env);

// GraphQL Query
const GET_RESUME = gql`
  query GetResume {
    allResume {
      cvpurpose
      fullname
      role
      slogan
    }
  }
`;

// Type Definitions
interface Resume {
  cvpurpose: string;
  fullname: string;
  role: string;
  slogan: string;
}

interface ResumeData {
  allResume: Resume[];
}

export default function Page() {
  const { loading, error, data } = useQuery<ResumeData>(GET_RESUME);

  console.log("data-sanity", data ?? "Fetching...");

  return (
    <DefaultTemplate>
      {loading && <LoadingScreen />}
      {error && <ErrorScreen message={error.message} />}
      {!loading && !error && <Home />}
    </DefaultTemplate>
  );
}
