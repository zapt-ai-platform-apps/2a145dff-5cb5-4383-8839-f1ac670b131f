import { config } from 'dotenv';
config();

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: "./drizzle/schema.js",
  out: "./drizzle",
  dialect: 'postgres',
  dbCredentials: {
    connectionString: process.env.NEON_DB_URL,
  },
});