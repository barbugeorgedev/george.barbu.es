import { envSchema } from "./schema";

export function validateEnv(env: Record<string, unknown>) {
  const parsedEnv = envSchema.safeParse(env);

  if (!parsedEnv.success) {
    // Explicitly assert the type of fieldErrors
    const fieldErrors = parsedEnv.error.flatten().fieldErrors as Record<
      string,
      string[] | undefined
    >;

    const missingKeys = Object.keys(fieldErrors).filter((key) =>
      fieldErrors[key]?.includes("Required"),
    );

    console.error("❌ Missing environment variables:", missingKeys);

    throw new Error(
      `Invalid environment variables. Missing keys: ${missingKeys.join(", ")}`,
    );
  }

  return { validEnv: parsedEnv.data, missingKeys: [] };
}
