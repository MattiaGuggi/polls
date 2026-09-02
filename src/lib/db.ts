import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import * as schema from "./schema";
import { users, polls } from "./schema";

const dbUrl = process.env.DATABASE_URL || process.env.MONGODB_URI || "";
const sql = neon(dbUrl);
export const db = drizzle(sql, { schema });

/**
 * Normalizes input to extract string IDs whether passed as a string or an object
 */
const getId = (val: any): string => {
  if (!val) return "";
  if (typeof val === "string") return val;
  return val._id || val.id || val.creator || "";
};

/**
 * Connects to PostgreSQL
 */
export const connectDB = async () => {
  if (!dbUrl) {
    throw new Error(
      "DATABASE_URL or MONGODB_URI is not set in environment variables."
    );
  }
};

/**
 * Helper function to get every user from DB
 */
export const getUsersFromDb = async () => {
  await connectDB();
  return await db.select().from(users);
};

/**
 * Finds user in DB based on email/username
 *
 * @param {criteria} criteria - The criteria
 * @returns {Promise<any | null>} User - A user saved in the DB
 */
export const getUserFromDb = async (criteria: { email?: string, _id?: string }) => {
  await connectDB();

  if (!criteria) return null;

  if (criteria._id) {
    const [user] = await db.select().from(users).where(eq(users._id, criteria._id));
    return user || null;
  }

  if (criteria.email) {
    const [user] = await db.select().from(users).where(eq(users.email, criteria.email));
    return user || null;
  }

  return null;
};

/**
 * Creates user in DB 
 *
 * @param {string} name - User's name / username
 * @param {string} email - Email address
 * @param {string} password - Password
 */
export const createUserInDb = async (name: string, email: string, password: string) => {
  await connectDB();
  const existingUser = await getUserFromDb({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const [user] = await db
    .insert(users)
    .values({
      username: name,
      email: email,
      password: hashedPassword,
      name: name,
      surname: "",
    })
    .returning();

  return user;
};

/**
 * Updates an existing user
 *
 * @param {any} user - the user you need to update
 */
export const updateUserInDb = async (user: any) => {
  await connectDB();
  try {
    const userId = getId(user);
    const [updated] = await db
      .update(users)
      .set(user)
      .where(eq(users._id, userId))
      .returning();
    return updated;
  } catch (err) {
    console.error("Error updating user", err);
  }
};

/**
 * Deletes user from DB
 *
 * @param {any} user - the user you need to delete
 */
export const deleteUserFromDb = async (user: any) => {
  await connectDB();
  try {
    const userId = getId(user);
    await db.delete(users).where(eq(users._id, userId));
  } catch (err) {
    console.error("Error deleting user", err);
  }
};

export async function getPolls() {
  try {
    await connectDB();
    const result = await db.select().from(polls);
    return result;
  } catch (err) {
    console.error("Error getting polls", err);
  }
}

export async function updatePoll(newPoll: any) {
  try {
    await connectDB();
    const pollId = getId(newPoll);
    const [updated] = await db
      .update(polls)
      .set(newPoll)
      .where(eq(polls._id, pollId))
      .returning();

    return updated || newPoll;
  } catch (err) {
    console.error("Error updating poll", err);
  }
}

export async function getPoll(id: string) {
  await connectDB();
  const pollId = getId(id);
  const result = await db.select().from(polls).where(eq(polls._id, pollId));
  return result[0] || null;
}

export async function createPoll(poll: any) {
  try {
    await connectDB();

    const creatorId = getId(poll.creator);
    const payload: any = {
      name: poll.name,
      creator: creatorId,
      participants: poll.participants || [],
      scoreboard: poll.scoreboard || [],
      image: poll.image,
    };

    if (poll._id) payload._id = poll._id;

    const [newPoll] = await db.insert(polls).values(payload).returning();
    return newPoll;
  } catch (err) {
    console.error("Error creating poll", err);
  }
}

export async function deletePoll(id: any) {
  try {
    await connectDB();
    const pollId = getId(id);

    const poll = await getPoll(pollId);
    if (!poll) {
      throw new Error("Poll not found");
    }

    await db.delete(polls).where(eq(polls._id, poll._id));
    return { success: true, message: "Poll deleted successfully" };
  } catch (err: any) {
    console.error("Error deleting poll", err);
    return { success: false, message: err.message };
  }
}