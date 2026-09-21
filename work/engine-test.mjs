import assert from "node:assert/strict";
import { KANA_DATA, ROWS } from "../outputs/kana-card/kana-data.js";
import {
  applyAnswer,
  buildSession,
  getChoices,
  getCurrentCard,
  getDueItems,
  getExpectedAnswer,
  getPlan,
  getRecord
} from "../outputs/kana-card/learning-engine.js";

const DAY = 24 * 60 * 60 * 1000;
const now = new Date("2026-09-21T14:45:00.000Z").getTime();
const fixedRandom = () => 0.2;

assert.equal(KANA_DATA.length, 46, "There should be 46 modern kana sounds.");
assert.equal(new Set(KANA_DATA.map((item) => item.id)).size, 46, "Kana IDs must be unique.");
assert.equal(
  ROWS.reduce((total, row) => total + row.ids.length, 0),
  46,
  "Every kana should belong to exactly one row."
);

const progress = {};
const session = buildSession(progress, "hiragana", now, fixedRandom);

assert.equal(session.cards.length, 5, "A fresh session should introduce five new kana.");
assert.ok(session.cards.every((card) => card.kind === "new"), "A fresh account has only new cards.");

let card = getCurrentCard(session);
const choices = getChoices(card, fixedRandom);
assert.equal(choices.length, 4, "Forward cards should show four choices.");
assert.equal(new Set(choices).size, 4, "Choices must be unique.");
assert.ok(choices.includes(getExpectedAnswer(card)), "The correct answer must be present.");

let result = applyAnswer(session, getExpectedAnswer(card), progress, now, 1400);
assert.equal(result.correct, true);
assert.equal(result.newlyLearned, true);
assert.equal(session.cards.length, 6, "A correct new card should be reinforced later in the session.");
assert.equal(getRecord(progress, card.id, card.script).seen, true);

card = getCurrentCard(session);
result = applyAnswer(session, "definitely-wrong", progress, now + 1500, 2200);
assert.equal(result.correct, false);
assert.equal(getRecord(progress, card.id, card.script).lapses, 1);
assert.equal(session.cards.length, 7, "A wrong card should return later in the session.");

const plan = getPlan(progress, "hiragana");
assert.equal(plan.newCount, 5, "The plan should expose the five-card new limit.");

progress["hiragana:a"] = {
  seen: true,
  stage: 1,
  streak: 1,
  lapses: 0,
  dueAt: now - 1,
  lastSeen: now - DAY,
  attempts: 1,
  correct: 1,
  averageMs: 1000
};

const due = getDueItems(progress, ["hiragana"], now);
assert.equal(due.length, 1, "A due card should enter the review pool.");
assert.equal(due[0].id, "a");

console.log("Engine tests passed.");
