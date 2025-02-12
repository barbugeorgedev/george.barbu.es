import React from "react";
import { View, Text } from "react-native";

interface NGOExperienceDates {
  startDate: string;
  endDate?: string;
  presentDate: boolean;
}

interface NGOExperienceItem {
  company: string;
  experienceDates: NGOExperienceDates;
  role: string;
  duties: string[];
}

export interface NGOExperienceData {
  label: string;
  items: NGOExperienceItem[];
}

interface NGOExperienceProps {
  className?: string;
  data: NGOExperienceData;
}

const NGOExperience: React.FC<NGOExperienceProps> = ({ className, data }) => (
  <View className={className}>
    <Text className="uppercase font-['Norwester'] text-xl text-primary-dark mt-11">
      {data.label}
    </Text>
    {data.items.map((item, index) => (
      <View key={index} className="bi-avoid bb-always mt-11 font-['Lato']">
        <Text className="text-secondary font-['LatoBlack'] uppercase text-sm font-semibold">
          {item.company}
        </Text>
        <View className="text-primary-dark text-xs font-semibold mb-4">
          <Text className="font-['LatoBlack'] text-primary-dark text-xs">
            {item.experienceDates.startDate.substring(0, 4)} -
            {item.experienceDates.presentDate
              ? " Present"
              : ` ${item.experienceDates.endDate?.substring(0, 4)}`}
          </Text>
        </View>
        <Text className="text-secondary font-['LatoBlack'] uppercase text-sm font-semibold">
          {item.role}
        </Text>
        <View className="text-xs flex flex-col">
          {item.duties.map((resp, respIndex) => (
            <Text key={respIndex}>- {resp}</Text>
          ))}
        </View>
      </View>
    ))}
  </View>
);

export default NGOExperience;
