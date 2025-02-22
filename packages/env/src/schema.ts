import { z } from "zod";
import { Platform } from "react-native";

// Define the base schema
const baseSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_SANITY_STUDIO_URL: z.string().url(),
  NEXT_PUBLIC_SANITY_WEBHOOK_SECRET: z.string(),
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string(),
  NEXT_PUBLIC_SANITY_DATASET: z.string(),
});

// Define the additional fields for web
const webSchema = z.object({
  NEXT_PUBLIC_BLOB_PROJECT_ID: z.string(),
  NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN: z.string(),
  NEXT_PUBLIC_BLOB_STORAGE_NAME: z.string(),
  NEXT_PUBLIC_REVALIDATE_SECRET: z.string(),
  NEXT_PUBLIC_GA_TRACKING_ID: z.string(),
});

// Define the additional fields for native
const nativeSchema = z.object({
  NEXT_PUBLIC_PORT: z.string().default("8081"),
});

// Merge based on platform
export const envSchema =
  Platform.OS === "web"
    ? baseSchema.merge(webSchema)
    : baseSchema.merge(nativeSchema);
