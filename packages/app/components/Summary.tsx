import React from "react";
import { View, Text } from "react-native";

// Define the types for the data prop
export interface SummaryData {
  label: string;
  text: string;
}

interface SummaryProps {
  data: SummaryData; // data is of type SummaryData
  className?: string; // className is optional and is a string
}

const Summary: React.FC<SummaryProps> = ({ data, className }) => (
  <View className={className}>
    <Text className="uppercase font-['Norwester'] text-xl text-primary-light mb-4">
      {data.label}
    </Text>
    <Text className="text-[0.70rem] font-['Lato'] text-opacity-75 leading-4 text-white">
      {data.text}
    </Text>
  </View>
);

export default Summary;
