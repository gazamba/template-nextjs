import { z } from "zod";

export const clientEnvSchema = z.object({
  NEXT_PUBLIC_POSTHOG_KEY: z
    .string()
    .min(1)
    .optional()
    .describe("PostHog project API key (starts with phc_)"),
  NEXT_PUBLIC_POSTHOG_HOST: z
    .string()
    .url()
    .default("https://us.i.posthog.com")
    .describe("PostHog ingestion host"),
  NEXT_PUBLIC_SENTRY_DSN: z
    .string()
    .url()
    .optional()
    .describe("Sentry DSN for error tracking (https://...@sentry.io/...)"),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;

class ClientEnvironment {
  private static instance: ClientEnv | null = null;

  static get(): ClientEnv {
    if (!this.instance) {
      // Each NEXT_PUBLIC_* var must be referenced explicitly by name.
      // Next.js replaces these at build time; process.env as an object
      // is not available in client bundles.
      const result = clientEnvSchema.safeParse({
        NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
        NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
      });
      if (!result.success) {
        const formatted = result.error.issues
          .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
          .join("\n");
        throw new Error(
          `\n\nClient environment validation failed:\n${formatted}\n`,
        );
      }
      this.instance = result.data;
    }
    return this.instance;
  }
}

export const clientEnv: ClientEnv = new Proxy({} as ClientEnv, {
  get(_target, prop: string) {
    return ClientEnvironment.get()[prop as keyof ClientEnv];
  },
});
