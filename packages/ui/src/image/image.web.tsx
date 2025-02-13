import React from "react";
import NextImage from "next/image";
import { SharedImageProps } from "types/ui/image";

export const Image = React.forwardRef<
  React.ElementRef<typeof NextImage>,
  SharedImageProps
>(({ className, src, alt, width, height, fill, ...props }, ref) => {
  // Extract width/height from className (e.g., w-[180px] h-[197px])
  const extractedWidth = className?.match(/w-\[(\d+)px\]/)?.[1];
  const extractedHeight = className?.match(/h-\[(\d+)px\]/)?.[1];

  const finalWidth =
    width ?? (extractedWidth ? parseInt(extractedWidth, 10) : undefined);
  const finalHeight =
    height ?? (extractedHeight ? parseInt(extractedHeight, 10) : undefined);

  return (
    <NextImage
      ref={ref}
      src={src}
      alt={alt}
      width={finalWidth}
      height={finalHeight}
      fill={fill}
      priority
      className={className}
      {...props}
    />
  );
});

Image.displayName = "Image";

export default Image;
