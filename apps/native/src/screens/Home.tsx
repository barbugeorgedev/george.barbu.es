import DefaultTemplate from "@templates/Default";
import { Home as HomeShared } from "app/screens/Home";
import { gql, useQuery } from '@apollo/client';

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
  const { loading, error, data } = useQuery(GET_POSTS);
  console.log('data-sanity', data);

  return (
    <DefaultTemplate>
      <HomeShared />
    </DefaultTemplate>
  );
}
