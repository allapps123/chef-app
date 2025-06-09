// File: api/index.ts (entry for Vercel serverless function)
import { config } from "dotenv";
config();
import express from "express";
import cors from "cors";
import forumRouter from "../routes/forumRoutes.js";
import serverless from "serverless-http";
import bodyParser from "body-parser";
import userPreferenceRouter from "../routes/userPreference.js";

const app = express();

app.use(cors());
// app.use(bodyParser.json({ limit: "10mb" }));
// app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

const router = express.Router();
// router.use(bodyParser.json({ limit: "10mb" }));
// router.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

// 🛠️ Raw body parser middleware to fix body parsing (bodyParser doesn't work for netlify)
app.use((req, res, next) => {
  let data = "";
  req.on("data", (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        req.body = JSON.parse(data || '{}');
      } catch (err) {
        req.body = {}; // Fallback if not JSON
      }
      next();
    });
  });

router.use("/forum", forumRouter);
router.use("/user-preference", userPreferenceRouter);

// This is important for Netlify Functions
app.use("/.netlify/functions/server", router);

// This is for local development
app.use("/", router);

const handler = serverless(app);

export { handler };

// app.listen(3000, () => {
//   console.log("Server is running on port 3000");
// });

// export default app;
