import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const routineItems = pgTable("routine_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  url: text("url").notNull(),
  description: text("description"),
  order: integer("order").notNull().default(0),
  clickCount: integer("click_count").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`(datetime('now'))`),
});

export const insertRoutineItemSchema = createInsertSchema(routineItems).omit({
  id: true,
  clickCount: true,
  createdAt: true,
}).extend({
  url: z.string().url("Please enter a valid URL"),
  name: z.string().min(1, "Name is required").max(100, "Name must be 100 characters or less"),
  description: z.string().max(200, "Description must be 200 characters or less").optional(),
});

export const updateRoutineItemSchema = insertRoutineItemSchema.partial().extend({
  id: z.string(),
});

export type InsertRoutineItem = z.infer<typeof insertRoutineItemSchema>;
export type UpdateRoutineItem = z.infer<typeof updateRoutineItemSchema>;
export type RoutineItem = typeof routineItems.$inferSelect;
