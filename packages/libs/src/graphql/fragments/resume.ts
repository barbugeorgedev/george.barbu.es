import { gql } from "@apollo/client";

export const RESUME_HEADER = gql`
  fragment ResumeHeader on Resume {
    cvpurpose
    fullname
    role
    slogan
  }
`;

export const RESUME_SIDEBAR = gql`
  fragment ResumeSidebar on Resume {
    summarySection {
      label
      summary
    }

    skillsSections {
      label
      items {
        title
      }
    }
    contactSection {
      label
      items {
        service
        value
      }
    }
  }
`;

export const RESUME_EXPERIENCE = gql`
  fragment Experience on Resume {
    experienceSection {
      label
      items {
        company
        experienceDates {
          startDate
          endDate
          presentDate
        }
        role
        duties
        skills {
          title
        }
        earlyCareer
      }
    }
  }
`;

export const RESUME_EXPERIENCE_EARLY = gql`
  fragment ExperienceEarly on Resume {
    earlyCareerExperienceSection {
      label
      items {
        company
        experienceDates {
          startDate
          endDate
          presentDate
        }
        role
        duties
        skills {
          title
        }
        earlyCareer
      }
    }
  }
`;

export const RESUME_EXPERIENCE_NGO = gql`
  fragment ExperienceNGO on Resume {
    ngoExperienceSection {
      label
      items {
        organization
        experienceDates {
          startDate
          endDate

          presentDate
        }
        role
        responsibilities
      }
    }
  }
`;

export const RESUME_EDUCATION = gql`
  fragment EducationHistory on Resume {
    educationSection {
      label
      items {
        institution
        degree
        type
        certifications
      }
    }
  }
`;

export const SOCIAL = gql`
  fragment Social on Resume {
    social {
      service
      url
    }
  }
`;
