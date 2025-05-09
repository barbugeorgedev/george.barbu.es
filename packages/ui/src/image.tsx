import React from "react";
import { Platform, Image as RNImage } from "react-native";

import { SharedImageProps } from "types/ui/image";

let ImageComponent: any;
const isWeb = Platform.OS === "web";

if (isWeb) {
  try {
    ImageComponent = require("next/image").default;
  } catch (error) {
    console.warn(
      "next/image could not be loaded, falling back to native <img>",
    );
    ImageComponent = "img"; // Fallback to a standard HTML image element
  }
} else {
  const { cssInterop } = require("nativewind");
  cssInterop(RNImage, { className: "style" });
  ImageComponent = RNImage;
}

export const Image = React.forwardRef<
  React.ElementRef<typeof ImageComponent>,
  SharedImageProps
>(({ className, src, alt, width, height, fill, ...props }, ref) => {
  // Extract width/height from className (e.g., w-[180px] h-[197px])
  const extractedWidth = className?.match(/w-\[(\d+)px\]/)?.[1];
  const extractedHeight = className?.match(/h-\[(\d+)px\]/)?.[1];

  const finalWidth =
    width ?? (extractedWidth ? parseInt(extractedWidth, 10) : undefined);
  const finalHeight =
    height ?? (extractedHeight ? parseInt(extractedHeight, 10) : undefined);

  const imageProps = isWeb
    ? { src, alt, width: finalWidth, height: finalHeight, fill, priority: true }
    : {
        source: { uri: src },
        accessibilityLabel: alt,
        style: { width: finalWidth, height: finalHeight },
      };

  return (
    <ImageComponent
      ref={ref}
      className={className}
      {...imageProps}
      {...props}
    />
  );
});

Image.displayName = "Image";
