import React from "react";
import { View, Text } from "react-native";

const Experience = ({ className, data }) => {
  if (!data || !data.items || data.items.length === 0) return null;

  // Normalize `presentDate`
  const normalizedData = data.items.map((item) => ({
    ...item,
    presentDate: item.experienceDates.presentDate ? "Yes" : "No",
  }));

  // Group by company
  const groups = normalizedData.reduce((acc, item) => {
    if (!item.company) return acc;
    if (!acc[item.company]) acc[item.company] = [];
    acc[item.company].push(item);
    return acc;
  }, {});

  return (
    <View className={className}>
      <Text className="uppercase font-['Norwester'] text-xl text-primary-dark mb-4">
        {data.label}
      </Text>

      {Object.keys(groups).map((company, index) => (
        <View key={index}>
          {groups[company].length > 0 && (
            <View
              key={index}
              className={"bi-avoid bb-always font-['Lato'] mt-11"}
            >
              <Text className="text-secondary font-['LatoBlack'] uppercase text-sm font-semibold">
                {company}
              </Text>
              <View className="text-primary-dark text-xs font-semibold mb-4">
                <Text className="font-['LatoBlack'] text-primary-dark text-xs">
                  {groups[company][
                    groups[company].length - 1
                  ]?.experienceDates?.startDate?.substring(0, 4) || "N/A"}
                  &nbsp; - &nbsp;
                  {groups[company][0]?.experienceDates?.presentDate
                    ? "Present"
                    : groups[company][0]?.experienceDates?.endDate?.substring(
                        0,
                        4,
                      ) || "N/A"}
                </Text>
              </View>
              <View className="relative border-l border-solid border-primary-dark">
                {groups[company].map((item, index) => (
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
                        {item.experienceDates?.startDate?.substring(0, 4) ||
                          "N/A"}
                        &nbsp; - &nbsp;
                        {item.experienceDates?.presentDate
                          ? "Present"
                          : item.experienceDates?.endDate?.substring(0, 4) ||
                            "N/A"}
                      </Text>
                    </View>
                    <Text className="text-xs flex flex-col">
                      {item.duties.map((duty, index) => (
                        <Text key={index}>- {duty}</Text>
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
