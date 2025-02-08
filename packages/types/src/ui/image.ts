import { ImageProps as RNImageProps } from "react-native";

export interface SharedImageProps extends RNImageProps {
  className?: string;
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean; // Allow Next.js "fill" mode
}
