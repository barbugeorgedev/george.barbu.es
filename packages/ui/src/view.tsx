import {
  Platform,
  View as ReactNativeView,
  ViewProps as RNViewProps,
} from "react-native";
import { cssInterop } from "nativewind";
import React, { CSSProperties } from "react";

// Import types from view.ts
import { CustomViewProps, RN_PROPS_TO_FILTER } from "types/ui/view";

cssInterop(ReactNativeView, {
  className: "style",
});

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
    <ReactNativeView ref={ref} className={className} {...props}>
      {children}
    </ReactNativeView>
  );
});

View.displayName = "View";
