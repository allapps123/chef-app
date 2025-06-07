import type { Request, Response, NextFunction } from "express";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { config } from "dotenv";

config();

// Initialize Firebase Admin SDK once
if (getApps().length === 0) {
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } =
    process.env;

  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    throw new Error("❌ Missing Firebase service account env variables");
  }

  initializeApp({
    credential: cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

export async function verifyFirebaseToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  console.log("authHeader", authHeader);

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await getAuth().verifyIdToken(token);
    (req as any).user = decoded;
    next();
  } catch (err) {
    console.error("❌ Invalid token:", err);
    res.status(403).json({ error: "Forbidden" });
  }
}
