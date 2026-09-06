import { pgTable, text, timestamp, boolean, integer, numeric, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const exams = pgTable("exams", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const examLevels = pgTable("exam_levels", {
  id: text("id").primaryKey(),
  examId: text("exam_id")
    .notNull()
    .references(() => exams.id, { onDelete: "cascade" }),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const examRules = pgTable("exam_rules", {
  id: text("id").primaryKey(),
  examLevelId: text("exam_level_id")
    .notNull()
    .references(() => examLevels.id, { onDelete: "cascade" }),
  mode: text("mode").notNull(), // 'quick' | 'medium' | 'full'
  itemCount: integer("item_count").notNull(),
  timeLimitMinutes: integer("time_limit_minutes").notNull(),
  passingScorePercentage: numeric("passing_score_percentage", { precision: 5, scale: 2 }).notNull().default("80.00"),
  subjectDistribution: jsonb("subject_distribution").notNull().$type<Record<string, number>>(),
  difficultyDistribution: jsonb("difficulty_distribution").notNull().$type<Record<string, number>>(),
  allowsFlagging: boolean("allows_flagging").default(true).notNull(),
  hasContinuousTimer: boolean("has_continuous_timer").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const examsRelations = relations(exams, ({ many }) => ({
  levels: many(examLevels),
}));

export const examLevelsRelations = relations(examLevels, ({ one, many }) => ({
  exam: one(exams, {
    fields: [examLevels.examId],
    references: [exams.id],
  }),
  rules: many(examRules),
}));

export const examRulesRelations = relations(examRules, ({ one }) => ({
  examLevel: one(examLevels, {
    fields: [examRules.examLevelId],
    references: [examLevels.id],
  }),
}));
