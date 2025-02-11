export interface Skill {
  label: string;
  items: Subskill[];
}

export interface SkillsProps {
  data: Skill[]; // An array of Skill objects
}

interface Subskill {
  title: string;
}
