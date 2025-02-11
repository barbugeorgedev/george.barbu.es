import React from "react";
import { View, Text } from "react-native";
import { EducationProps } from "types/components";

const Education: React.FC<EducationProps> = ({ className, data }) => {
  console.log("Education Component Data:", data);

  return (
    <View className={className}>
      <View>
        <Text className="uppercase font-['Norwester'] text-xl text-primary-dark mb-4">
          {data.label}
        </Text>
        {data.items.length === 0 ? (
          <Text>No education data available</Text>
        ) : (
          data.items.map((item, itemIndex) => (
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
          ))
        )}
      </View>
    </View>
  );
};

export default Education;
