import { View, Text } from "react-native";

export default function Loading() {
  return (
    <View className="flex h-screen items-center justify-center bg-gray-100">
      <Text className="text-lg font-semibold text-gray-700">Loading...</Text>
    </View>
  );
}
