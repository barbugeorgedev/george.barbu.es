import "react-native-gesture-handler"; // Ensure this is at the top
import { registerRootComponent } from "expo";
import { ExpoRoot } from "expo-router";
import { Platform } from "react-native";

// Polyfill setImmediate if not available
if (typeof global.setImmediate === "undefined") {
  global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);
}

// Must be exported or Fast Refresh won't update the context
export function App() {
  const ctx = require.context("./app");
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
