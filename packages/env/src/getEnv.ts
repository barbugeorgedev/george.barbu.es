// packages/env/src/resolveEnv.ts
import { Platform } from "react-native";

export const getEnv = () => {
  if (Platform.OS === "web") {
    return require("../../../apps/web/env").default.validEnv;
  } else {
    return require("../../../apps/native/env").default.validEnv;
  }
};
