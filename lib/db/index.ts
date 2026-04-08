import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as authSchema from "@/lib/auth/auth-schema";
import { env } from "@/lib/env/server";
import * as stripeSchema from "@/lib/billing/stripe-schema";

const schema = { ...authSchema, ...stripeSchema };

const sql = neon(env.DATABASE_URL);
export const db = drizzle(sql, { schema });
