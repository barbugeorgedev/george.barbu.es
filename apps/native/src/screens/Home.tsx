import DefaultTemplate from "@templates/Default";
import { Home as HomeShared } from "app/screens/Home";
import { gql, useQuery } from "@apollo/client";

import LoadingScreen from "app/screens/Loading";
import ErrorScreen from "app/screens/Error";
import env from "@dotenv";

import { ResumeData } from "types/page";

console.log("env-web", env);

// GraphQL Query
const GET_POSTS = gql`
  query {
    allResume {
      cvpurpose
      fullname
      role
      slogan
    }
  }
`;

export default function Home(): JSX.Element {
  const { loading, error, data } = useQuery<ResumeData>(GET_POSTS, {
    fetchPolicy: "cache-first", // Ensures it only fetches if not cached
  });
  console.log("data-sanity", data);

  return (
    <DefaultTemplate>
      {loading && <LoadingScreen />}
      {error && <ErrorScreen message={error.message} />}
      {!loading && !error && <HomeShared />}
    </DefaultTemplate>
  );
}
