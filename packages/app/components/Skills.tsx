import React from "react";
import { View, Text } from "react-native";

// Define the types
interface Subskill {
  name: string;
}

export interface Skill {
  title: string;
  type: "tag" | "list"; // Only "tag" or "list" as valid types
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
          {skill.title}
        </Text>
        <View className="text-[0.85rem] font-['Lato'] text-opacity-75 leading-6 text-white">
          <View
            key={skill.title}
            className={`${skill.type === "tag" ? "flex flex-wrap flex-row" : ""}`}
          >
            {skill.items.map((subskill, index) => (
              <Text key={subskill.name} className="mx-1">
                {skill.type === "tag" && (
                  <Text className="text-[0.70rem] font-['Lato'] text-opacity-75 leading-3 text-white">
                    {subskill.name}
                    {skill.items.length - 1 !== index ? "," : ""}
                  </Text>
                )}
                {skill.type === "list" && (
                  <Text className="text-[0.70rem] font-['LatoThin'] text-opacity-75 leading-3 text-white">
                    - {subskill.name}
                  </Text>
                )}
              </Text>
            ))}
          </View>
        </View>
      </View>
    ))}
  </View>
);

export default Skills;
