import { pgTable, text, boolean, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { examLevels } from "./exams";
import { topics } from "./subjects";
import { questions, choices } from "./questions";
import { users } from "./auth";

export const testAttempts = pgTable("test_attempts", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "set null" }), // nullable for guests
  guestSessionId: text("guest_session_id"), // for non-authenticated takers
  examLevelId: text("exam_level_id")
    .notNull()
    .references(() => examLevels.id, { onDelete: "cascade" }),
  mode: text("mode").notNull(), // 'practice' | 'quick' | 'medium' | 'full' | 'mistakes' | 'bookmarks'
  topicId: text("topic_id").references(() => topics.id, { onDelete: "set null" }), // optional for topic-specific practice
  totalQuestions: integer("total_questions").notNull(),
  score: integer("score").default(0).notNull(),
  percentage: numeric("percentage", { precision: 5, scale: 2 }).default("0.00").notNull(),
  passed: boolean("passed").default(false).notNull(),
  timeSpentSeconds: integer("time_spent_seconds").default(0).notNull(),
  timeRemainingSeconds: integer("time_remaining_seconds"),
  status: text("status").notNull().default("in_progress"), // 'in_progress' | 'completed' | 'abandoned' | 'timed_out'
  startedAt: timestamp("started_at", { withTimezone: true }).defaultNow().notNull(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export const userAnswers = pgTable("user_answers", {
  id: text("id").primaryKey(),
  testAttemptId: text("test_attempt_id")
    .notNull()
    .references(() => testAttempts.id, { onDelete: "cascade" }),
  questionId: text("question_id")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  selectedChoiceId: text("selected_choice_id").references(() => choices.id, { onDelete: "set null" }),
  isCorrect: boolean("is_correct").default(false).notNull(),
  isFlagged: boolean("is_flagged").default(false).notNull(),
  timeSpentSeconds: integer("time_spent_seconds").default(0).notNull(),
  answeredAt: timestamp("answered_at", { withTimezone: true }).defaultNow().notNull(),
});

export const bookmarks = pgTable("bookmarks", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(), // can be user ID or guest UUID
  questionId: text("question_id")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const userProgress = pgTable("user_progress", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  topicId: text("topic_id")
    .notNull()
    .references(() => topics.id, { onDelete: "cascade" }),
  totalAttempted: integer("total_attempted").default(0).notNull(),
  totalCorrect: integer("total_correct").default(0).notNull(),
  lastAttemptedAt: timestamp("last_attempted_at", { withTimezone: true }).defaultNow().notNull(),
});

export const testAttemptsRelations = relations(testAttempts, ({ one, many }) => ({
  examLevel: one(examLevels, {
    fields: [testAttempts.examLevelId],
    references: [examLevels.id],
  }),
  topic: one(topics, {
    fields: [testAttempts.topicId],
    references: [topics.id],
  }),
  answers: many(userAnswers),
}));

export const userAnswersRelations = relations(userAnswers, ({ one }) => ({
  testAttempt: one(testAttempts, {
    fields: [userAnswers.testAttemptId],
    references: [testAttempts.id],
  }),
  question: one(questions, {
    fields: [userAnswers.questionId],
    references: [questions.id],
  }),
  selectedChoice: one(choices, {
    fields: [userAnswers.selectedChoiceId],
    references: [choices.id],
  }),
}));

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  question: one(questions, {
    fields: [bookmarks.questionId],
    references: [questions.id],
  }),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  topic: one(topics, {
    fields: [userProgress.topicId],
    references: [topics.id],
  }),
}));
