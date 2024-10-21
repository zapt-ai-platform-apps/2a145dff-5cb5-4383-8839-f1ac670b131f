import { config } from 'dotenv';
config();

export default {
  schema: "./drizzle/schema.js",
  out: "./drizzle",
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.NEON_DB_URL,
  },
};