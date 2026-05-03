import { View, Text, TouchableOpacity, Linking } from "react-native";
import Icon from "ui/icon";
import { View as ViewWEB } from "ui/view";
import { useResumeData } from "app/context/ResumeContext";
import { useSettings } from "app/hooks/useSettings";
import { parseAtsPathname } from "app/utils/atsRoutes";

const Footer: React.FC = () => {
  const settings = useSettings();
  const resumeData = useResumeData();
  const social = Array.isArray(resumeData?.footer)
    ? resumeData?.footer[0]?.social || []
    : [];
  
  let isATS = false;
  if (typeof window !== "undefined") {
    const pathname = window.location.pathname;
    isATS = parseAtsPathname(pathname).mode !== "none";
  }

  const lightAtsPage = isATS;

  return (
    <ViewWEB
      data-exclude="true"
      className="max-w-screen-pdf py-6 mb-5 mx-auto items-center justify-between w-full md:flex lg:flex-row print:invisible"
      style={{
        backgroundColor: "transparent",
      }}
    >
      <View className="flex-row items-center tracking-wide mb-5 md:mb-0 justify-center ml-2 sm:ml-0">
        <Text
          className="text-sm mr-1 "
          style={{
            color: lightAtsPage ? "#171717" : settings?.footerTextColor?.hex,
          }}
        >
          © {new Date().getFullYear()} | Developed with
        </Text>

        <TouchableOpacity
          onPress={() => Linking.openURL("https://reactnative.dev")}
          className="mr-1"
        >
          <Icon type="gi" name="react" color="#58c4dc" size={12} />
        </TouchableOpacity>

        <Text
          className=" text-sm mr-1"
          style={{
            color: lightAtsPage ? "#171717" : settings?.footerTextColor?.hex,
          }}
        >
          by
        </Text>

        <TouchableOpacity onPress={() => Linking.openURL("/")}>
          <Text
            className="font-bold text-sm"
            style={{
              color: lightAtsPage ? "#171717" : settings?.footerLinkColor?.hex,
            }}
          >
            George Barbu
          </Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row items-center tracking-wide mb-5 md:mb-0 justify-center ml-2 sm:ml-0">
        {social.map((item: { service: string; url: string }) => (
          <TouchableOpacity
            key={item.service}
            onPress={() => Linking.openURL(item.url)}
          >
            <Text className="ml-4 last:ml-o">
              <Icon
                name={item.service}
                color={lightAtsPage ? "#171717" : settings?.footerIconsColor?.hex}
                className="!text-[28px]"
              />
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ViewWEB>
  );
};

export default Footer;
