import { View, Text } from "react-native";
import { Image } from "ui/image";

export default function Loading() {
  return (
    <View className="flex h-screen items-center justify-center bg-gray-100 z-50 absolute w-full bg-[#525659] top-0">
      <Image
        src="https://res.cloudinary.com/barbu-es/image/upload/v1692998696/george.barbu.cc/logo.png"
        alt="George Barbu Logo"
        className="w-[300px] h-[300px] center "
      />
    </View>
  );
}
