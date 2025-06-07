import { pool } from "../db/forums/index.js";

export async function ensureUserExists(user_id: string, name: string, avatar: string) {
  await pool.query(
    `INSERT INTO users (id, name, avatar)
     VALUES ($1, $2, $3)
     ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, avatar = EXCLUDED.avatar`,
    [user_id, name, avatar]
  );
}
