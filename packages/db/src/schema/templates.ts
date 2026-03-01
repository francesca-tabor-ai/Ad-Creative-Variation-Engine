import { pgTable, text, timestamp, integer, jsonb } from "drizzle-orm/pg-core";

export const templates = pgTable("templates", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  platform: text("platform").notNull(),
  format: text("format").notNull(),
  version: integer("version").notNull().default(1),
  components: jsonb("components").$type<Record<string, unknown>>(),
  constraints: jsonb("constraints").$type<{
    maxHeadlineLength?: number;
    maxPrimaryTextLength?: number;
    safeZone?: { top: number; right: number; bottom: number; left: number };
    fonts?: string[];
  }>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
