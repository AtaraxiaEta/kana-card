import assert from "node:assert/strict";
import {
  DAKUTEN_DATA,
  KANA_DATA,
  ROWS,
  RULE_DATA,
  YOON_DATA,
  itemSupportsScript,
  getTotalStudyUnits
} from "../outputs/kana-card/kana-data.js";
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
  getRowStats,
  getStageItems,
  isStageUnlocked
} from "../outputs/kana-card/learning-engine.js";

const DAY = 24 * 60 * 60 * 1000;
const now = new Date("2026-09-21T14:45:00.000Z").getTime();
const fixedRandom = () => 0.2;

function stableRecord() {
  return {
    seen: true,
    stage: 3,
    streak: 2,
    lapses: 0,
    dueAt: now + DAY,
    lastSeen: now,
    attempts: 2,
    correct: 2,
    averageMs: 1000,
    fastCorrect: 1,
    slowCorrect: 0,
    hard: false
  };
}

function markStable(progress, items, script) {
  for (const item of items.filter((candidate) => itemSupportsScript(candidate, script))) {
    progress[`${script}:${item.id}`] = stableRecord();
  }
}

assert.equal(ROWS.reduce((total, row) => total + row.ids.length, 0), 46);
assert.equal(DAKUTEN_DATA.length, 25);
assert.equal(YOON_DATA.length, 33);
assert.equal(RULE_DATA.length, 20);
assert.equal(KANA_DATA.length, 124);
assert.equal(new Set(KANA_DATA.map((item) => item.id)).size, 124);
assert.equal(getTotalStudyUnits(), 228);
assert.equal(getStageItems(1).length, 46);
assert.equal(getStageItems(2).length, 25);
assert.equal(getStageItems(3).length, 33);
assert.equal(getStageItems(4).length, 20);

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

const dueProgress = {
  "hiragana:a": {
    ...stableRecord(),
    stage: 1,
    dueAt: now - 1
  }
};
const due = getDueItems(dueProgress, ["hiragana"], now);
assert.equal(due.length, 1);
assert.equal(due[0].id, "a");

const stageTwoProgress = {};
markStable(stageTwoProgress, KANA_DATA.filter((item) => (item.stage || 1) === 1), "hiragana");
assert.equal(isStageUnlocked(stageTwoProgress, "hiragana", 2), true);
assert.equal(isStageUnlocked(stageTwoProgress, "hiragana", 3), false);
const stageTwoCandidates = getNewCandidates(stageTwoProgress, ["hiragana"]);
assert.equal(stageTwoCandidates.length, 5);
assert.ok(stageTwoCandidates.every((item) => item.contentStage === 2));
assert.ok(choices.length === 4);

const stageThreeProgress = structuredClone(stageTwoProgress);
markStable(stageThreeProgress, DAKUTEN_DATA, "hiragana");
assert.equal(isStageUnlocked(stageThreeProgress, "hiragana", 3), true);
assert.equal(isStageUnlocked(stageThreeProgress, "hiragana", 4), false);
const stageThreeCandidates = getNewCandidates(stageThreeProgress, ["hiragana"]);
assert.equal(stageThreeCandidates.length, 5);
assert.ok(stageThreeCandidates.every((item) => item.contentStage === 3));

const stageFourProgress = structuredClone(stageThreeProgress);
markStable(stageFourProgress, YOON_DATA, "hiragana");
assert.equal(isStageUnlocked(stageFourProgress, "hiragana", 4), true);
const stageFourCandidates = getNewCandidates(stageFourProgress, ["hiragana"]);
assert.equal(stageFourCandidates.length, 5);
assert.ok(stageFourCandidates.every((item) => item.contentStage === 4));
assert.ok(stageFourCandidates.every((item) => item.contentType === "rule"));

const ruleCard = stageFourCandidates[0];
const ruleChoices = getChoices(
  { id: ruleCard.id, script: "hiragana", direction: "forward" },
  fixedRandom
);
assert.equal(ruleChoices.length, 4);
assert.ok(ruleChoices.includes(getExpectedAnswer({ id: ruleCard.id, script: "hiragana" })));
assert.equal(getRowStats(stageFourProgress, "long-vowels", "hiragana").total, 5);
assert.equal(getRowStats(stageFourProgress, "sokuon", "hiragana").total, 5);

const plan = getPlan(stageFourProgress, "hiragana");
assert.equal(plan.newCount, 5);

console.log("Engine tests passed.");