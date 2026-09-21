import assert from "node:assert/strict";
import {
  applyAnswer,
  buildSession,
  getMistakeItems,
  getRecord,
  getReviewSummary
} from "../outputs/kana-card/learning-engine.js";

const DAY = 24 * 60 * 60 * 1000;
const now = Date.now();

function record(overrides = {}) {
  return {
    seen: true,
    stage: 1,
    streak: 1,
    lapses: 0,
    dueAt: now - 1,
    lastSeen: now - DAY,
    attempts: 1,
    correct: 1,
    averageMs: 1800,
    fastCorrect: 0,
    slowCorrect: 0,
    hard: false,
    ...overrides
  };
}

function singleCardSession(id, kind = "due") {
  return {
    mode: "hiragana",
    focus: kind === "mistake" ? "mistakes" : "due",
    scripts: ["hiragana"],
    cards: [{ id, script: "hiragana", kind, direction: "forward", reinforced: false }],
    currentIndex: 0,
    stats: {
      answered: 0,
      correct: 0,
      wrong: 0,
      completedCards: 0,
      newLearned: 0,
      fastCorrect: 0,
      slowCorrect: 0
    }
  };
}

const progress = {
  "hiragana:a": record({ stage: 2, dueAt: now - 1000 }),
  "hiragana:i": record({ stage: 0, lapses: 1, dueAt: now + DAY })
};

const dueSession = buildSession(progress, "hiragana", now, () => 0.2, { focus: "due" });
assert.equal(dueSession.cards.length, 1);
assert.equal(dueSession.cards[0].kind, "due");

const mistakeSession = buildSession(progress, "hiragana", now, () => 0.2, { focus: "mistakes" });
assert.equal(mistakeSession.cards.length, 1);
assert.equal(mistakeSession.cards[0].kind, "mistake");
assert.equal(mistakeSession.cards[0].id, "i");

const summary = getReviewSummary(progress, ["hiragana"], now);
assert.equal(summary.dueCount, 1);
assert.equal(summary.mistakeCount, 1);

const hardProgress = { "hiragana:a": record({ stage: 2, dueAt: now - 1 }) };
const hardSession = singleCardSession("a");
for (let index = 0; index < 3; index += 1) {
  applyAnswer(hardSession, "wrong", hardProgress, now + index, 1000);
  if (index < 2) hardSession.cards.push({ ...hardSession.cards[0] });
}
assert.equal(getRecord(hardProgress, "a", "hiragana").hard, true);
assert.equal(getMistakeItems(hardProgress, ["hiragana"])[0].hard, true);

const fastProgress = { "hiragana:a": record({ stage: 1, dueAt: now - 1, averageMs: 1000 }) };
const slowProgress = { "hiragana:a": record({ stage: 1, dueAt: now - 1, averageMs: 7000 }) };
const fastResult = applyAnswer(singleCardSession("a"), "a", fastProgress, now, 900);
const slowResult = applyAnswer(singleCardSession("a"), "a", slowProgress, now, 7000);
assert.equal(fastResult.performance, "fast");
assert.equal(slowResult.performance, "slow");
assert.ok(
  getRecord(fastProgress, "a", "hiragana").dueAt - now >
    getRecord(slowProgress, "a", "hiragana").dueAt - now,
  "Fast answers should receive a longer interval than slow answers."
);

console.log("Review tests passed.");