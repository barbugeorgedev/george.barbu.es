import { ContactItem, Skill } from "types/components";

export interface FooterProps {
  social: SocialLink[];
}

interface SocialLink {
  service: string;
  url: string;
}

export interface SidebarProps {
  className?: string;
  summary: {
    label: string;
    summary: string; // Rename 'content' to 'text'
  };
  contacts: {
    label: string;
    items: ContactItem[];
  };
  skills: Skill[];
}

export interface TopSideProps {
  data: {
    text: {
      fullname?: string;
      role?: string;
      slogan?: string;
    };
  };
}

export interface ErrorProps {
  message?: string;
}
