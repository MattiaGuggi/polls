import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("Please define the DATABASE_URL environment variable in .env.local");
}

const sql = neon(DATABASE_URL);
export const db = drizzle(sql, { schema });

/**
 * Neon HTTP connection helper for backwards compatibility
 */
export const connectDB = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("Please define the DATABASE_URL environment variable");
  }
};