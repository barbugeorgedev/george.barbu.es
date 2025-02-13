import React from "react";
import { Image as RNImage } from "react-native";
import { cssInterop } from "nativewind";
import { SharedImageProps } from "types/ui/image";

cssInterop(RNImage, { className: "style" });

export const Image = React.forwardRef<
  React.ElementRef<typeof RNImage>,
  SharedImageProps
>(({ className, src, alt, width, height, ...props }, ref) => {
  // Extract width/height from className (e.g., w-[180px] h-[197px])
  const extractedWidth = className?.match(/w-\[(\d+)px\]/)?.[1];
  const extractedHeight = className?.match(/h-\[(\d+)px\]/)?.[1];

  const finalWidth =
    width ?? (extractedWidth ? parseInt(extractedWidth, 10) : undefined);
  const finalHeight =
    height ?? (extractedHeight ? parseInt(extractedHeight, 10) : undefined);

  return (
    <RNImage
      ref={ref}
      source={{ uri: src }}
      accessibilityLabel={alt}
      style={{ width: finalWidth, height: finalHeight }}
      className={className}
      {...props}
    />
  );
});

Image.displayName = "Image";

export default Image;
