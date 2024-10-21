import { config } from 'dotenv';
config();

/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./drizzle/schema.js",
  out: "./drizzle",
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.NEON_DB_URL,
  },
};