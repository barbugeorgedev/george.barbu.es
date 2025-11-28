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
        label
        showLabel
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
      disabled
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
      disabled
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
      disabled
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
    headerIconsColor {
      hex
    }
    mainBackground {
      hex
    }
    headerBackground {
      hex
    }
    headerTextColor {
      hex
    }
    sidebarBackground {
      hex
    }
    mainSectionBackground {
      hex
    }
    sidebarSectionTextColor {
      hex
    }
    sidebarTextColor {
      hex
    }
    mainTextColor {
      hex
    }
    mainSectionDotColor {
      hex
    }
    mainSectionLineColor {
      hex
    }
    mainSectionTextColor {
      hex
    }
    mainSectionPrimaryTextColor {
      hex
    }
    mainSectionSecondaryTextColor {
      hex
    }
    footerTextColor {
      hex
    }
    footerIconsColor {
      hex
    }
    footerLinkColor {
      hex
    }
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

export const PAGE = gql`
  fragment PAGE on Resume {
    homepage
    slug {
      current
      source
    }
  }
`;
