import { z } from "zod";

const urlSchema = z.string().refine(
  (val) => {
    try {
      new URL(val);
      return true;
    } catch {
      return false;
    }
  },
  { message: "Must be a valid URL" },
);

const envSchema = z.object({
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters"),
  DATABASE_URL: urlSchema,
  UPSTASH_REDIS_REST_URL: urlSchema,
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  MICROSOFT_GRAPH_TENANT_ID: z.string().min(1),
  MICROSOFT_GRAPH_CLIENT_ID: z.string().min(1),
  MICROSOFT_GRAPH_CLIENT_SECRET: z.string().min(1),
  NEXT_PUBLIC_BASE_URL: urlSchema,
  BLOB_READ_WRITE_TOKEN: z.string().min(1),
});

type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    const formatted = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Missing or invalid environment variables:\n${formatted}`);
  }
  return result.data;
}

let _env: Env | null = null;

export function getEnv(): Env {
  if (!_env) _env = validateEnv();
  return _env;
}
