import { ALL_ROWS, KANA_BY_ID, KANA_DATA, ROWS, getCharacter, getStage } from "./kana-data.js";

const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;
const RETRY_DELAY = 10 * 60 * 1000;
const REVIEW_INTERVALS = [1, 3, 7, 14, 30].map((days) => days * DAY);
const FAST_RESPONSE_MS = 1800;
const SLOW_RESPONSE_MS = 5200;
const HARD_LAPSE_THRESHOLD = 3;
const MAX_REVIEW_INTERVAL = 45 * DAY;

export const SESSION_LIMITS = {
  newCards: 5,
  dueCards: 12,
  reviewCards: 30,
  maxCards: 18
};

export function scriptsForMode(mode) {
  if (mode === "mixed") {
    return ["hiragana", "katakana"];
  }
  return [mode === "katakana" ? "katakana" : "hiragana"];
}

export function progressKey(id, script) {
  return `${script}:${id}`;
}

export function defaultRecord() {
  return {
    seen: false,
    stage: 0,
    streak: 0,
    lapses: 0,
    dueAt: 0,
    lastSeen: 0,
    attempts: 0,
    correct: 0,
    averageMs: 0,
    fastCorrect: 0,
    slowCorrect: 0,
    hard: false
  };
}

export function getRecord(progress, id, script) {
  return progress[progressKey(id, script)] || defaultRecord();
}

export function ensureRecord(progress, id, script) {
  const key = progressKey(id, script);
  if (!progress[key]) {
    progress[key] = defaultRecord();
  }
  return progress[key];
}

export function getLearnedCount(progress, script) {
  return KANA_DATA.filter((item) => getRecord(progress, item.id, script).seen).length;
}

export function getMasteredCount(progress, script) {
  return KANA_DATA.filter((item) => getRecord(progress, item.id, script).stage >= 4).length;
}

export function getStageItems(stage) {
  return KANA_DATA.filter((item) => getStage(item) === stage);
}

export function getStageProgress(progress, script, stage = 1) {
  const items = getStageItems(stage);
  const records = items.map((item) => getRecord(progress, item.id, script));
  const seen = records.filter((record) => record.seen).length;
  const stable = records.filter((record) => record.stage >= 3).length;
  const required = Math.ceil(items.length * 0.8);
  let unlocked = stage <= 1;

  if (stage > 1) {
    const previous = getStageProgress(progress, script, stage - 1);
    unlocked = previous.unlocked && previous.seen === previous.total && previous.stable >= previous.required;
  }

  return {
    stage,
    total: items.length,
    seen,
    stable,
    required,
    unlocked
  };
}

export function isStageUnlocked(progress, script, stage = 1) {
  return getStageProgress(progress, script, stage).unlocked;
}

export function getUnlockedStages(progress, script) {
  return [1, 2, 3, 4].filter((stage) => isStageUnlocked(progress, script, stage));
}

export function getDueItems(progress, scripts, now = Date.now()) {
  const items = [];

  for (const script of scripts) {
    for (const item of KANA_DATA) {
      const record = getRecord(progress, item.id, script);
      if (record.seen && record.dueAt <= now) {
        items.push({
          id: item.id,
          script,
          dueAt: record.dueAt,
          stage: record.stage,
          contentStage: getStage(item)
        });
      }
    }
  }

  return items.sort((a, b) => a.dueAt - b.dueAt);
}

export function isHardRecord(record) {
  return Boolean(record.hard);
}

export function getMistakeItems(progress, scripts) {
  const items = [];

  for (const script of scripts) {
    for (const item of KANA_DATA) {
      const record = getRecord(progress, item.id, script);
      if (!record.seen || (record.lapses === 0 && !isHardRecord(record))) continue;

      items.push({
        id: item.id,
        script,
        stage: record.stage,
        contentStage: getStage(item),
        lapses: record.lapses,
        hard: isHardRecord(record),
        dueAt: record.dueAt,
        lastSeen: record.lastSeen,
        averageMs: record.averageMs
      });
    }
  }

  return items.sort((a, b) => {
    if (a.hard !== b.hard) return a.hard ? -1 : 1;
    if (a.lapses !== b.lapses) return b.lapses - a.lapses;
    if (a.stage !== b.stage) return a.stage - b.stage;
    return a.dueAt - b.dueAt;
  });
}

export function getReviewSummary(progress, scripts, now = Date.now()) {
  const dueItems = getDueItems(progress, scripts, now);
  const mistakeItems = getMistakeItems(progress, scripts);
  const hardItems = mistakeItems.filter((item) => item.hard);

  return {
    dueCount: dueItems.length,
    mistakeCount: mistakeItems.length,
    hardCount: hardItems.length,
    nextDueAt: dueItems.length ? dueItems[0].dueAt : 0
  };
}

