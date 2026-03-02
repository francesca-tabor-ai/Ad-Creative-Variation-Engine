import { pgTable, text, timestamp, integer, jsonb, real, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { campaigns } from "./campaigns";

export const governanceConfigs = pgTable("governance_configs", {
  id: text("id").primaryKey(),
  campaignId: text("campaign_id")
    .notNull()
    .references(() => campaigns.id)
    .unique(),
  approvalThreshold: real("approval_threshold").notNull().default(0.6),
  requiredReviewerCount: integer("required_reviewer_count").notNull().default(1),
  vetoRoles: jsonb("veto_roles").$type<string[]>().default([]),
  voteWeights: jsonb("vote_weights").$type<Record<string, number>>().default({}),
  autoApproveIfUnanimous: boolean("auto_approve_if_unanimous").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const governanceConfigsRelations = relations(governanceConfigs, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [governanceConfigs.campaignId],
    references: [campaigns.id],
  }),
}));

export const governanceAuditLog = pgTable("governance_audit_log", {
  id: text("id").primaryKey(),
  campaignId: text("campaign_id")
    .notNull()
    .references(() => campaigns.id),
  variantId: text("variant_id"),
  action: text("action").notNull(),
  actorId: text("actor_id"),
  previousStatus: text("previous_status"),
  newStatus: text("new_status"),
  details: jsonb("details").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const governanceAuditLogRelations = relations(governanceAuditLog, ({ one }) => ({
  campaign: one(campaigns, {
    fields: [governanceAuditLog.campaignId],
    references: [campaigns.id],
  }),
}));
