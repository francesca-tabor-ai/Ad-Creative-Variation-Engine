import { pgTable, text, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { renderJobs } from "./render-jobs";
import { deployments } from "./deployments";

export const assets = pgTable("assets", {
  id: text("id").primaryKey(),
  renderJobId: text("render_job_id")
    .notNull()
    .references(() => renderJobs.id),
  url: text("url").notNull(),
  format: text("format").notNull(),
  mimeType: text("mime_type").notNull(),
  fileSizeBytes: integer("file_size_bytes"),
  language: text("language").notNull().default("en"),
  tags: jsonb("tags").$type<string[]>(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const assetsRelations = relations(assets, ({ one, many }) => ({
  renderJob: one(renderJobs, {
    fields: [assets.renderJobId],
    references: [renderJobs.id],
  }),
  deployments: many(deployments),
}));
