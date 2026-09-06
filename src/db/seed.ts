import { getDb } from "./index";
import {
  exams,
  examLevels,
  examRules,
  subjects,
  topics,
  questions,
  choices,
} from "./schema";
import {
  SEED_EXAM,
  SEED_LEVELS,
  SEED_RULES,
  SEED_SUBJECTS,
  SEED_TOPICS,
  SEED_QUESTIONS,
} from "./seed-data";

async function runSeed() {
  console.log("🌱 Seeding CSE Exam Data into database...");

  try {
    const db = getDb();

    // 1. Seed Exam
    console.log(`Inserting Exam: ${SEED_EXAM.name}...`);
    await db.insert(exams).values(SEED_EXAM).onConflictDoNothing();

    // 2. Seed Levels
    console.log(`Inserting ${SEED_LEVELS.length} Exam Levels...`);
    for (const lvl of SEED_LEVELS) {
      await db.insert(examLevels).values(lvl).onConflictDoNothing();
    }

    // 3. Seed Rules
    console.log(`Inserting ${SEED_RULES.length} Exam Rules...`);
    for (const rule of SEED_RULES) {
      await db
        .insert(examRules)
        .values({
          ...rule,
          passingScorePercentage: rule.passingScorePercentage.toFixed(2),
        })
        .onConflictDoNothing();
    }

    // 4. Seed Subjects
    console.log(`Inserting ${SEED_SUBJECTS.length} Subjects...`);
    for (const sub of SEED_SUBJECTS) {
      await db.insert(subjects).values(sub).onConflictDoNothing();
    }

    // 5. Seed Topics
    console.log(`Inserting ${SEED_TOPICS.length} Topics...`);
    for (const top of SEED_TOPICS) {
      await db.insert(topics).values(top).onConflictDoNothing();
    }

    // 6. Seed Questions & Choices
    console.log(`Inserting ${SEED_QUESTIONS.length} Seed Questions & Choices...`);
    for (const q of SEED_QUESTIONS) {
      await db
        .insert(questions)
        .values({
          id: q.id,
          topicId: q.topicId,
          questionText: q.questionText,
          explanation: q.explanation,
          difficulty: q.difficulty,
          language: q.language,
          status: "draft",
          isSeedData: true,
        })
        .onConflictDoNothing();

      for (const c of q.choices) {
        await db
          .insert(choices)
          .values({
            id: c.id,
            questionId: q.id,
            choiceLabel: c.choiceLabel,
            text: c.text,
            isCorrect: c.isCorrect,
            order: c.order,
          })
          .onConflictDoNothing();
      }
    }

    console.log("✅ Seed completed successfully!");
  } catch (error) {
    console.warn(
      "⚠️ Note: Database seed could not connect to live PostgreSQL. (Dev mock data is available in seed-data.ts):",
      (error as Error).message
    );
  }
}

runSeed();
