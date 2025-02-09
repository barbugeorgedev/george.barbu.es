import React from "react";
import { View, Text } from "react-native";

interface ExperienceDates {
  startDate: string;
  endDate?: string;
  presentDate: boolean;
}

interface NGOExperienceItem {
  organization: string;
  experienceDates: ExperienceDates;
  role: string;
  responsibilities: string[];
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
    <Text className="uppercase font-['Norwester'] text-xl text-primary-dark mb-4">
      {data.label}
    </Text>
    {data.items.map((item, index) => (
      <View key={index} className="bi-avoid bb-always mt-11 font-['Lato']">
        <Text className="text-secondary font-['LatoBlack'] uppercase text-sm font-semibold">
          {item.organization}
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
          {item.responsibilities.map((resp, respIndex) => (
            <Text key={respIndex}>- {resp}</Text>
          ))}
        </View>
      </View>
    ))}
  </View>
);

export default NGOExperience;
