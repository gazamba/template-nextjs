import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as authSchema from "./auth-schema";
import * as stripeSchema from "./stripe-schema";

const schema = { ...authSchema, ...stripeSchema };

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
