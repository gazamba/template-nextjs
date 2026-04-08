import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: ["./lib/auth-schema.ts", "./lib/stripe-schema.ts"],
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
