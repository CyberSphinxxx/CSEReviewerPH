import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { examLevels } from "./exams";

export const subjects = pgTable("subjects", {
  id: text("id").primaryKey(),
  examLevelId: text("exam_level_id")
    .notNull()
    .references(() => examLevels.id, { onDelete: "cascade" }),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
  order: integer("order").default(0).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const topics = pgTable("topics", {
  id: text("id").primaryKey(),
  subjectId: text("subject_id")
    .notNull()
    .references(() => subjects.id, { onDelete: "cascade" }),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
  order: integer("order").default(0).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const subjectsRelations = relations(subjects, ({ one, many }) => ({
  examLevel: one(examLevels, {
    fields: [subjects.examLevelId],
    references: [examLevels.id],
  }),
  topics: many(topics),
}));

export const topicsRelations = relations(topics, ({ one }) => ({
  subject: one(subjects, {
    fields: [topics.subjectId],
    references: [subjects.id],
  }),
}));
