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
      view
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
        company
        experienceDates {
          startDate
          endDate

          presentDate
        }
        role
        duties
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

export const SETTINGS = gql`
  fragment Settings on Resume {
    homepage
    settings {
      template
      themeSettings {
        ...ThemeSettings
      }
    }
  }

  fragment ThemeSettings on ThemeSettings {
    headerIconsColor
    mainBackground
    headerBackground
    headerTextColor
    sidebarBackground
    mainSectionBackground
    sidebarSectionTextColor
    sidebarTextColor
    mainTextColor
    mainSectionDotColor
    mainSectionLineColor
    mainSectionTextColor
    mainSectionPrimaryTextColor
    mainSectionSecondaryTextColor
    footerTextColor
    footerIconsColor
    footerLinkColor
  }
`;

export const SEO = gql`
  fragment SEO on Resume {
    seoSection {
      seoTitle
      seoKeywords
      seoImage {
        asset {
          url
        }
      }
      seoDescription
    }
  }
`;