export function getNewCandidates(progress, scripts) {
  const candidates = [];

  for (const script of scripts) {
    let added = 0;

    for (const row of ALL_ROWS) {
      if (!isStageUnlocked(progress, script, getStage(row))) continue;

      const unseen = row.ids
        .map((id) => KANA_BY_ID.get(id))
        .filter((item) => !getRecord(progress, item.id, script).seen);

      for (const item of unseen) {
        candidates.push({ id: item.id, script, contentStage: getStage(item) });
        added += 1;
        if (added >= SESSION_LIMITS.newCards) {
          break;
        }
      }

      if (added >= SESSION_LIMITS.newCards) {
        break;
      }
    }
  }

  if (scripts.length === 1) {
    return candidates.slice(0, SESSION_LIMITS.newCards);
  }

  const interleaved = [];
  const first = candidates.filter((item) => item.script === scripts[0]);
  const second = candidates.filter((item) => item.script === scripts[1]);
  const maxLength = Math.max(first.length, second.length);

  for (let index = 0; index < maxLength; index += 1) {
    if (first[index]) interleaved.push(first[index]);
    if (second[index]) interleaved.push(second[index]);
  }

  return interleaved.slice(0, SESSION_LIMITS.newCards);
}

export function getNextUnseenItems(progress, scripts, limit = 5) {
  return getNewCandidates(progress, scripts).slice(0, limit);
}

export function getNextRow(progress, scripts) {
  for (const script of scripts) {
    for (const row of ALL_ROWS) {
      if (!isStageUnlocked(progress, script, getStage(row))) continue;
      if (row.ids.some((id) => !getRecord(progress, id, script).seen)) {
        return { row, script };
      }
    }
  }

  return null;
}

export function getRowStats(progress, rowId, script) {
  const row = ALL_ROWS.find((candidate) => candidate.id === rowId);
  if (!row) {
    return { seen: 0, mastered: 0, total: 0, progress: 0 };
  }

  const records = row.ids.map((id) => getRecord(progress, id, script));
  const seen = records.filter((record) => record.seen).length;
  const mastered = records.filter((record) => record.stage >= 4).length;

  return {
    seen,
    mastered,
    total: row.ids.length,
    progress: row.ids.length ? seen / row.ids.length : 0
  };
}

function shuffle(items, random = Math.random) {
  const result = [...items];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
}

function chooseDirection(stage, random) {
  return stage >= 2 && random() < 0.35 ? "reverse" : "forward";
}

