import { z } from "zod";

export const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_FEATURE_FLAG: z.string().optional(), // Optional variable
  PORT: z.string().default("3000"), // Default value if not provided
});
