import React from "react";
import { IconProps, IconType } from "types/ui/icon";

// Web Icons (React Icons) - Only imported in web
import * as FaIcons from "react-icons/fa";
import * as IoIcons from "react-icons/io";
import * as MdIcons from "react-icons/md";
import * as FiIcons from "react-icons/fi";
import * as GiIcons from "react-icons/gi";
import * as AiIcons from "react-icons/ai";
import * as BiIcons from "react-icons/bi";
import * as TbIcons from "react-icons/tb";

const ICON_SETS = {
  fa: FaIcons,
  io: IoIcons,
  md: MdIcons,
  fi: FiIcons,
  ai: AiIcons,
  gi: GiIcons,
  bi: BiIcons,
  tb: TbIcons,
} as const;

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = "black",
  type = "fa",
  className,
}) => {
  const IconSet = ICON_SETS[type];

  if (!IconSet) {
    console.warn(`Icon set "${type}" is not available for web.`);
    return null;
  }

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
};

export default Icon;
