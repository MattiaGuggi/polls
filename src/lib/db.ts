import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import * as schema from "./schema";
import { users, polls } from "./schema";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("Please define the DATABASE_URL environment variable inside .env.local");
}

const sql = neon(DATABASE_URL);
export const db = drizzle(sql, { schema });

/**
 * Ensures database configuration is available
 */
export const connectDB = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined in environment variables.");
  }
};

/**
 * Helper function to get every user from PostgreSQL
 */
export const getUsersFromDb = async () => {
  await connectDB();
  return await db.select().from(users);
};

/**
 * Finds user in DB based on email
 */
export const getUserFromDb = async (criteria: { email: string }) => {
  await connectDB();
  const result = await db.select().from(users).where(eq(users.email, criteria.email));
  return result[0] || null;
};

/**
 * Creates user in DB
 */
export const createUserInDb = async (
  name: string,
  email: string,
  password: string,
  surname: string = ""
) => {
  await connectDB();

  const existingUser = await getUserFromDb({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const [newUser] = await db
    .insert(users)
    .values({
      username: name,
      email,
      password: hashedPassword,
      name,
      surname,
    })
    .returning();

  return newUser;
};

/**
 * Updates an existing user
 */
export const updateUserInDb = async (user: Partial<schema.UserSelect> & { id: string }) => {
  await connectDB();
  try {
    const { id, ...updateData } = user;
    const [updated] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning();
    return updated;
  } catch (err) {
    console.error("Error updating user", err);
  }
};

/**
 * Deletes user from DB
 */
export const deleteUserFromDb = async (user: { id: string }) => {
  await connectDB();
  try {
    await db.delete(users).where(eq(users.id, user.id));
  } catch (err) {
    console.error("Error deleting user", err);
  }
};

/**
 * Retrieves all polls from DB with populated creator details
 */
export async function getPolls() {
  try {
    await connectDB();
    return await db.query.polls.findMany({
      with: { creator: true },
    });
  } catch (err) {
    console.error("Error getting polls", err);
  }
}

/**
 * Updates an existing poll
 */
export async function updatePoll(newPoll: Partial<schema.PollSelect> & { id: string }) {
  try {
    await connectDB();
    const { id, ...updateData } = newPoll;
    const [updated] = await db
      .update(polls)
      .set(updateData)
      .where(eq(polls.id, id))
      .returning();

    return updated;
  } catch (err) {
    console.error("Error updating poll", err);
  }
}

/**
 * Finds poll in DB by ID with creator details
 */
export async function getPoll(id: string) {
  await connectDB();
  const poll = await db.query.polls.findFirst({
    where: eq(polls.id, id),
    with: { creator: true },
  });

  return poll || null;
}

/**
 * Creates poll in DB
 */
export async function createPoll(poll: schema.PollInsert) {
  try {
    await connectDB();
    const [newPoll] = await db.insert(polls).values(poll).returning();
    return newPoll;
  } catch (err) {
    console.error("Error creating poll", err);
  }
}

/**
 * Deletes a poll from the database by ID
 */
export async function deletePoll(id: string) {
  try {
    await connectDB();
    const [deleted] = await db.delete(polls).where(eq(polls.id, id)).returning();

    if (!deleted) {
      throw new Error("Poll not found");
    }

    return { success: true, message: "Poll deleted successfully" };
  } catch (err: any) {
    console.error("Error deleting poll", err);
    return { success: false, message: err.message || "Error deleting poll" };
  }
}