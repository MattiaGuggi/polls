import { pgTable, uuid, varchar, text, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export interface IParticipant {
  name: string;
  image?: string;
  rating?: number;
}

// Users Table
export const users = pgTable("users", {
  _id: uuid("_id").defaultRandom().primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  name: varchar("name", { length: 255 }).default(""),
  surname: varchar("surname", { length: 255 }).default(""),
  pfp: text("pfp").default("https://www.starksfamilyfh.com/image/9/original"),
});

// Polls Table
export const polls = pgTable("polls", {
  _id: uuid("_id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  creator: uuid("creator")
    .notNull()
    .references(() => users._id, { onDelete: "cascade" }),
  participants: jsonb("participants").$type<IParticipant[]>().notNull().default([]),
  scoreboard: jsonb("scoreboard").$type<IParticipant[]>().notNull().default([]),
  image: text("image").default(
    "https://cdn.uwufufu.com/selection/1740749490505-Ana%20de%20Armas.jpg"
  ),
});

// Relational Definitions
export const pollsRelations = relations(polls, ({ one }) => ({
  creatorUser: one(users, {
    fields: [polls.creator],
    references: [users._id],
  }),
}));

export type IUser = typeof users.$inferSelect;
export type IPoll = typeof polls.$inferSelect;