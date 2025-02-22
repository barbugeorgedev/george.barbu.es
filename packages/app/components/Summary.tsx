import React from "react";
import { View, Text } from "react-native";
import DefaultComponentProps from "types/components";
import { useResumeData } from "app/context/ResumeContext";
import { useSettings } from "app/hooks/useSettings";

const Summary: React.FC<DefaultComponentProps> = ({ className }) => {
  const settings = useSettings();
  const resumeData = useResumeData();
  const data = resumeData?.sidebar[0]?.summarySection;

  return (
    <View className={className}>
      <Text
        className="uppercase font-['Norwester'] font-light text-xl mb-4"
        style={{
          color: settings?.sidebarSectionTextColor,
        }}
      >
        {String(data?.label ?? "")}
      </Text>
      <Text
        className="text-[0.70rem] font-['Lato'] leading-4"
        style={{
          color: settings?.sidebarTextColor,
        }}
      >
        {String(data?.summary ?? "")}
      </Text>
    </View>
  );
};

export default Summary;
