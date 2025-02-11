import { View } from "react-native";
import Summary from "app/components/Summary";
import Skills from "app/components/Skills";
import Contact from "app/components/Contact";
import { SidebarProps } from "types/components";

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
