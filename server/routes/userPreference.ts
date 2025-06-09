// File: routes/userPreferenceRoute.ts
import express from "express";
import { pool } from "../db/index.js";
import { verifyFirebaseToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET user preference
router.get("/", verifyFirebaseToken, async (req, res) => {
  const user_id = (req as any).user.uid;

  try {
    const result = await pool.query(
      `SELECT * FROM user_preferences WHERE user_id = $1`,
      [user_id]
    );
    if (result.rows.length === 0) {
      res.status(404).json({ message: "No preferences found." });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching preferences:", err);
    res.status(500).json({ error: "Database error" });
    return;
  }
});

// POST or UPDATE user preference
router.post("/", verifyFirebaseToken, async (req, res) => {
  const user_id = (req as any).user.uid;
  const {
    dietType,
    otherDiet,
    allergies,
    otherAllergy,
    dislikedIngredients,
    goal,
    otherGoal,
    preferredCuisines,
    otherCuisine,
    status,
  } = req.body;

  try {
    const result = await pool.query(
      `
      INSERT INTO user_preferences (
        user_id, diet_type, other_diet, allergies, other_allergy,
        disliked_ingredients, goal, other_goal, preferred_cuisines,
        other_cuisine, status, updated_at
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW()
      )
      ON CONFLICT (user_id)
      DO UPDATE SET
        diet_type = EXCLUDED.diet_type,
        other_diet = EXCLUDED.other_diet,
        allergies = EXCLUDED.allergies,
        other_allergy = EXCLUDED.other_allergy,
        disliked_ingredients = EXCLUDED.disliked_ingredients,
        goal = EXCLUDED.goal,
        other_goal = EXCLUDED.other_goal,
        preferred_cuisines = EXCLUDED.preferred_cuisines,
        other_cuisine = EXCLUDED.other_cuisine,
        status = EXCLUDED.status,
        updated_at = NOW()
      RETURNING *;
    `,
      [
        user_id,
        dietType,
        otherDiet,
        allergies,
        otherAllergy,
        dislikedIngredients,
        goal,
        otherGoal,
        preferredCuisines,
        otherCuisine,
        status,
      ]
    );
    res.json(result.rows[0]);
    return;
  } catch (err) {
    console.error("Error saving preferences:", err);
    res.status(500).json({ error: "Database error" });
    return;
  }
});

router.post("/status", verifyFirebaseToken, async (req, res) => {
  const { uid, name, picture } = (req as any).user;

  try {
    const client = await pool.connect();

    // Check if user already exists
    const existingUser = await client.query(
      "SELECT * FROM users WHERE id = $1",
      [uid]
    );

    if (existingUser.rows.length === 0) {
      // Insert into users table
      await client.query(
        "INSERT INTO users (id, name, avatar) VALUES ($1, $2, $3)",
        [uid, name || "Anonymous", picture || null]
      );

      // Insert into user_preferences with status inactive
      await client.query(
        "INSERT INTO user_preferences (user_id, status) VALUES ($1, $2)",
        [uid, "inactive"]
      );

      res.status(201).json({ message: "User and preference initialized." });
    } else {
      res.status(200).json({ message: "User already initialized." });
    }

    client.release();
  } catch (err) {
    console.error("Error initializing user:", err);
    res.status(500).json({ error: "Initialization error" });
  }
});

export default router;
