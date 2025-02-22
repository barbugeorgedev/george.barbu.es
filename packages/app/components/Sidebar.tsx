import { View } from "react-native";
import Summary from "app/components/Summary";
import Skills from "app/components/Skills";
import Contact from "app/components/Contact";
import DefaultComponentProps from "types/components";

const Sidebar: React.FC<DefaultComponentProps> = ({ className }) => {
  return (
    <View className={className}>
      <Summary className="leading-3 lg:mt-8" />
      <Skills />
      <Contact className="mt-10 leading-4 font-thin" />
    </View>
  );
};

export default Sidebar;
