import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { creativeVariants } from "./creative-variants";
import { templates } from "./templates";
import { assets } from "./assets";

export const renderJobs = pgTable("render_jobs", {
  id: text("id").primaryKey(),
  variantId: text("variant_id")
    .notNull()
    .references(() => creativeVariants.id),
  templateId: text("template_id").references(() => templates.id),
  status: text("status").notNull().default("queued"),
  format: text("format").notNull(),
  resolution: text("resolution"),
  language: text("language").notNull().default("en"),
  priority: integer("priority").notNull().default(5),
  renderCostCents: integer("render_cost_cents"),
  errorMessage: text("error_message"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const renderJobsRelations = relations(renderJobs, ({ one }) => ({
  variant: one(creativeVariants, {
    fields: [renderJobs.variantId],
    references: [creativeVariants.id],
  }),
  template: one(templates, {
    fields: [renderJobs.templateId],
    references: [templates.id],
  }),
  asset: one(assets),
}));
