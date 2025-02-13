import React from "react";
import { View, Platform } from "react-native";
import { cssInterop } from "nativewind";
import { IconProps } from "types/ui/icon";

// Expo Icons (Only for React Native)
import {
  FontAwesome,
  Ionicons,
  MaterialIcons,
  Feather,
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";

const NATIVE_ICON_SETS = {
  fa: FontAwesome,
  io: Ionicons,
  md: MaterialIcons,
  fi: Feather,
  ai: AntDesign,
  gi: FontAwesome5,
  bi: MaterialCommunityIcons,
  tb: SimpleLineIcons,
} as const;

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = "black",
  type = "fa",
  className,
}) => {
  const NativeIconSet = NATIVE_ICON_SETS[type];

  if (!NativeIconSet) {
    console.warn(`Native Icon set "${type}" is not available.`);
    return null;
  }

  cssInterop(NativeIconSet, { className: { target: "style" } });

  return (
    <View className={className}>
      <NativeIconSet name={name.toLowerCase()} size={size} color={color} />
    </View>
  );
};

export default Icon;
