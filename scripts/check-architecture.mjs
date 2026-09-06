#!/usr/bin/env node
/**
 * Fails the build if exam-engine code contains hardcoded branching on a
 * specific exam's identity (e.g. `=== 'cse'`), rather than consuming exam
 * configuration data. See skills/exam-engine/SKILL.md.
 *
 * This is a heuristic, not a full static analyzer: it flags comparisons/
 * switch-cases against known exam slugs inside engine directories. It will
 * not catch every possible violation and may occasionally need a narrow,
 * commented exception — but it catches the common mistake automatically,
 * which is the point: this rule shouldn't depend on a human remembering to
 * check for it during review.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const ENGINE_DIRS = ['src/features/exam-engine'];
const KNOWN_EXAM_SLUGS = ['cse', 'let', 'nursing', 'bfp', 'napolcom'];
const EXTS = new Set(['.ts', '.tsx']);

// Matches: === 'cse'   ==  "let"   case 'nursing':   (case-insensitive)
const PATTERN = new RegExp(
  `(===|==|case)\\s*['"\`](${KNOWN_EXAM_SLUGS.join('|')})['"\`]`,
  'i'
);

function walk(dir, found) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return; // directory doesn't exist yet — nothing to check
  }
  for (const entry of entries) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walk(full, found);
    } else if (EXTS.has(extname(full))) {
      const lines = readFileSync(full, 'utf-8').split('\n');
      lines.forEach((line, i) => {
        if (PATTERN.test(line)) {
          found.push(`${full}:${i + 1}: ${line.trim()}`);
        }
      });
    }
  }
}

const found = [];
for (const dir of ENGINE_DIRS) walk(dir, found);

if (found.length > 0) {
  console.error('❌ Architecture check failed: hardcoded exam-identity branching found in engine code.\n');
  console.error('Engine code must consume exam configuration data, not branch on a specific exam slug.');
  console.error('See skills/exam-engine/SKILL.md.\n');
  found.forEach((line) => console.error('  ' + line));
  process.exit(1);
} else {
  console.log('✅ Architecture check passed: no hardcoded exam-identity branching found in engine code.');
  process.exit(0);
}
