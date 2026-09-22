import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import DefaultComponentProps from "types/components";
import { useResumeData } from "app/context/ResumeContext";
import { useSettings } from "app/hooks/useSettings";

/**
 * Link target per contact service, or `null` for plain text.
 *
 * `web` is what the CMS stores; the component previously only matched
 * `website`, so the site link never rendered. `linkedin` and `github` had no
 * branch at all and were dropped silently.
 */
function hrefFor(service: string, value: string): string | null {
  switch (service) {
    case "phone":
    case "homephone":
      return `tel:${value.replace(/\s+/g, "")}`;
    case "email":
      return `mailto:${value}`;
    case "web":
    case "website":
    case "linkedin":
    case "github":
      return /^https?:\/\//i.test(value) ? value : `https://${value}`;
    default:
      return null;
  }
}

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
          {data?.items.map((contact, index) => {
            const href = hrefFor(contact.service, contact.value);

            const label = (
              <Text
                className="text-[0.70rem] font-['Lato'] leading-6"
                style={{
                  color: settings?.sidebarTextColor?.hex,
                }}
              >
                {contact.showLabel && contact.label && (
                  <Text
                    style={{
                      color: settings?.sidebarSectionTextColor?.hex,
                    }}
                  >
                    {contact.label}
                  </Text>
                )}
                {contact.value}
              </Text>
            );

            return (
              <Text className="py-2" key={index}>
                {href ? (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(href)}
                    className="mr-1"
                  >
                    {label}
                  </TouchableOpacity>
                ) : (
                  label
                )}
              </Text>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default Contact;
