import { ViewProps as RNViewProps, StyleProp } from "react-native";
import { CSSProperties, ReactNode } from "react";

// Custom View Props, extending RNViewProps and allowing both RN and Web styles
export interface CustomViewProps extends Omit<RNViewProps, "style"> {
  children?: ReactNode;
  className?: string;
  style?: StyleProp<RNViewProps["style"]> | CSSProperties; // Allow both RN and Web styles
  [key: string]: any; // Allow any other props (e.g., data attributes, aria attributes)
}

// You can also keep the RN props filtering logic as a constant
export const RN_PROPS_TO_FILTER = new Set([
  "hitSlop",
  "needsOffscreenAlphaCompositing",
  "accessibilityLanguage",
  "accessibilityHint",
  "accessibilityLabel",
  "accessibilityRole",
  "accessibilityState",
  "accessibilityValue",
  "accessibilityLiveRegion",
]);
