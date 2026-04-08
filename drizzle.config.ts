import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: ["./lib/auth/auth-schema.ts", "./lib/billing/stripe-schema.ts"],
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
