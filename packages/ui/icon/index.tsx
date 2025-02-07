import { Platform, View } from "react-native";
import { cssInterop } from "nativewind";
import React from "react";

// Web Icons (React Icons)
import * as FaIcons from "react-icons/fa";
import * as IoIcons from "react-icons/io";
import * as MdIcons from "react-icons/md";
import * as FiIcons from "react-icons/fi";
import * as GiIcons from "react-icons/gi";
import * as AiIcons from "react-icons/ai";
import * as BiIcons from "react-icons/bi";
import * as TbIcons from "react-icons/tb";

// Expo Icons (Only for React Native, not Web)
let ExpoIcons;
if (Platform.OS !== "web") {
  ExpoIcons = require("@expo/vector-icons");
}

// Define available icon sets for web
const ICON_SETS = {
  fa: FaIcons,
  io: IoIcons,
  md: MdIcons,
  fi: FiIcons,
  ai: AiIcons,
  gi: FaIcons,
  bi: BiIcons,
  tb: TbIcons,
} as const;

// Define available Expo icon sets for mobile
const NATIVE_ICON_SETS = {
  fa: ExpoIcons?.FontAwesome,
  io: ExpoIcons?.Ionicons,
  md: ExpoIcons?.MaterialIcons,
  fi: ExpoIcons?.Feather,
  ai: ExpoIcons?.AntDesign,
  gi: ExpoIcons?.FontAwesome5,
  bi: ExpoIcons?.MaterialCommunityIcons,
  tb: ExpoIcons?.SimpleLineIcons,
} as const;

type IconType = keyof typeof ICON_SETS;

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  type?: IconType;
  className?: string;
}

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = "black",
  type = "fa",
  className,
}) => {
  if (Platform.OS === "web") {
    const IconSet = ICON_SETS[type];
    if (!IconSet) {
      console.warn(`Icon set "${type}" is not available for web.`);
      return null;
    }

    // Ensure the name is correctly formatted for the icon set
    const formattedName = Object.keys(IconSet).find((key) =>
      key.toLowerCase().includes(name.toLowerCase()),
    );

    if (!formattedName) {
      console.warn(`Icon "${name}" not found in set "${type}"`);
      return null;
    }

    const WebIcon = IconSet[formattedName as keyof typeof IconSet] as React.FC<{
      size?: number;
      color?: string;
      className?: string;
    }>;

    return <WebIcon size={size} color={color} className={className} />;
  } else {
    // Native Icons for React Native
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
  }
};

export default Icon;
