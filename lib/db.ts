import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as authSchema from "./auth-schema";
import { env } from "./env/server";
import * as stripeSchema from "./stripe-schema";

const schema = { ...authSchema, ...stripeSchema };

const sql = neon(env.DATABASE_URL);
export const db = drizzle(sql, { schema });
