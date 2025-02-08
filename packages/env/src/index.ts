import { envSchema } from "./schema";

export function validateEnv(env: Record<string, unknown>) {
  const parsedEnv = envSchema.safeParse(env);

  if (!parsedEnv.success) {
    console.error(
      "❌ Invalid environment variables:",
      parsedEnv.error.flatten().fieldErrors,
    );
    throw new Error("Invalid environment variables");
  }

  return parsedEnv.data;
}
