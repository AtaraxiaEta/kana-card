import assert from "node:assert/strict";
import { DAKUTEN_DATA, KANA_DATA, ROWS } from "../outputs/kana-card/kana-data.js";
import {
  applyAnswer,
  buildSession,
  getChoices,
  getCurrentCard,
  getDueItems,
  getExpectedAnswer,
  getNewCandidates,
  getPlan,
  getRecord,
  getStageItems,
  isStageUnlocked
} from "../outputs/kana-card/learning-engine.js";

const DAY = 24 * 60 * 60 * 1000;
const now = new Date("2026-09-21T14:45:00.000Z").getTime();
const fixedRandom = () => 0.2;

assert.equal(ROWS.reduce((total, row) => total + row.ids.length, 0), 46);
assert.equal(DAKUTEN_DATA.length, 25);
assert.equal(KANA_DATA.length, 71);
assert.equal(new Set(KANA_DATA.map((item) => item.id)).size, 71);
assert.equal(getStageItems(1).length, 46);
assert.equal(getStageItems(2).length, 25);

const progress = {};
const session = buildSession(progress, "hiragana", now, fixedRandom);

assert.equal(session.cards.length, 5);
assert.ok(session.cards.every((card) => card.kind === "new"));
assert.ok(session.cards.every((card) => card.contentStage === 1));

let card = getCurrentCard(session);
const choices = getChoices(card, fixedRandom);
assert.equal(choices.length, 4);
assert.equal(new Set(choices).size, 4);
assert.ok(choices.includes(getExpectedAnswer(card)));
assert.ok(!choices.includes("ga"), "Locked stage-two content must not appear as a distractor.");

let result = applyAnswer(session, getExpectedAnswer(card), progress, now, 1400);
assert.equal(result.correct, true);
assert.equal(result.newlyLearned, true);
assert.equal(session.cards.length, 6);
assert.equal(getRecord(progress, card.id, card.script).seen, true);

card = getCurrentCard(session);
result = applyAnswer(session, "definitely-wrong", progress, now + 1500, 2200);
assert.equal(result.correct, false);
assert.equal(getRecord(progress, card.id, card.script).lapses, 1);
assert.equal(session.cards.length, 7);

const plan = getPlan(progress, "hiragana");
assert.equal(plan.newCount, 5);

progress["hiragana:a"] = {
  seen: true,
  stage: 1,
  streak: 1,
  lapses: 0,
  dueAt: now - 1,
  lastSeen: now - DAY,
  attempts: 1,
  correct: 1,
  averageMs: 1000,
  fastCorrect: 0,
  slowCorrect: 0,
  hard: false
};

const due = getDueItems(progress, ["hiragana"], now);
assert.equal(due.length, 1);
assert.equal(due[0].id, "a");

const lockedProgress = {};
for (const row of ROWS) {
  for (const id of row.ids) {
    lockedProgress[`hiragana:${id}`] = {
      seen: true,
      stage: 1,
      streak: 1,
      lapses: 0,
      dueAt: now + DAY,
      lastSeen: now,
      attempts: 1,
      correct: 1,
      averageMs: 1000,
      fastCorrect: 0,
      slowCorrect: 0,
      hard: false
    };
  }
}

assert.equal(isStageUnlocked(lockedProgress, "hiragana", 2), false);
assert.equal(getNewCandidates(lockedProgress, ["hiragana"]).length, 0);

const unlockedProgress = structuredClone(lockedProgress);
for (const row of ROWS) {
  for (const id of row.ids) {
    unlockedProgress[`hiragana:${id}`].stage = 3;
  }
}

assert.equal(isStageUnlocked(unlockedProgress, "hiragana", 2), true);
const stageTwoCandidates = getNewCandidates(unlockedProgress, ["hiragana"]);
assert.equal(stageTwoCandidates.length, 5);
assert.ok(stageTwoCandidates.every((item) => item.contentStage === 2));

const stageTwoSession = buildSession(unlockedProgress, "hiragana", now, fixedRandom);
assert.equal(stageTwoSession.cards.length, 5);
assert.ok(stageTwoSession.cards.every((card) => card.contentStage === 2));

console.log("Engine tests passed.");