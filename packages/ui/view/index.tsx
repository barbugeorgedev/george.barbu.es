import {
  View as ReactNativeView,
  ViewProps as RNViewProps,
  StyleProp,
} from "react-native";
import { cssInterop } from "nativewind";
import React, { CSSProperties } from "react";
import { Platform } from "react-native";

interface CustomViewProps extends Omit<RNViewProps, "style"> {
  children?: React.ReactNode;
  className?: string;
  style?: StyleProp<RNViewProps["style"]> | CSSProperties; // Allow both RN and Web styles
  [key: string]: any; // Allow any other props (e.g., data attributes, aria attributes)
}

cssInterop(ReactNativeView, {
  className: "style",
});

// List of RN-only props that should not be passed to <div>
const RN_PROPS_TO_FILTER = new Set([
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

export const View = React.forwardRef<
  React.ElementRef<typeof ReactNativeView>,
  CustomViewProps
>(({ children, className, style, ...props }, ref) => {
  if (Platform.OS === "web") {
    // For web, handle styles as CSSProperties
    const webStyle = style as CSSProperties;

    // Filter out invalid RN props before passing to <div>
    const divProps = Object.fromEntries(
      Object.entries(props).filter(([key]) => !RN_PROPS_TO_FILTER.has(key)),
    );

    return (
      <div {...divProps} className={className} style={webStyle}>
        {children}
      </div>
    );
  }

  return (
    <ReactNativeView ref={ref} className={className} style={style} {...props}>
      {children}
    </ReactNativeView>
  );
});

View.displayName = "View";
