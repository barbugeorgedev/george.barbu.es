import React from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";

export interface ContactItem {
  service: string;
  value: string;
}

export interface ContactProps {
  data: {
    label: string;
    items: ContactItem[];
  };
  className?: string;
}

const Contact: React.FC<ContactProps> = ({ data, className }) => (
  <View className={className}>
    <Text className="uppercase font-Norwester text-xl text-primary-light mb-4">
      {data.label}
    </Text>
    <View className="text-[0.70rem] font-['LatoBlack']">
      <View>
        {data?.items.map((contact, index) => (
          <Text className="py-2" key={index}>
            {contact.service === "location" && (
              <Text className="text-[0.70rem] font-['Lato'] text-opacity-75 leading-6 text-white">
                {contact.value}
              </Text>
            )}
            {["phone", "homephone"].includes(contact.service) && (
              <TouchableOpacity
                onPress={() => Linking.openURL(`tel:${contact.value}`)}
                className="mr-1"
              >
                <Text className="text-[0.70rem] font-['Lato'] text-opacity-75 leading-6 text-white">
                  {contact.value}
                </Text>
              </TouchableOpacity>
            )}
            {contact.service === "website" && (
              <TouchableOpacity
                onPress={() => Linking.openURL(contact.value)}
                className="mr-1"
              >
                <Text className="text-[0.70rem] font-['Lato'] text-opacity-75 leading-6 text-white">
                  {contact.value}
                </Text>
              </TouchableOpacity>
            )}
            {contact.service === "email" && (
              <TouchableOpacity
                onPress={() => Linking.openURL(`mailto:${contact.value}`)}
                className="mr-1"
              >
                <Text className="text-[0.70rem] font-['Lato'] text-opacity-75 leading-4 text-white">
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

export default Contact;
