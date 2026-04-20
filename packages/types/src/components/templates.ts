import { ReactNode } from "react";

export interface TemplateProps {
  children?: ReactNode;
  isATS?: boolean;
  /** Light single-column ATS layout (HomeATSv2) */
  isATSv2?: boolean;
}
