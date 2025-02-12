import React from "react";
import { View, Text } from "react-native";

interface ExperienceDates {
  startDate: string; // Now required
  endDate?: string;
  presentDate: boolean;
}

interface EarlyCareerItem {
  company?: string; // Allow undefined
  role: string;
  experienceDates: {
    startDate?: string;
    endDate?: string;
    presentDate?: boolean;
  };
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
      <Text className="uppercase font-['Norwester'] text-xl text-primary-dark mt-20 mb-6">
        {data.label}
      </Text>
      {data.items.map((item, itemIndex) => (
        <View key={itemIndex} className="bi-avoid bb-always mt-4 font-['Lato']">
          <View className="flex flex-row flex-wrap items-baseline space-x-2">
            <Text className="text-secondary font-['LatoBlack'] uppercase text-sm font-semibold">
              {item.role},
            </Text>
            <Text className="text-secondary font-['Lato'] uppercase text-sm">
              {item.company}
            </Text>
            <Text className="font-['Lato'] text-primary-dark text-sm">
              ({item.experienceDates.startDate?.substring(0, 4) ?? "N/A"}
              &nbsp;-&nbsp;
              {item.experienceDates.presentDate
                ? "Present"
                : (item.experienceDates.endDate?.substring(0, 4) ?? "N/A")}
              )
            </Text>
            <Text key={0} className="text-sm">
              - {item.duties[0]}
            </Text>
          </View>
        </View>
      ))}
    </View>
  </View>
);

export default EarlyCareer;
