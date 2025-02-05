import { View } from "react-native";
import Summary, { SummaryData } from "app/components/Summary";
import Skills, { Skill } from "app/components/Skills";
import Contact, { ContactItem } from "app/components/Contact"; // Import the ContactItem type

// Define the types for the props
interface SidebarProps {
  className?: string;
  summary: {
    label: string;
    text: string; // Rename 'content' to 'text'
  };
  contacts: {
    label: string;
    items: ContactItem[];
  };
  skills: Skill[];
}

// Updated Sidebar component
const Sidebar: React.FC<SidebarProps> = ({
  className,
  summary,
  contacts,
  skills,
}) => (
  <View className={className}>
    <Summary
      data={summary} // Use `summary` directly, now it has `text`
      className="text-white text-opacity-75 leading-3 lg:mt-8"
    />
    <Skills data={skills} />
    <Contact
      data={contacts} // Updated prop to match the new structure
      className="mt-10 text-white text-opacity-75 leading-4 font-thin"
    />
  </View>
);

export default Sidebar;
