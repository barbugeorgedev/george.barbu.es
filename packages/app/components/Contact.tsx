import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import DefaultComponentProps from "types/components";
import { useResumeData } from "app/context/ResumeContext";
import { useSettings } from "app/hooks/useSettings";

const Contact: React.FC<DefaultComponentProps> = ({ className }) => {
  const settings = useSettings();
  const resumeData = useResumeData();
  const data = resumeData?.sidebar[0]?.contactSection;

  return (
    <View className={className}>
      <Text
        className="uppercase font-['Norwester'] text-xl mb-4"
        style={{
          color: settings?.sidebarSectionTextColor?.hex,
        }}
      >
        {String(data?.label ?? "")}
      </Text>
      <View className="text-[0.70rem] font-['LatoBlack']">
        <View>
          {data?.items.map((contact, index) => (
            <Text className="py-2" key={index}>
              {contact.service === "location" && (
                <Text
                  className="text-[0.70rem] font-['Lato'] leading-6"
                  style={{
                    color: settings?.sidebarTextColor?.hex,
                  }}
                >
                  {contact.value}
                </Text>
              )}
              {["phone", "homephone"].includes(contact.service) && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel:${contact.value}`)}
                  className="mr-1"
                >
                  <Text
                    className="text-[0.70rem] font-['Lato'] leading-6"
                    style={{
                      color: settings?.sidebarTextColor?.hex,
                    }}
                  >
                    {contact.value}
                  </Text>
                </TouchableOpacity>
              )}
              {contact.service === "website" && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(contact.value)}
                  className="mr-1"
                >
                  <Text
                    className="text-[0.70rem] font-['Lato'] leading-6"
                    style={{
                      color: settings?.sidebarTextColor?.hex,
                    }}
                  >
                    {contact.value}
                  </Text>
                </TouchableOpacity>
              )}
              {contact.service === "email" && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(`mailto:${contact.value}`)}
                  className="mr-1"
                >
                  <Text
                    className="text-[0.70rem] font-['Lato'] leading-4"
                    style={{
                      color: settings?.sidebarTextColor?.hex,
                    }}
                  >
                    {contact.value}
                  </Text>
                </TouchableOpacity>
              )}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};

export default Contact;
