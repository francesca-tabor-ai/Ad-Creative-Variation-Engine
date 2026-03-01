import { pgTable, text, timestamp, real } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { creativeVariants } from "./creative-variants";

export const reviews = pgTable("reviews", {
  id: text("id").primaryKey(),
  variantId: text("variant_id")
    .notNull()
    .references(() => creativeVariants.id),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  decision: text("decision").notNull(),
  weight: real("weight").notNull().default(1),
  comment: text("comment"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
  variant: one(creativeVariants, {
    fields: [reviews.variantId],
    references: [creativeVariants.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));
