import path from "path";
import dotenv from "dotenv";

// Explicitly load env files
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { polls, IParticipant } from "./schema";

// Check Database URL
const connectionString =
  process.env.NEON_DATABASE_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL;

if (!connectionString) {
  console.error("❌ ERROR: Connection string is undefined!");
  process.exit(1);
}

const token = process.env.UPLOADTHING_TOKEN;

if (!token) {
  console.error("❌ ERROR: UPLOADTHING_TOKEN is not defined in your environment variables!");
  process.exit(1);
}

// Initialize Uploadthing API client
const utapi = new UTApi({ token });

const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

const db = drizzle(pool);

async function uploadBase64ToUploadthing(base64String: string): Promise<string | null> {
  if (!base64String || !base64String.startsWith("data:image")) return null;

  try {
    const matches = base64String.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) return null;

    const mimeType = matches[1];
    const ext = mimeType.split("/")[1] || "jpeg";
    const imageBuffer = Buffer.from(matches[2], "base64");

    const file = new File([imageBuffer], `poll-image-${Date.now()}.${ext}`, { type: mimeType });

    const response = await utapi.uploadFiles(file);

    if (response.error) {
      console.error("Uploadthing error:", response.error);
      return null;
    }

    return response.data.url;
  } catch (err) {
    console.error("Failed to upload image:", err);
    return null;
  }
}

async function runMigration() {
  console.log("Starting Uploadthing migration for POLLS only...");

  const allPolls = await db.select().from(polls);

  for (const poll of allPolls) {
    let updatedImage = poll.image;
    let isUpdated = false;

    // 1. Process main poll image
    if (poll.image && poll.image.startsWith("data:image")) {
      const newUrl = await uploadBase64ToUploadthing(poll.image);
      if (newUrl) {
        updatedImage = newUrl;
        isUpdated = true;
      }
    }

    // 2. Process participants JSONB array
    const updatedParticipants: IParticipant[] = [];
    for (const p of poll.participants || []) {
      if (p.image && p.image.startsWith("data:image")) {
        const newUrl = await uploadBase64ToUploadthing(p.image);
        updatedParticipants.push({ ...p, image: newUrl || p.image });
        isUpdated = true;
      } else {
        updatedParticipants.push(p);
      }
    }

    // 3. Process scoreboard JSONB array
    const updatedScoreboard: IParticipant[] = [];
    for (const p of poll.scoreboard || []) {
      if (p.image && p.image.startsWith("data:image")) {
        const newUrl = await uploadBase64ToUploadthing(p.image);
        updatedScoreboard.push({ ...p, image: newUrl || p.image });
        isUpdated = true;
      } else {
        updatedScoreboard.push(p);
      }
    }

    if (isUpdated) {
      await db
        .update(polls)
        .set({
          image: updatedImage,
          participants: updatedParticipants,
          scoreboard: updatedScoreboard,
        })
        .where(eq(polls._id, poll._id));
      console.log(`Updated Poll ID: ${poll._id}`);
    }
  }

  console.log("Polls migration completed!");
  await pool.end();
}

runMigration();