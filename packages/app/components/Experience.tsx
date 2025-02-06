import React from "react";
import { View, Text } from "react-native";

type Duty = {
  duty: string;
};

type ExperienceItem = {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  presentDate: "Yes" | "No"; // Ensuring strict types for presentDate
  duties: Duty[];
};

export type ExperienceData = {
  items: ExperienceItem[];
  label: string;
};

interface ExperienceProps {
  data: ExperienceData[];
  className: string;
}

const Experience: React.FC<ExperienceProps> = ({ className, data }) => {
  if (!data || data.length === 0) return null; // Ensure `data[0]` exists

  // Normalize data to ensure `presentDate` is "Yes" or "No"
  const normalizedData = data.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      presentDate:
        item.presentDate === "Yes" || item.presentDate === "No"
          ? item.presentDate
          : "No", // Default to "No" if presentDate is not "Yes" or "No"
    })),
  }));

  const groups: Record<string, ExperienceItem[]> = (
    normalizedData[0]?.items || []
  ).reduce(
    (acc, item) => {
      // Ensure there's a company field and safely initialize the array if needed
      if (!item.company) return acc; // Handle edge cases where there's no company

      // Initialize acc[item.company] if it doesn't exist
      if (!acc[item.company]) {
        acc[item.company] = [];
      }

      // Now that we know it's an array, we can safely push the item
      acc[item.company]?.push(item);

      return acc;
    },
    {} as Record<string, ExperienceItem[]>, // Initialize acc as an empty object
  );

  return (
    <View className={className}>
      <Text className="uppercase font-['Norwester'] text-xl text-primary-dark mb-4">
        {normalizedData[0]?.label}
      </Text>

      {Object.keys(groups).map((company, index) => (
        <View key={index}>
          {groups[company] && groups[company].length > 0 && (
            <View
              key={index}
              className={"bi-avoid bb-always font-['Lato'] mt-11"}
            >
              <Text className="text-secondary font-['LatoBlack'] uppercase text-sm font-semibold">
                {groups[company]?.[0]?.company}
              </Text>
              <View className="text-primary-dark text-xs font-semibold mb-4">
                <Text className="font-['LatoBlack'] text-primary-dark text-xs">
                  {groups[company]?.[groups[company]?.length - 1]?.startDate}
                  &nbsp; -&nbsp;
                  {groups[company]?.[0]?.presentDate === "Yes" && "Present"}
                  {groups[company]?.[0]?.presentDate === "No" && (
                    <Text className="font-['LatoBlack'] text-primary-dark text-xs">
                      {groups[company]?.[0]?.endDate}
                    </Text>
                  )}
                </Text>
              </View>
              <View className="relative border-l border-solid border-primary-dark">
                {groups[company]?.map((item, index) => (
                  <View
                    key={index}
                    className={
                      "bi-avoid bb-always font-['Lato'] ml-4 " +
                      (index !== 0 ? "mt-11" : "mt-4")
                    }
                  >
                    <View className="absolute w-3 h-3 border-primary-dark bg-primary-dark rounded-full mt-1.5 -left-6 ml-0.5 border"></View>
                    <Text className="text-secondary font-['LatoBlack'] uppercase text-sm font-semibold">
                      {item.role}
                    </Text>
                    <View className="text-primary-dark text-xs font-semibold mb-4">
                      <Text className="font-['LatoBlack'] text-primary-dark text-xs">
                        {item.startDate}&nbsp; - &nbsp;
                        {item.presentDate === "Yes" && "Present"}
                        {item.presentDate === "No" && (
                          <Text>{item.endDate}</Text>
                        )}
                      </Text>
                    </View>
                    <Text className="text-xs flex flex-col">
                      {item.duties.map((duty, index) => (
                        <Text key={index}>- {duty.duty}</Text>
                      ))}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

export default Experience;
