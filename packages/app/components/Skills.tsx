import React from "react";
import { View, Text } from "react-native";

// Define the types
interface Subskill {
  title: string;
}

export interface Skill {
  label: string;
  items: Subskill[];
}

interface SkillsProps {
  data: Skill[]; // An array of Skill objects
}

const Skills: React.FC<SkillsProps> = ({ data }) => (
  <View>
    {data.map((skill, index) => (
      <View
        key={index}
        className="mt-10 text-[0.85rem] font-['Lato'] text-opacity-75 leading-6 text-white"
      >
        <Text className="uppercase font-Norwester text-xl text-primary-light mb-4">
          {skill.label}
        </Text>
        <View className="text-[0.85rem] font-['Lato'] text-opacity-75 leading-6 text-white">
          <View key={skill.label} className={`flex flex-wrap flex-row`}>
            {skill.items.map((subskill, index) => (
              <Text key={subskill.title} className="mx-1">
                <Text className="text-[0.70rem] font-['Lato'] text-opacity-75 leading-3 text-white">
                  {subskill.title}
                  {skill.items.length - 1 !== index ? "," : ""}
                </Text>
              </Text>
            ))}
          </View>
        </View>
      </View>
    ))}
  </View>
);

export default Skills;
