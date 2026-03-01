import { pgTable, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { assets } from "./assets";
import { campaigns } from "./campaigns";

export const deployments = pgTable("deployments", {
  id: text("id").primaryKey(),
  assetId: text("asset_id")
    .notNull()
    .references(() => assets.id),
  campaignId: text("campaign_id")
    .notNull()
    .references(() => campaigns.id),
  platform: text("platform").notNull(),
  status: text("status").notNull().default("pending"),
  platformAdId: text("platform_ad_id"),
  platformCampaignId: text("platform_campaign_id"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  deployedAt: timestamp("deployed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const deploymentsRelations = relations(deployments, ({ one }) => ({
  asset: one(assets, {
    fields: [deployments.assetId],
    references: [assets.id],
  }),
  campaign: one(campaigns, {
    fields: [deployments.campaignId],
    references: [campaigns.id],
  }),
}));
