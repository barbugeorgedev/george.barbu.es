import { gql } from "@apollo/client";

export const RESUME_FRAGMENT = gql`
  fragment ResumeFields on Resume {
    cvpurpose
    fullname
    role
    slogan
  }
`;
