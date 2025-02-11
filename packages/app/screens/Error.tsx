import { View, Text } from "react-native";
import { ErrorProps } from "types/components";

export default function Error({ message }: ErrorProps) {
  return (
    <View className="flex h-screen items-center justify-center bg-red-100">
      <Text className="text-lg font-semibold text-red-700">
        {message || "Something went wrong!"}
      </Text>
    </View>
  );
}