export function buildSession(progress, mode, now = Date.now(), random = Math.random, options = {}) {
  const scripts = scriptsForMode(mode);
  const focus = options.focus || "daily";
  let cards = [];

  if (focus === "due") {
    const due = getDueItems(progress, scripts, now).slice(0, SESSION_LIMITS.reviewCards);
    cards = shuffle(due, random).map((item) => ({
      ...item,
      kind: "due",
      direction: chooseDirection(item.stage, random),
      reinforced: false
    }));
  } else if (focus === "mistakes") {
    const mistakes = getMistakeItems(progress, scripts).slice(0, SESSION_LIMITS.reviewCards);
    cards = shuffle(mistakes, random).map((item) => ({
      ...item,
      kind: "mistake",
      direction: chooseDirection(Math.max(1, item.stage), random),
      reinforced: false
    }));
  } else {
    const due = getDueItems(progress, scripts, now).slice(0, SESSION_LIMITS.dueCards);
    const availableSlots = Math.max(0, SESSION_LIMITS.maxCards - due.length);
    const newLimit = due.length >= SESSION_LIMITS.dueCards ? 0 : Math.min(SESSION_LIMITS.newCards, availableSlots);
    const newItems = getNewCandidates(progress, scripts).slice(0, newLimit);

    const dueCards = shuffle(due, random).map((item) => ({
      ...item,
      kind: "due",
      direction: chooseDirection(item.stage, random),
      reinforced: false
    }));

    const newCards = newItems.map((item) => ({
      ...item,
      kind: "new",
      direction: "forward",
      reinforced: false
    }));

    cards = [...dueCards, ...newCards];
  }

  return {
    mode,
    focus,
    scripts,
    cards,
    initialCardCount: cards.length,
    currentIndex: 0,
    startedAt: now,
    cardStartedAt: now,
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

export function getCurrentCard(session) {
  return session.cards[session.currentIndex] || null;
}

export function getSessionProgress(session) {
  return session.cards.length ? Math.min(1, session.currentIndex / session.cards.length) : 1;
}

export function getExpectedAnswer(card) {
  const item = KANA_BY_ID.get(card.id);
  if (!item) return "";
  return card.direction === "reverse" ? getCharacter(item, card.script) : item.romaji;
}

export function getChoices(card, random = Math.random) {
  const target = KANA_BY_ID.get(card.id);
  if (!target) return [];

  const maxContentStage = getStage(target);
  const choiceItems = KANA_DATA.filter((item) => getStage(item) <= maxContentStage);
  const allCandidates =
    card.direction === "reverse"
      ? choiceItems.map((item) => getCharacter(item, card.script))
      : choiceItems.map((item) => item.romaji);

  const expected = getExpectedAnswer(card);
  const sameRowIds = new Set(ALL_ROWS.find((row) => row.id === target.row)?.ids || []);
  const preferred = allCandidates.filter((value, index) => {
    const item = choiceItems[index];
    return value !== expected && sameRowIds.has(item.id);
  });
  const fallback = allCandidates.filter((value) => value !== expected);
  const distractors = [];
  const pool = [...shuffle(preferred, random), ...shuffle(fallback, random)];

  for (const value of pool) {
    if (value !== expected && !distractors.includes(value)) {
      distractors.push(value);
    }
    if (distractors.length === 3) break;
  }

  return shuffle([expected, ...distractors], random);
}

function requeueCard(session, delay, overrides = {}) {
  const card = getCurrentCard(session);
  if (!card) return;

  const insertAt = Math.min(session.currentIndex + delay + 1, session.cards.length);
  session.cards.splice(insertAt, 0, { ...card, ...overrides });
}

function assessPerformance(responseMs, averageMs) {
  const sample = responseMs > 0 ? responseMs : averageMs;
  if (!sample) return "steady";
  if (sample <= FAST_RESPONSE_MS) return "fast";
  if (sample >= SLOW_RESPONSE_MS) return "slow";
  return "steady";
}

function getIntervalMultiplier(performance, record) {
  let multiplier = performance === "fast" ? 1.35 : performance === "slow" ? 0.65 : 1;
  if (record.hard) multiplier *= 0.7;
  return multiplier;
}

export function applyAnswer(session, answer, progress, now = Date.now(), responseMs = 0) {
  const card = getCurrentCard(session);
  if (!card) {
    return { correct: false, complete: true };
  }

  const item = KANA_BY_ID.get(card.id);
  const expected = getExpectedAnswer(card);
  const correct = answer === expected;
  const record = ensureRecord(progress, card.id, card.script);
  const performance = correct ? assessPerformance(responseMs, record.averageMs) : "wrong";

  session.stats.answered += 1;
  record.attempts += 1;
  record.lastSeen = now;
  record.averageMs = Math.round(
    (record.averageMs * (record.attempts - 1) + Math.max(0, responseMs)) / record.attempts
  );
  const newlyLearned = correct && card.kind === "new" && !card.reinforced && !card.newLearnedCounted;

  if (correct) {
    session.stats.correct += 1;
    record.correct += 1;
    record.streak += 1;
    record.seen = true;

    if (performance === "fast") {
      record.fastCorrect += 1;
      session.stats.fastCorrect += 1;
    } else if (performance === "slow") {
      record.slowCorrect += 1;
      session.stats.slowCorrect += 1;
    }

    if (card.kind === "new" && !card.reinforced) {
      record.dueAt = now + RETRY_DELAY;
      card.newLearnedCounted = true;
      requeueCard(session, 4, { reinforced: true });
      if (newlyLearned) {
        session.stats.newLearned += 1;
      }
    } else {
      record.stage = Math.min(REVIEW_INTERVALS.length, record.stage + 1);
      const baseInterval = REVIEW_INTERVALS[Math.max(0, record.stage - 1)];
      const adjustedInterval = Math.min(
        MAX_REVIEW_INTERVAL,
        Math.max(12 * HOUR, Math.round(baseInterval * getIntervalMultiplier(performance, record)))
      );
      record.dueAt = now + adjustedInterval;
      session.stats.completedCards += 1;

      if (record.hard && record.streak >= 3 && record.stage >= 3) {
        record.hard = false;
      }
    }
  } else {
    session.stats.wrong += 1;
    record.streak = 0;
    record.lapses += 1;
    record.stage = Math.max(0, record.stage - 1);
    record.seen = true;
    record.dueAt = now + RETRY_DELAY;
    if (record.lapses >= HARD_LAPSE_THRESHOLD) record.hard = true;
    requeueCard(session, 3);
  }

  session.currentIndex += 1;
  session.cardStartedAt = now;

  return {
    correct,
    expected,
    item,
    performance,
    hard: record.hard,
    complete: session.currentIndex >= session.cards.length,
    newlyLearned,
    needsReinforcement: newlyLearned
  };
}

export function getPlan(progress, mode) {
  const scripts = scriptsForMode(mode);
  const now = Date.now();
  const dueCount = getDueItems(progress, scripts, now).length;
  const dueItems = getDueItems(progress, scripts, now).slice(0, SESSION_LIMITS.dueCards);
  const newItems = getNewCandidates(progress, scripts);
  const next = getNextRow(progress, scripts);
  const cappedDueCount = Math.min(dueCount, SESSION_LIMITS.dueCards);
  const availableSlots = Math.max(0, SESSION_LIMITS.maxCards - cappedDueCount);
  const newLimit = cappedDueCount >= SESSION_LIMITS.dueCards ? 0 : Math.min(SESSION_LIMITS.newCards, availableSlots);

  return {
    scripts,
    dueCount: cappedDueCount,
    dueTotal: dueCount,
    dueItems,
    newCount: Math.min(newLimit, newItems.length),
    newItems: newItems.slice(0, newLimit),
    next
  };
}
