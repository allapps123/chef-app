// api/db/forums/index.ts

import { Pool } from 'pg';
import { config } from 'dotenv';

config();

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error('❌ DATABASE_URL is not defined.');
}

export const pool = new Pool({
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false, // Required for Neon or other managed Postgres
  },
});