import { validateEnv } from "env";
import { NEXT_PUBLIC_API_URL, NODE_ENV } from "@env";

const env = validateEnv({ NEXT_PUBLIC_API_URL, NODE_ENV });

export default env;
