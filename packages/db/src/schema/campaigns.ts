import { pgTable, text, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { creativeVariants } from "./creative-variants";

export const campaigns = pgTable("campaigns", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("draft"),
  brandName: text("brand_name").notNull(),
  targetPlatforms: jsonb("target_platforms").$type<string[]>().notNull(),
  funnelStage: text("funnel_stage").notNull(),
  targetAudience: text("target_audience"),
  offerDetails: text("offer_details"),
  budgetCents: integer("budget_cents"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdBy: text("created_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  creator: one(users, {
    fields: [campaigns.createdBy],
    references: [users.id],
  }),
  variants: many(creativeVariants),
}));
