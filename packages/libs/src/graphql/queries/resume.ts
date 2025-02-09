import { gql } from "@apollo/client";

export const GET_RESUME = gql`
  query GetResume {
    allResume {
      cvpurpose
      fullname
      role
      slogan
    }
  }
`;
