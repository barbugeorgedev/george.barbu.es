import { View, Text } from "react-native";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import "../styles/global.css";

export default function RootTemplate() {
  const [fontsLoaded] = useFonts({
    Norwester: require("assets/fonts/Norwester/Norwester.otf"),
    Montserrat: require("assets/fonts/Montserrat/Montserrat-Black.ttf"),
    MontserratLight: require("assets/fonts/Montserrat/Montserrat-Light.ttf"),
    MontserratSemiBold: require("assets/fonts/Montserrat/Montserrat-SemiBold.ttf"),
    Lato: require("assets/fonts/Lato/Lato-Regular.ttf"),
    LatoBlack: require("assets/fonts/Lato/Lato-Black.ttf"),
    LatoThin: require("assets/fonts/Lato/Lato-Thin.ttf"),
  });

  if (!fontsLoaded) {
    return <Text>Loading Fonts...</Text>;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
