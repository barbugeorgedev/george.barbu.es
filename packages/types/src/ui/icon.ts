// Defining Icon types
export type IconType = "fa" | "io" | "md" | "fi" | "ai" | "gi" | "bi" | "tb";

export interface IconProps {
  name: string;
  size?: number;
  color?: string;
  type?: IconType;
  className?: string;
}
