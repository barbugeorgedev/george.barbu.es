import { gql } from "@apollo/client";

export const CREATE_RESUME = gql`
  mutation CreateResume($input: ResumeInput!) {
    createResume(input: $input) {
      id
      fullname
      role
    }
  }
`;
