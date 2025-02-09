import React from "react";
import { View, Text } from "react-native";

interface ExperienceDates {
  startDate: string;
  endDate?: string;
  presentDate: boolean;
}

interface EarlyCareerItem {
  company: string;
  role: string;
  experienceDates: ExperienceDates;
  duties: string[];
}

export interface EarlyCareerData {
  label: string;
  items: EarlyCareerItem[];
}

interface EarlyCareerProps {
  className?: string;
  data: EarlyCareerData;
}

const EarlyCareer: React.FC<EarlyCareerProps> = ({ className, data }) => (
  <View className={className}>
    <View>
      <Text className="uppercase font-['Norwester'] text-xl text-primary-dark mb-4">
        {data.label}
      </Text>
      {data.items.map((item, itemIndex) => (
        <View
          key={itemIndex}
          className="bi-avoid bb-always mt-11 font-['Lato']"
        >
          <Text className="text-secondary font-['LatoBlack'] uppercase text-sm font-semibold">
            {item.role}, {item.company}
          </Text>
          <View className="text-primary-dark text-xs font-semibold mb-4">
            <Text className="font-['LatoBlack'] text-primary-dark text-xs">
              {item.experienceDates.startDate.substring(0, 4)}
              &nbsp;-&nbsp;
              {item.experienceDates.presentDate
                ? "Present"
                : item.experienceDates.endDate?.substring(0, 4)}
            </Text>
          </View>
          <View className="text-xs flex flex-col">
            {item.duties.map((duty, dutyIndex) => (
              <Text key={dutyIndex}>- {duty}</Text>
            ))}
          </View>
        </View>
      ))}
    </View>
  </View>
);

export default EarlyCareer;
