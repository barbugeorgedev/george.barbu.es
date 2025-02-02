import { View, Text, TouchableOpacity, Linking } from "react-native";
import Icon from "ui/icon";

interface SocialLink {
  service: string;
  url: string;
}

interface FooterProps {
  social?: SocialLink[];
}

const Footer: React.FC<FooterProps> = ({ social }) => {
  return (
    <View
      data-exclude="true"
      className="max-w-screen-pdf py-6 mb-5 mx-auto items-center justify-between w-full md:flex lg:flex-row"
    >
      <View className="flex-row items-center tracking-wide mb-5 md:mb-0 justify-center ml-2 text-gray sm:ml-0">
        <Text className="text-gray text-sm mr-1 ">
          © {new Date().getFullYear()} | Developed with
        </Text>

        <TouchableOpacity
          onPress={() => Linking.openURL("https://reactnative.dev")}
          className=" mr-1"
        >
          <Icon type="gi" name="react" color="#58c4dc" size={12} />
        </TouchableOpacity>

        <Text className="text-gray text-sm mr-1">by</Text>

        <TouchableOpacity onPress={() => Linking.openURL("/")}>
          <Text className="text-primary-dark  hover:text-primary font-bold text-sm">
            George Barbu
          </Text>
        </TouchableOpacity>
      </View>

      {social && (
        <Text className="flex items-center justify-center mr-2 last:ml-o sm:mr-0 md:ml-2 lg:justify-between">
          {social.map((item) => (
            <TouchableOpacity
              key={item.service}
              onPress={() => Linking.openURL(item.url)}
            >
              <Text className="text-gray ml-4 last:ml-o hover:text-gray">
                <Icon
                  name={item.service}
                  color="#313638"
                  className="!text-[28px]"
                />
              </Text>
            </TouchableOpacity>
          ))}
        </Text>
      )}
    </View>
  );
};

export default Footer;
