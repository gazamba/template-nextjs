import { z } from "zod";

export const serverEnvSchema = z.object({
  DATABASE_URL: z
    .string()
    .url()
    .describe("Neon PostgreSQL connection string (postgresql://...)"),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32)
    .describe("Secret key for better-auth session signing (min 32 chars). Generate with: openssl rand -base64 32"),
  BETTER_AUTH_URL: z
    .string()
    .url()
    .describe("Public URL of the app (e.g. http://localhost:3000)"),
  STRIPE_SECRET_KEY: z
    .string()
    .startsWith("sk_")
    .describe("Stripe secret key (starts with sk_)"),
  STRIPE_WEBHOOK_SECRET: z
    .string()
    .startsWith("whsec_")
    .describe("Stripe webhook signing secret (starts with whsec_)"),
  UPSTASH_REDIS_REST_URL: z
    .string()
    .url()
    .describe("Upstash Redis REST URL"),
  UPSTASH_REDIS_REST_TOKEN: z
    .string()
    .min(1)
    .describe("Upstash Redis REST token"),
  PINECONE_API_KEY: z
    .string()
    .min(1)
    .describe("Pinecone API key"),
  RESEND_API_KEY: z
    .string()
    .min(1)
    .describe("Resend API key for transactional emails"),
  NEXT_PUBLIC_POSTHOG_KEY: z
    .string()
    .min(1)
    .describe("PostHog project API key (starts with phc_)"),
  NEXT_PUBLIC_POSTHOG_HOST: z
    .string()
    .url()
    .default("https://us.i.posthog.com")
    .describe("PostHog ingestion host"),
  NEXT_PUBLIC_SENTRY_DSN: z
    .string()
    .url()
    .describe("Sentry DSN for error tracking (https://...@sentry.io/...)"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

class Environment {
  private static instance: ServerEnv | null = null;

  static get(): ServerEnv {
    if (!this.instance) {
      const result = serverEnvSchema.safeParse(process.env);
      if (!result.success) {
        const formatted = result.error.issues
          .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
          .join("\n");
        throw new Error(
          `\n\nEnvironment validation failed:\n${formatted}\n\n` +
            `Copy .env.example to .env and fill in the missing values.\n`,
        );
      }
      this.instance = result.data;
    }
    return this.instance;
  }
}

export const env: ServerEnv = new Proxy({} as ServerEnv, {
  get(_target, prop: string) {
    return Environment.get()[prop as keyof ServerEnv];
  },
});
