import { gql } from "@apollo/client";
import {
  RESUME_HEADER,
  RESUME_SIDEBAR,
  RESUME_EXPERIENCE,
  RESUME_EXPERIENCE_EARLY,
  RESUME_EXPERIENCE_NGO,
  RESUME_EDUCATION,
  SOCIAL,
} from "libs/graphql/fragments";

export const GET_RESUME = gql`
  query GetResume {
    header: allResume {
      ...ResumeHeader
    }
    sidebar: allResume {
      ...ResumeSidebar
    }
    content: allResume {
      ...Experience
      ...ExperienceEarly
      ...ExperienceNGO
      ...EducationHistory
    }
    footer: allResume {
      ...Social
    }
  }
  ${RESUME_HEADER}
  ${RESUME_SIDEBAR}
  ${RESUME_EXPERIENCE}
  ${RESUME_EXPERIENCE_EARLY}
  ${RESUME_EXPERIENCE_NGO}
  ${RESUME_EDUCATION}
  ${SOCIAL}
`;
