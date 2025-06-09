import express from "express";
import { pool } from "../db/index.js";
import { verifyFirebaseToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Helper: Ensure user exists
async function ensureUserExists(user_id: string, name: string, avatar: string) {
  await pool.query(
    `INSERT INTO users (id, name, avatar)
     VALUES ($1, $2, $3)
     ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, avatar = EXCLUDED.avatar`,
    [user_id, name, avatar]
  );
}

// GET all threads with category name, like count, replies count, and user info
router.get("/threads", async (req, res) => {
  const { user_id } = req.query;
  try {
    const result = await pool.query(
      `SELECT th.*, cat.name AS category_name,
                u.name AS user_name, u.avatar AS user_avatar,
                COALESCE(like_count.count, 0) AS like_count,
                COALESCE(reply_count.count, 0) AS replies_count,
                CASE WHEN ul.user_id IS NOT NULL THEN true ELSE false END AS liked_by_user
         FROM public.threads th
         JOIN public.categories cat ON th.category_id = cat.id
         JOIN users u ON u.id = th.user_id
         LEFT JOIN (
           SELECT thread_id, COUNT(*) as count
           FROM public.likes
           WHERE thread_id IS NOT NULL
           GROUP BY thread_id
         ) like_count ON like_count.thread_id = th.id
         LEFT JOIN (
           SELECT thread_id, COUNT(*) as count
           FROM public.replies
           GROUP BY thread_id
         ) reply_count ON reply_count.thread_id = th.id
         LEFT JOIN (
           SELECT thread_id, user_id FROM public.likes
           WHERE thread_id IS NOT NULL AND user_id = $1
         ) ul ON ul.thread_id = th.id
         ORDER BY th.created_at DESC`,
      [user_id || null]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching threads:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET a single thread by ID with its replies, like count, and liked_by_user status
router.get("/threads/:id", async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.query;

  try {
    // Fetch thread with user, like count, and liked_by_user
    const threadResult = await pool.query(
      `SELECT th.*, cat.name AS category_name,
              u.name AS user_name, u.avatar AS user_avatar,
              COALESCE(like_count.count, 0) AS like_count,
              CASE WHEN ul.user_id IS NOT NULL THEN true ELSE false END AS liked_by_user
       FROM public.threads th
       JOIN public.categories cat ON th.category_id = cat.id
       JOIN users u ON u.id = th.user_id
       LEFT JOIN (
         SELECT thread_id, COUNT(*) as count
         FROM public.likes
         WHERE thread_id IS NOT NULL
         GROUP BY thread_id
       ) like_count ON like_count.thread_id = th.id
       LEFT JOIN (
         SELECT thread_id, user_id FROM public.likes
         WHERE thread_id IS NOT NULL AND user_id = $2
       ) ul ON ul.thread_id = th.id
       WHERE th.id = $1`,
      [id, user_id]
    );

    if (threadResult.rows.length === 0) {
      res.status(404).json({ error: "Thread not found" });
    }

    // Fetch replies with user, like count, and liked_by_user
    const repliesResult = await pool.query(
      `SELECT rp.*, u.name AS user_name, u.avatar AS user_avatar,
              COALESCE(like_count.count, 0) AS like_count,
              CASE WHEN ul.user_id IS NOT NULL THEN true ELSE false END AS liked_by_user
       FROM replies rp
       JOIN users u ON u.id = rp.user_id
       LEFT JOIN (
         SELECT reply_id, COUNT(*) as count
         FROM public.likes
         WHERE reply_id IS NOT NULL
         GROUP BY reply_id
       ) like_count ON like_count.reply_id = rp.id
       LEFT JOIN (
         SELECT reply_id, user_id FROM public.likes
         WHERE reply_id IS NOT NULL AND user_id = $2
       ) ul ON ul.reply_id = rp.id
       WHERE rp.thread_id = $1
       ORDER BY rp.created_at ASC`,
      [id, user_id]
    );

    res.status(200).json({
      ...threadResult.rows[0],
      replies: repliesResult.rows,
    });
  } catch (err) {
    console.error("Error fetching thread:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST a new thread
router.post("/threads", verifyFirebaseToken, async (req, res) => {
  const { category_id, user_id, title, content, user_name, user_avatar } =
    req.body;
  if (!category_id || !user_id || !title || !content || !user_name) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    await ensureUserExists(user_id, user_name, user_avatar);

    const result = await pool.query(
      `INSERT INTO public.threads (category_id, user_id, title, content)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [category_id, user_id, title, content]
    );
    res.status(201).json(result.rows[0]);
    return;
  } catch (err) {
    console.error("Error creating thread:", err);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
});

// POST a reply to a thread
router.post("/threads/:id/replies", verifyFirebaseToken, async (req, res) => {
  const { id: thread_id } = req.params;
  const { user_id, content, user_name, user_avatar } = req.body;

  if (!user_id || !content || !user_name) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    await ensureUserExists(user_id, user_name, user_avatar);

    const result = await pool.query(
      `INSERT INTO replies (thread_id, user_id, content)
       VALUES ($1, $2, $3) RETURNING *`,
      [thread_id, user_id, content]
    );
    res.status(201).json(result.rows[0]);
    return;
  } catch (err) {
    console.error("Error creating reply:", err);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
});

// PUT like/unlike a thread
router.put("/threads/:id/like", verifyFirebaseToken, async (req, res) => {
  console.log("Raw body:", req.body);
  const { user_id, user_name, user_avatar } = req.body;
  const { id } = req.params;

  console.log("Like request:", { user_id, thread_id: id, body: req.body });

  if (!user_id) {
    console.error("Missing user_id in request body");
    res.status(400).json({ error: "Missing user_id" });
    return;
  }

  try {
    await ensureUserExists(user_id, user_name, user_avatar);

    const existing = await pool.query(
      `SELECT * FROM public.likes WHERE thread_id = $1 AND user_id = $2`,
      [id, user_id]
    );

    if (existing.rows.length > 0) {
      await pool.query(
        `DELETE FROM public.likes WHERE thread_id = $1 AND user_id = $2`,
        [id, user_id]
      );
      res.status(200).json({ liked: false });
      return;
    } else {
      await pool.query(
        `INSERT INTO public.likes (thread_id, reply_id, user_id) VALUES ($1, NULL, $2)`,
        [id, user_id]
      );
      res.status(200).json({ liked: true });
      return;
    }
  } catch (err) {
    console.error("Error updating thread like:", err);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
});

// PUT like/unlike a reply
router.put("/replies/:id/like", verifyFirebaseToken, async (req, res) => {
  const { user_id, user_name, user_avatar } = req.body;
  const { id } = req.params;

  if (!user_id) {
    res.status(400).json({ error: "Missing user_id" });
    return;
  }

  try {
    await ensureUserExists(user_id, user_name, user_avatar);
    const existing = await pool.query(
      `SELECT * FROM public.likes WHERE reply_id = $1 AND user_id = $2`,
      [id, user_id]
    );

    if (existing.rows.length > 0) {
      await pool.query(
        `DELETE FROM public.likes WHERE reply_id = $1 AND user_id = $2`,
        [id, user_id]
      );
      res.status(200).json({ liked: false });
      return;
    } else {
      await pool.query(
        `INSERT INTO public.likes (thread_id, reply_id, user_id) VALUES (NULL, $1, $2)`,
        [id, user_id]
      );
      res.status(200).json({ liked: true });
      return;
    }
  } catch (err) {
    console.error("Error updating reply like:", err);
    res.status(500).json({ error: "Internal Server Error" });
    return;
  }
});

export default router;
