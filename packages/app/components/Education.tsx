import React from "react";
import { View, Text } from "react-native";

interface EducationItem {
  institution: string;
  degree: string;
  type: string;
  certifications: string[];
}

export interface EducationData {
  label: string;
  items: EducationItem[];
}

interface EducationProps {
  className?: string;
  data: EducationData; // data is an array
}

const Education: React.FC<EducationProps> = ({ className, data }) => (
  <View className={className}>
    <View>
      <Text className="uppercase font-['Norwester'] text-xl text-primary-dark mb-4">
        {data.label} {/* Access label from each EducationData item */}
      </Text>
      {data.items.map((item, itemIndex) => (
        <View
          key={itemIndex}
          className="bi-avoid bb-always mt-11 font-['Lato']"
        >
          <Text className="text-secondary font-['LatoBlack'] uppercase text-sm font-semibold">
            {item.institution}
          </Text>
          <View className="text-primary-dark text-xs font-semibold mb-4 flex flex-row">
            <Text className="border-r-2 border-solid border-primary-dark mr-1 pr-1 font-['LatoBlack'] text-primary-dark text-xs">
              {item.degree}
            </Text>
            <Text className="font-['LatoBlack'] text-primary-dark text-xs">
              {item.type}
            </Text>
          </View>
          <View className="text-xs flex flex-col">
            {item.certifications.map((cert, certIndex) => (
              <Text key={certIndex}>- {cert}</Text>
            ))}
          </View>
        </View>
      ))}
    </View>
  </View>
);

export default Education;
