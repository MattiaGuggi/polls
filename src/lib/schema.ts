import { pgTable, uuid, varchar, text, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Embedded Participant Interface (formerly subdocument schema)
export interface Participant {
  name: string;
  image?: string;
  rating?: number;
}

// Users Table
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  surname: varchar("surname", { length: 255 }).notNull(),
  pfp: text("pfp").default("https://www.starksfamilyfh.com/image/9/original"),
});

// Polls Table
export const polls = pgTable("polls", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  creatorId: uuid("creator_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  participants: jsonb("participants")
    .$type<Participant[]>()
    .notNull()
    .default([]),
  scoreboard: jsonb("scoreboard")
    .$type<Participant[]>()
    .notNull()
    .default([]),
  image: text("image").default(
    "https://cdn.uwufufu.com/selection/1740749490505-Ana%20de%20Armas.jpg"
  ),
});

// Relations
export const pollsRelations = relations(polls, ({ one }) => ({
  creator: one(users, {
    fields: [polls.creatorId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  polls: many(polls),
}));

// TypeScript Type Inference
export type UserSelect = typeof users.$inferSelect;
export type UserInsert = typeof users.$inferInsert;
export type PollSelect = typeof polls.$inferSelect;
export type PollInsert = typeof polls.$inferInsert;