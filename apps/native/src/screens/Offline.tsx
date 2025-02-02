import { SafeAreaView, StatusBar, Text, TouchableOpacity } from "react-native";
import Icon from "ui/icon";
import React from "react";

interface NetworkCheckProps {
  title?: string;
  tryAgain?: string;
}

const Offline: React.FC<NetworkCheckProps> = ({
  title = "Nu ești conectat la internet",
  tryAgain = "Încearcă din nou",
}) => {
  const handlePress = () => {
    console.log("Attempt to reconnect");
  };

  return (
    <SafeAreaView className="flex-1 w-full text-gray bg-[#525659] items-center justify-center">
      <Icon
        name="wifi-off"
        type="fi"
        size={120}
        color="black"
        className="mb-5 text-primary-dark"
      />
      <Text className="text-white text-xl font-bold mb-5 mt-20">{title}</Text>
      <TouchableOpacity
        onPress={handlePress}
        className="bg-primary-light px-6 py-2 rounded-full mt-10"
      >
        <Text className="text-white font-semibold">{tryAgain}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Offline;
