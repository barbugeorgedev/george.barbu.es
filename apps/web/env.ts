import { validateEnv } from "env";

const envVariables: Record<string, unknown> = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
};
const env = validateEnv(envVariables);

export default env;
