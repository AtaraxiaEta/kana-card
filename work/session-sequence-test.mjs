import assert from "node:assert/strict";
import {
  applyAnswer,
  buildSession,
  getCurrentCard,
  getExpectedAnswer
} from "../outputs/kana-card/learning-engine.js";

const progress = {};
const session = buildSession(progress, "hiragana", Date.now(), () => 0.2);
const counts = new Map();
let questions = 0;

while (getCurrentCard(session) && questions < 50) {
  const card = getCurrentCard(session);
  counts.set(card.id, (counts.get(card.id) || 0) + 1);
  applyAnswer(session, getExpectedAnswer(card), progress, Date.now() + questions * 1000, 1000);
  questions += 1;
}

assert.equal(questions, 10, "Five new kana should produce ten questions.");
assert.ok([...counts.values()].every((count) => count === 2), "Each new kana should appear twice.");

console.log(JSON.stringify({ questions, counts: Object.fromEntries(counts) }, null, 2));