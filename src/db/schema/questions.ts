import { pgTable, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { topics } from "./subjects";

export const questions = pgTable("questions", {
  id: text("id").primaryKey(),
  topicId: text("topic_id")
    .notNull()
    .references(() => topics.id, { onDelete: "cascade" }),
  questionText: text("question_text").notNull(),
  explanation: text("explanation").notNull(), // Detailed pedagogical rationale
  difficulty: text("difficulty").notNull().default("medium"), // 'easy' | 'medium' | 'hard' | 'very_hard'
  language: text("language").notNull().default("en"), // 'en' | 'fil'
  status: text("status").notNull().default("draft"), // 'draft' | 'under_review' | 'approved' | 'published' | 'archived'
  isSeedData: boolean("is_seed_data").notNull().default(false),
  authorId: text("author_id"),
  reviewerId: text("reviewer_id"),
  relevantDate: timestamp("relevant_date", { withTimezone: true }),
  publicationDate: timestamp("publication_date", { withTimezone: true }),
  expirationDate: timestamp("expiration_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const choices = pgTable("choices", {
  id: text("id").primaryKey(),
  questionId: text("question_id")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  choiceLabel: text("choice_label").notNull(), // 'A' | 'B' | 'C' | 'D' | 'E'
  text: text("text").notNull(),
  isCorrect: boolean("is_correct").default(false).notNull(),
  order: integer("order").default(0).notNull(),
  explanation: text("explanation"),
});

export const questionReports = pgTable("question_reports", {
  id: text("id").primaryKey(),
  questionId: text("question_id")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  userId: text("user_id"),
  reason: text("reason").notNull(),
  comments: text("comments"),
  status: text("status").notNull().default("pending"), // 'pending' | 'reviewed' | 'resolved'
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const questionsRelations = relations(questions, ({ one, many }) => ({
  topic: one(topics, {
    fields: [questions.topicId],
    references: [topics.id],
  }),
  choices: many(choices),
  reports: many(questionReports),
}));

export const choicesRelations = relations(choices, ({ one }) => ({
  question: one(questions, {
    fields: [choices.questionId],
    references: [questions.id],
  }),
}));

export const questionReportsRelations = relations(questionReports, ({ one }) => ({
  question: one(questions, {
    fields: [questionReports.questionId],
    references: [questions.id],
  }),
}));
