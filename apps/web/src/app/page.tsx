"use client" 
import { gql, useQuery } from '@apollo/client';
import DefaultTemplate from "@templates/Default";
import { Home } from "app/screens/Home";

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


export default function Page() {
  const { loading, error, data } = useQuery<ResumeData>(GET_POSTS);

  // Handle loading and error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  console.log('data-sanity', data);

  return (
    <DefaultTemplate>
      <Home />
    </DefaultTemplate>
  );
}
