import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { serverEnvSchema } from "../lib/env/server";

const __dirname = dirname(fileURLToPath(import.meta.url));

function getPrefix(key: string): string {
  if (key.startsWith("NEXT_PUBLIC_POSTHOG")) return "PostHog";
  if (key.startsWith("NEXT_PUBLIC_SENTRY")) return "Sentry";
  if (key.startsWith("NEXT_PUBLIC_")) return "Client";
  if (key.startsWith("STRIPE")) return "Stripe";
  if (key.startsWith("UPSTASH")) return "Upstash";
  if (key.startsWith("BETTER_AUTH")) return "Auth";
  if (key.startsWith("DATABASE")) return "Database";
  if (key.startsWith("PINECONE")) return "Pinecone";
  if (key.startsWith("RESEND")) return "Resend";
  return "General";
}

function generate() {
  const shape = serverEnvSchema.shape;
  const keys = Object.keys(shape) as (keyof typeof shape)[];

  // Parse with empty object to discover defaults
  const defaults: Record<string, string> = {};
  const result = serverEnvSchema.safeParse({});
  if (result.success) {
    for (const [k, v] of Object.entries(result.data)) {
      if (v !== undefined) defaults[k] = String(v);
    }
  }

  // Also try parsing to get defaults even when validation fails
  // by checking each field individually
  for (const key of keys) {
    const fieldSchema = shape[key];
    const fieldResult = fieldSchema.safeParse(undefined);
    if (fieldResult.success && fieldResult.data !== undefined) {
      defaults[String(key)] = String(fieldResult.data);
    }
  }

  // Group by prefix
  const groups = new Map<string, string[]>();
  for (const key of keys) {
    const prefix = getPrefix(String(key));
    if (!groups.has(prefix)) groups.set(prefix, []);
    groups.get(prefix)!.push(String(key));
  }

  const lines: string[] = [
    "# Environment Variables",
    "# Generated from lib/env/server.ts — do not edit manually",
    "# Run: pnpm env:example",
    "",
  ];

  for (const [section, vars] of groups) {
    lines.push(`# === ${section} ===`);
    for (const key of vars) {
      const fieldSchema = shape[key as keyof typeof shape];
      const desc = fieldSchema.description;
      const hasDefault = key in defaults;

      if (desc) {
        lines.push(`# ${desc}${hasDefault ? " (optional)" : ""}`);
      }
      lines.push(`${key}=${defaults[key] ?? ""}`);
    }
    lines.push("");
  }

  const output = lines.join("\n");
  const outPath = resolve(__dirname, "..", ".env.example");
  writeFileSync(outPath, output);
  console.log(`Generated .env.example with ${keys.length} variables`);
}

generate();
