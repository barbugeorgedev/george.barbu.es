import { validateEnv } from "env";
import {
  NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_SANITY_STUDIO_URL,
  NEXT_PUBLIC_SANITY_WEBHOOK_SECRET,
  NEXT_PUBLIC_SANITY_PROJECT_ID,
  NEXT_PUBLIC_SANITY_DATASET,
} from "@env";

const env = validateEnv({
  NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_SANITY_STUDIO_URL,
  NEXT_PUBLIC_SANITY_WEBHOOK_SECRET,
  NEXT_PUBLIC_SANITY_PROJECT_ID,
  NEXT_PUBLIC_SANITY_DATASET,
});

export default env;
