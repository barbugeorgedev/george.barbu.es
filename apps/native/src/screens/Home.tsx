import DefaultTemplate from "@templates/Default";
import { Home as HomeShared } from "app/screens/Home";
import { gql, useQuery } from "@apollo/client";

import LoadingScreen from "app/screens/Loading";
import ErrorScreen from "app/screens/Error";
import env from "@dotenv";

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

// TypeScript interfaces
interface Resume {
  cvpurpose: string;
  fullname: string;
  role: string;
  slogan: string;
}

interface ResumeData {
  allResume: Resume[];
}

interface ResumeVariables {
  // Define any query variables here, if applicable
  // Example: id: string; if you're passing an ID as a variable in the query
}

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
