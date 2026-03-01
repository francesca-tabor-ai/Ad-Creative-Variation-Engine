import { pgTable, text, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { campaigns } from "./campaigns";
import { reviews } from "./reviews";
import { renderJobs } from "./render-jobs";

export const creativeVariants = pgTable("creative_variants", {
  id: text("id").primaryKey(),
  campaignId: text("campaign_id")
    .notNull()
    .references(() => campaigns.id),
  parentVariantId: text("parent_variant_id"),
  status: text("status").notNull().default("draft"),
  version: integer("version").notNull().default(1),
  platform: text("platform").notNull(),
  funnelStage: text("funnel_stage").notNull(),
  angle: text("angle"),
  content: jsonb("content")
    .$type<{
      headline?: string;
      primaryText?: string;
      description?: string;
      callToAction?: string;
      imagePrompt?: string;
      imageUrl?: string;
    }>()
    .notNull(),
  aiProvider: text("ai_provider"),
  generationCostCents: integer("generation_cost_cents"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const creativeVariantsRelations = relations(creativeVariants, ({ one, many }) => ({
  campaign: one(campaigns, {
    fields: [creativeVariants.campaignId],
    references: [campaigns.id],
  }),
  parentVariant: one(creativeVariants, {
    fields: [creativeVariants.parentVariantId],
    references: [creativeVariants.id],
    relationName: "variantLineage",
  }),
  reviews: many(reviews),
  renderJobs: many(renderJobs),
}));
