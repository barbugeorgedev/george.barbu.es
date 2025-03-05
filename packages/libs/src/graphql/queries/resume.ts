import { gql } from "@apollo/client";
import {
  RESUME_HEADER,
  RESUME_SIDEBAR,
  RESUME_EXPERIENCE,
  RESUME_EXPERIENCE_EARLY,
  RESUME_EXPERIENCE_NGO,
  RESUME_EDUCATION,
  SOCIAL,
  SETTINGS,
  SEO,
  PAGE,
} from "libs/graphql/fragments";

export const GET_RESUME = gql`
  query GetResume($filter: ResumeFilter) {
    header: allResume(where: $filter) {
      ...ResumeHeader
    }
    sidebar: allResume(where: $filter) {
      ...ResumeSidebar
    }
    content: allResume(where: $filter) {
      ...Experience
      ...ExperienceEarly
      ...ExperienceNGO
      ...EducationHistory
    }
    footer: allResume(where: $filter) {
      ...Social
    }
    settings: allResume(where: $filter) {
      ...Settings
    }
    seo: allResume(where: $filter) {
      ...SEO
    }
    page: allResume(where: $filter) {
      ...PAGE
    }
  }
  ${RESUME_HEADER}
  ${RESUME_SIDEBAR}
  ${RESUME_EXPERIENCE}
  ${RESUME_EXPERIENCE_EARLY}
  ${RESUME_EXPERIENCE_NGO}
  ${RESUME_EDUCATION}
  ${SOCIAL}
  ${SETTINGS}
  ${SEO}
  ${PAGE}
`;
