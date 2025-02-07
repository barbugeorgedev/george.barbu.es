import "nativewind/types";

declare module "react-native" {
  interface ViewProps {
    className?: string;
    as?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface ImageProps {
    className?: string;
  }
  interface SafeAreaViewProps {
    className?: string;
  }
  interface TouchableOpacityProps {
    className?: string;
  }
}
