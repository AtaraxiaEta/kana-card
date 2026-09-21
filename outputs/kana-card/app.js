import {
  ALL_ROWS,
  KANA_BY_ID,
  KANA_DATA,
  LEARNING_STAGES,
  getCharacter,
  getRow,
  getScriptName,
  getStage,
  itemSupportsScript,
  getTotalStudyUnits
} from "./kana-data.js";
import {
  SESSION_LIMITS,
  applyAnswer,
  buildSession,
  getChoices,
  getCurrentCard,
  getDueItems,
  getMistakeItems,
  getReviewSummary,
  getLearnedCount,
  getMasteredCount,
  getStageProgress,
  getUnlockedStages,
  isStageUnlocked,
  getPlan,
  getRecord,
  getRowStats,
  getSessionProgress,
  scriptsForMode
} from "./learning-engine.js";

const STORAGE_KEY = "kana-card-state-v1";
const THEME_COLOR = "#0c7c79";
const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;

const state = {
  data: loadState(),
  session: null,
  currentCard: null,
  cardShownAt: 0,
  answered: false,
  chartScript: "hiragana",
  chartStage: 1,
  chartDetailId: "a",
  deferredInstallPrompt: null,
  activeView: "home",
  toastTimer: null
};

const elements = {
  views: [...document.querySelectorAll(".view")],
  navButtons: [...document.querySelectorAll("[data-nav]")],
  bottomNavButtons: [...document.querySelectorAll(".nav-button")],
  modeButtons: [...document.querySelectorAll("[data-mode]")],
  chartScriptButtons: [...document.querySelectorAll("[data-chart-script]")],
  chartStageButtons: [...document.querySelectorAll("[data-chart-stage]")],
  streakValue: document.querySelector("#streakValue"),
  learnedValue: document.querySelector("#learnedValue"),
  dueValue: document.querySelector("#dueValue"),
  planHeadline: document.querySelector("#planHeadline"),
  planDetail: document.querySelector("#planDetail"),
  kanaPreview: document.querySelector("#kanaPreview"),
  startSessionButton: document.querySelector("#startSessionButton"),
  roadmap: document.querySelector("#roadmap"),
  installButton: document.querySelector("#installButton"),
  iosInstallBanner: document.querySelector("#iosInstallBanner"),
  dismissInstallButton: document.querySelector("#dismissInstallButton"),
  installHelpText: document.querySelector("#installHelpText"),
  closeSessionButton: document.querySelector("#closeSessionButton"),
  sessionProgressBar: document.querySelector("#sessionProgressBar"),
  sessionCount: document.querySelector("#sessionCount"),
  questionType: document.querySelector("#questionType"),
  questionInstruction: document.querySelector("#questionInstruction"),
  flashcard: document.querySelector("#flashcard"),
  promptText: document.querySelector("#promptText"),
  cardCaption: document.querySelector("#cardCaption"),
  audioButton: document.querySelector("#audioButton"),
  answerGrid: document.querySelector("#answerGrid"),
  feedbackPanel: document.querySelector("#feedbackPanel"),
  feedbackTitle: document.querySelector("#feedbackTitle"),
  feedbackDetail: document.querySelector("#feedbackDetail"),
  memoryNote: document.querySelector("#memoryNote"),
  continueButton: document.querySelector("#continueButton"),
  completeTitle: document.querySelector("#completeTitle"),
  completeSubtitle: document.querySelector("#completeSubtitle"),
  completeCorrect: document.querySelector("#completeCorrect"),
  completeNew: document.querySelector("#completeNew"),
  completeAccuracy: document.querySelector("#completeAccuracy"),
  anotherSessionButton: document.querySelector("#anotherSessionButton"),
  finishSessionButton: document.querySelector("#finishSessionButton"),
  chartGrid: document.querySelector("#chartGrid"),
  chartDetail: document.querySelector("#chartDetail"),
  detailCharacter: document.querySelector("#detailCharacter"),
  detailRow: document.querySelector("#detailRow"),
  detailRomaji: document.querySelector("#detailRomaji"),
  detailPair: document.querySelector("#detailPair"),
  detailNote: document.querySelector("#detailNote"),
  detailAudioButton: document.querySelector("#detailAudioButton"),
  reviewDueValue: document.querySelector("#reviewDueValue"),
  reviewMistakeValue: document.querySelector("#reviewMistakeValue"),
  reviewHardValue: document.querySelector("#reviewHardValue"),
  reviewNextDue: document.querySelector("#reviewNextDue"),
  reviewDueDetail: document.querySelector("#reviewDueDetail"),
  reviewMistakeDetail: document.querySelector("#reviewMistakeDetail"),
  reviewScheduleText: document.querySelector("#reviewScheduleText"),
  reviewHardList: document.querySelector("#reviewHardList"),
  startDueReviewButton: document.querySelector("#startDueReviewButton"),
  startMistakeReviewButton: document.querySelector("#startMistakeReviewButton"),
  progressLearned: document.querySelector("#progressLearned"),
  progressMastered: document.querySelector("#progressMastered"),
  progressToday: document.querySelector("#progressToday"),
  progressStreak: document.querySelector("#progressStreak"),
  rowProgressList: document.querySelector("#rowProgressList"),
  exportButton: document.querySelector("#exportButton"),
  importButton: document.querySelector("#importButton"),
  importInput: document.querySelector("#importInput"),
  resetButton: document.querySelector("#resetButton"),
  toast: document.querySelector("#toast")
};

function defaultState() {
  return {
    version: 1,
    progress: {},
    streak: 0,
    lastStudyDate: "",
    daily: {
      date: todayKey(),
      answered: 0,
      correct: 0,
      newCards: 0,
      sessions: 0
    },
    settings: {
      mode: "hiragana",
      dismissedInstall: false
    }
  };
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== "object") return defaultState();

    const base = defaultState();
    return {
      ...base,
      ...saved,
      progress: saved.progress && typeof saved.progress === "object" ? saved.progress : {},
      daily: {
        ...base.daily,
        ...(saved.daily || {})
      },
      settings: {
        ...base.settings,
        ...(saved.settings || {})
      }
    };
  } catch {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
}

function todayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function yesterdayKey() {
  return todayKey(new Date(Date.now() - DAY));
}

function ensureDaily() {
  const today = todayKey();
  if (state.data.daily.date !== today) {
    state.data.daily = {
      date: today,
      answered: 0,
      correct: 0,
      newCards: 0,
      sessions: 0
    };
  }
}

function recordStudyDay() {
  const today = todayKey();
  if (state.data.lastStudyDate === today) return;

  state.data.streak = state.data.lastStudyDate === yesterdayKey() ? state.data.streak + 1 : 1;
  state.data.lastStudyDate = today;
  saveState();
}

function showToast(message) {
  window.clearTimeout(state.toastTimer);
  elements.toast.textContent = message;
  elements.toast.hidden = false;
  state.toastTimer = window.setTimeout(() => {
    elements.toast.hidden = true;
  }, 2600);
}

function setView(viewName) {
  state.activeView = viewName;
  document.body.classList.toggle("session-active", viewName === "session");

  for (const view of elements.views) {
    view.hidden = view.dataset.view !== viewName;
  }

  for (const button of elements.bottomNavButtons) {
    const isActive = button.dataset.nav === viewName;
    button.classList.toggle("is-active", isActive);
    if (isActive) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  }

  window.scrollTo({ top: 0, behavior: "instant" });
}

function renderHome() {
  ensureDaily();
  const mode = state.data.settings.mode;
  const plan = getPlan(state.data.progress, mode);
  const allScripts = ["hiragana", "katakana"];
  const totalLearned = allScripts.reduce((sum, script) => sum + getLearnedCount(state.data.progress, script), 0);
  const dueCount = getDueItems(state.data.progress, scriptsForMode(mode)).length;

  elements.streakValue.textContent = String(state.data.streak || 0);
  elements.learnedValue.textContent = String(totalLearned);
  elements.dueValue.textContent = String(dueCount);

  for (const button of elements.modeButtons) {
    const isActive = button.dataset.mode === mode;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }

  if (plan.dueCount > 0 && plan.newCount > 0) {
    elements.planHeadline.textContent = `复习 ${plan.dueCount} 个，学习 ${plan.newCount} 个新字`;
    elements.planDetail.textContent = "先巩固已经见过的字，再进入新的内容。";
  } else if (plan.dueCount > 0) {
    elements.planHeadline.textContent = `今天先复习 ${plan.dueCount} 个`;
    elements.planDetail.textContent = "这一组不会加入太多新内容，让记忆先稳定下来。";
  } else if (plan.newCount > 0) {
    const rowLabel = plan.next ? plan.next.row.label : "下一组";
    elements.planHeadline.textContent = `从 ${rowLabel} 开始`;
    elements.planDetail.textContent = `${plan.newCount} 个新假名，之后会在合适的时间再次出现。`;
  } else {
    elements.planHeadline.textContent = "今天没有到期卡片";
    elements.planDetail.textContent = "可以换一种模式，或者到五十音图里自由复习。";
  }

  renderKanaPreview(plan.newCount > 0 ? plan.newItems : plan.dueItems);
  renderRoadmap(mode);
}

function renderKanaPreview(items) {
  elements.kanaPreview.replaceChildren();

  const previewItems = items.length
    ? items
    : scriptsForMode(state.data.settings.mode).flatMap((script) =>
        KANA_DATA.filter(
          (item) =>
            getStage(item) === 1 && !getRecord(state.data.progress, item.id, script).seen
        )
          .slice(0, 2)
          .map((item) => ({ id: item.id, script }))
      );

  if (!previewItems.length) {
    const tile = document.createElement("span");
    tile.className = "preview-tile";
    tile.textContent = "✓";
    elements.kanaPreview.append(tile);
    return;
  }

  for (const item of previewItems.slice(0, 5)) {
    const kanaItem = KANA_BY_ID.get(item.id);
    const tile = document.createElement("span");
    tile.className = "preview-tile";
    if (kanaItem.type === "rule") tile.classList.add("is-rule");
    tile.lang = "ja";
    tile.textContent = getCharacter(kanaItem, item.script);
    elements.kanaPreview.append(tile);
  }
}

function renderRoadmap(mode) {
  elements.roadmap.replaceChildren();
  const scripts = scriptsForMode(mode);
  const primaryScript = scripts[0];
  const currentRow = getPlan(state.data.progress, mode).next?.row?.id;

  for (const row of ALL_ROWS) {
    const stage = getStage(row);
    const unlocked = scripts.some((script) => isStageUnlocked(state.data.progress, script, stage));
    const stats = getRowStats(state.data.progress, row.id, primaryScript);
    const item = document.createElement("article");
    item.className = "roadmap-item";
    if (row.id === currentRow) item.classList.add("is-current");
    if (!unlocked) item.classList.add("is-locked");

    const top = document.createElement("div");
    top.className = "roadmap-top";

    const title = document.createElement("strong");
    title.textContent = stage > 1 ? `${row.label} · 阶段 ${stage}` : row.label;

    const status = document.createElement("span");
    status.className = "roadmap-state";
    if (!unlocked) {
      const previous = getStageProgress(state.data.progress, primaryScript, stage - 1);
      status.textContent = `${previous.stable}/${previous.required} 稳定后解锁`;
    } else {
      status.textContent = stats.seen === stats.total ? "已接触" : `${stats.seen}/${stats.total}`;
    }

    top.append(title, status);

    const kana = document.createElement("div");
    kana.className = "roadmap-kana";
    kana.lang = "ja";
    kana.textContent = row.ids.map((id) => getCharacter(KANA_BY_ID.get(id), primaryScript)).join(" ");

    item.append(top, kana);
    elements.roadmap.append(item);
  }
}

function startSession(options = {}) {
  const sessionOptions = options && options.focus ? { focus: options.focus } : {};
  const now = Date.now();
  state.session = buildSession(
    state.data.progress,
    state.data.settings.mode,
    now,
    Math.random,
    sessionOptions
  );
  state.answered = false;
  state.currentCard = null;

  if (!state.session.cards.length) {
    showCompletion(true);
    return;
  }

  setView("session");
  renderCurrentCard();
}

function startReviewSession(focus) {
  startSession({ focus });
}

function repeatSession() {
  const focus = state.session?.focus;
  startSession(focus && focus !== "daily" ? { focus } : {});
}

function renderCurrentCard() {
  const card = getCurrentCard(state.session);

  if (!card) {
    showCompletion(false);
    return;
  }

  state.currentCard = card;
  state.answered = false;
  state.cardShownAt = Date.now();
  elements.feedbackPanel.hidden = true;
  elements.answerGrid.hidden = false;

  const item = KANA_BY_ID.get(card.id);
  const isRule = item.type === "rule";
  const isReverse = !isRule && card.direction === "reverse";
  const prompt = isRule ? item.prompt : isReverse ? item.romaji : getCharacter(item, card.script);

  elements.questionType.textContent = isRule
    ? "发音规则"
    : isReverse
      ? "看读音，选假名"
      : "看假名，选读音";
  elements.questionInstruction.textContent = isRule
    ? item.instruction
    : isReverse
      ? "哪个是它的假名？"
      : "这个假名读什么？";
  elements.promptText.textContent = prompt;
  elements.promptText.lang = isReverse ? "en" : "ja";
  elements.promptText.classList.toggle("is-romaji", isReverse);
  elements.promptText.classList.toggle("is-word", isRule);
  const cardKindLabel =
    card.kind === "new" ? "新学" : card.kind === "mistake" ? "错题强化" : "到期复习";
  const contentStageLabels = {
    1: "基础阶段",
    2: "浊音阶段",
    3: "拗音阶段",
    4: "规则练习"
  };
  const contentStageLabel = contentStageLabels[getStage(item)] || "基础阶段";
  elements.cardCaption.textContent = isReverse
    ? `${getScriptName(card.script)} · ${contentStageLabel} · 主动回忆`
    : `${getScriptName(card.script)} · ${contentStageLabel} · ${cardKindLabel}`;

  renderAnswers(card);
  updateSessionProgress();
}

function renderAnswers(card) {
  elements.answerGrid.replaceChildren();
  const choices = getChoices(card);

  choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-button";
    button.dataset.answer = choice;

    const keyHint = document.createElement("span");
    keyHint.className = "key-hint";
    keyHint.textContent = String(index + 1);

    const value = document.createElement("span");
    if (card.direction === "reverse") {
      value.className = "answer-kana";
      value.lang = "ja";
    } else {
      value.className = "answer-romaji";
      value.lang = "en";
    }
    value.textContent = choice;

    button.append(keyHint, value);
    button.addEventListener("click", () => answerQuestion(choice));
    elements.answerGrid.append(button);
  });
}

function answerQuestion(answer) {
  if (state.answered || !state.session || !state.currentCard) return;

  state.answered = true;
  const responseMs = Date.now() - state.cardShownAt;
  const result = applyAnswer(state.session, answer, state.data.progress, Date.now(), responseMs);
  const card = state.currentCard;
  const item = KANA_BY_ID.get(card.id);

  ensureDaily();
  state.data.daily.answered += 1;
  if (result.correct) state.data.daily.correct += 1;
  if (result.newlyLearned) state.data.daily.newCards += 1;
  recordStudyDay();
  saveState();

  for (const button of elements.answerGrid.querySelectorAll(".answer-button")) {
    const isExpected = button.dataset.answer === result.expected;
    const isSelected = button.dataset.answer === answer;
    button.disabled = true;
    if (isExpected) button.classList.add("is-correct");
    if (isSelected && !result.correct) button.classList.add("is-wrong");
  }

  elements.feedbackTitle.textContent = result.correct ? "答对了" : "这次没想起来";
  const baseFeedback =
    item.type === "rule"
      ? result.correct
        ? `${item.prompt} · ${item.answer}`
        : `正确答案是 ${result.expected}。${item.prompt} · ${item.answer}`
      : result.correct
        ? `${item.hiragana} / ${item.katakana} · ${item.romaji}`
        : `正确答案是 ${result.expected}。${item.hiragana} / ${item.katakana} · ${item.romaji}`;
  const paceFeedback =
    result.performance === "fast"
      ? " 反应很快，下次间隔会适当拉长。"
      : result.performance === "slow"
        ? " 这次较慢，系统会更快安排复习。"
        : "";
  elements.feedbackDetail.textContent = baseFeedback + paceFeedback;

  if (item.note) {
    elements.memoryNote.textContent = item.note;
    elements.memoryNote.hidden = false;
  } else {
    elements.memoryNote.hidden = true;
  }

  elements.feedbackPanel.hidden = false;
  elements.continueButton.focus({ preventScroll: true });
  updateSessionProgress();
}

function continueSession() {
  if (!state.answered) return;
  renderCurrentCard();
}

function updateSessionProgress() {
  if (!state.session) return;
  const progress = getSessionProgress(state.session);
  elements.sessionProgressBar.style.width = `${Math.min(100, progress * 100)}%`;
  elements.sessionCount.textContent = `${Math.min(state.session.currentIndex, state.session.cards.length)} / ${state.session.cards.length}`;
}

function showCompletion(empty) {
  const stats = state.session?.stats || {
    answered: 0,
    correct: 0,
    wrong: 0,
    completedCards: 0,
    newLearned: 0
  };
  const accuracy = stats.answered ? Math.round((stats.correct / stats.answered) * 100) : 0;
  const focus = state.session?.focus || "daily";

  if (empty) {
    elements.completeTitle.textContent =
      focus === "mistakes" ? "没有待强化错题" : "当前没有到期卡片";
    elements.completeSubtitle.textContent = "可以先学习新内容，或者到五十音图中自由查看。";
  } else if (focus === "due") {
    elements.completeTitle.textContent = "到期复习完成";
    elements.completeSubtitle.textContent = "本轮完成情况已经写入下一次复习安排。";
  } else if (focus === "mistakes") {
    elements.completeTitle.textContent = "错题强化完成";
    elements.completeSubtitle.textContent = "答对后会按新的表现重新安排复习时间。";
  } else {
    elements.completeTitle.textContent = "这一组完成了";
    elements.completeSubtitle.textContent = "正确答案会自动进入下一次复习，不需要手动安排。";
  }

  elements.completeCorrect.textContent = String(stats.correct);
  elements.completeNew.textContent = String(stats.newLearned);
  elements.completeAccuracy.textContent = `${accuracy}%`;

  if (!empty) {
    ensureDaily();
    state.data.daily.sessions += 1;
    saveState();
  }

  setView("complete");
  renderAll();
}

function finishSession() {
  const focus = state.session?.focus;
  state.session = null;
  state.currentCard = null;
  setView(focus && focus !== "daily" ? "review" : "home");
  renderAll();
}

function closeSession() {
  if (state.session?.stats.answered > 0) {
    const shouldClose = window.confirm("退出后，本组已完成的部分会保留。确定退出吗？");
    if (!shouldClose) return;
  }

  finishSession();
}

function speak(item) {
  if (!("speechSynthesis" in window)) {
    showToast("当前浏览器不支持语音朗读");
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(item.hiragana);
  utterance.lang = "ja-JP";
  utterance.rate = 0.8;
  window.speechSynthesis.speak(utterance);
}

function renderChart() {
  for (const button of elements.chartScriptButtons) {
    const isActive = button.dataset.chartScript === state.chartScript;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }

  for (const button of elements.chartStageButtons) {
    const isActive = Number(button.dataset.chartStage) === state.chartStage;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }

  elements.chartGrid.replaceChildren();
  const stageRows = ALL_ROWS.filter((candidate) => getStage(candidate) === state.chartStage);
  const detailSupported = stageRows.some((row) =>
    row.ids.includes(state.chartDetailId) &&
    itemSupportsScript(KANA_BY_ID.get(state.chartDetailId), state.chartScript)
  );

  if (!detailSupported) {
    const firstSupportedRow = stageRows.find((row) =>
      row.ids.some((id) => itemSupportsScript(KANA_BY_ID.get(id), state.chartScript))
    );
    state.chartDetailId = firstSupportedRow?.ids.find((id) =>
      itemSupportsScript(KANA_BY_ID.get(id), state.chartScript)
    ) || "a";
  }

  for (const row of stageRows) {
    const rowElement = document.createElement("section");
    rowElement.className = "chart-row";

    const heading = document.createElement("div");
    heading.className = "chart-row-heading";

    const label = document.createElement("strong");
    label.textContent = row.label;

    const stats = getRowStats(state.data.progress, row.id, state.chartScript);
    const status = document.createElement("span");
    status.textContent = `${stats.seen}/${stats.total} 已接触`;

    heading.append(label, status);

    const grid = document.createElement("div");
    grid.className = "kana-grid";
    const supportedIds = row.ids.filter((id) =>
      itemSupportsScript(KANA_BY_ID.get(id), state.chartScript)
    );

    for (const id of supportedIds) {
      const item = KANA_BY_ID.get(id);
      const record = getRecord(state.data.progress, id, state.chartScript);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "kana-tile";
      if (item.type === "rule") button.classList.add("is-rule");
      button.dataset.kanaId = id;
      button.setAttribute(
        "aria-label",
        item.type === "rule"
          ? `${item.prompt}，读音 ${item.answer}`
          : `${getCharacter(item, state.chartScript)}，读音 ${item.romaji}`
      );

      if (record.seen) button.classList.add("is-seen");
      if (record.stage >= 1) button.classList.add("is-learning");
      if (record.stage >= 4) button.classList.add("is-mastered");

      const character = document.createElement("span");
      character.className = "tile-character";
      character.lang = "ja";
      character.textContent = getCharacter(item, state.chartScript);

      const romaji = document.createElement("span");
      romaji.className = "tile-romaji";
      romaji.lang = "en";
      romaji.textContent = item.romaji;

      button.append(character, romaji);
      button.addEventListener("click", () => {
        state.chartDetailId = id;
        renderChartDetail();
      });
      grid.append(button);
    }

    rowElement.append(heading, grid);
    elements.chartGrid.append(rowElement);
  }

  renderChartDetail();
}

function renderChartDetail() {
  const item = KANA_BY_ID.get(state.chartDetailId) || KANA_DATA[0];
  const row = getRow(item.row);
  const isRule = item.type === "rule";

  elements.chartDetail.hidden = false;
  elements.detailCharacter.classList.toggle("is-rule", isRule);
  elements.detailCharacter.textContent = getCharacter(item, state.chartScript);
  elements.detailCharacter.lang = "ja";
  elements.detailRow.textContent = `${getScriptName(state.chartScript)} · ${row.label}`;
  elements.detailRomaji.textContent = isRule ? item.answer : item.romaji;
  elements.detailPair.textContent = isRule
    ? isRule && item.ruleType === "long"
      ? "长音规则"
      : "促音规则"
    : `同音：${item.hiragana} / ${item.katakana}`;

  if (item.note) {
    elements.detailNote.textContent = item.note;
    elements.detailNote.hidden = false;
  } else {
    elements.detailNote.hidden = true;
  }
}

function formatDueLabel(dueAt, now = Date.now()) {
  if (!dueAt) return "尚未安排";
  const difference = dueAt - now;
  if (difference <= 0) return "现在";
  if (difference < HOUR) return `${Math.max(1, Math.ceil(difference / 60000))} 分钟`;
  if (difference < DAY) return `${Math.ceil(difference / HOUR)} 小时`;
  return `${Math.ceil(difference / DAY)} 天`;
}

function renderReview() {
  const scripts = scriptsForMode(state.data.settings.mode);
  const summary = getReviewSummary(state.data.progress, scripts);
  const mistakes = getMistakeItems(state.data.progress, scripts);
  const hardItems = mistakes.filter((item) => item.hard);

  elements.reviewDueValue.textContent = String(summary.dueCount);
  elements.reviewMistakeValue.textContent = String(summary.mistakeCount);
  elements.reviewHardValue.textContent = String(summary.hardCount);
  elements.reviewNextDue.textContent = summary.nextDueAt ? formatDueLabel(summary.nextDueAt) : "无";
  elements.reviewDueDetail.textContent = summary.dueCount
    ? `${summary.dueCount} 张卡片已经到期，本轮只包含复习卡。`
    : "当前没有到期卡片，完成学习后会自动安排。";
  elements.reviewMistakeDetail.textContent = summary.mistakeCount
    ? `${summary.mistakeCount} 张卡曾经答错，可以随时单独强化。`
    : "还没有需要强化的假名。";

  elements.startDueReviewButton.disabled = summary.dueCount === 0;
  elements.startMistakeReviewButton.disabled = summary.mistakeCount === 0;

  elements.reviewHardList.replaceChildren();
  if (!hardItems.length) {
    const empty = document.createElement("div");
    empty.className = "empty-review";
    empty.textContent = "连续答错 3 次后会标记为困难卡，并在之后的复习中降低间隔。";
    elements.reviewHardList.append(empty);
  } else {
    for (const item of hardItems.slice(0, 8)) {
      const kana = KANA_BY_ID.get(item.id);
      const row = getRow(kana.row);
      const card = document.createElement("article");
      card.className = "review-card-item is-hard";

      const character = document.createElement("div");
      character.className = "review-character";
      character.lang = "ja";
      character.textContent = getCharacter(kana, item.script);

      const copy = document.createElement("div");
      copy.className = "review-card-copy";
      const title = document.createElement("strong");
      title.textContent = `${kana.romaji} · ${getScriptName(item.script)} · ${row.label}`;
      const detail = document.createElement("span");
      detail.textContent = `累计答错 ${item.lapses} 次 · 平均 ${item.averageMs ? Math.round(item.averageMs / 100) / 10 : 0} 秒`;
      copy.append(title, detail);

      const badge = document.createElement("span");
      badge.className = "hard-badge";
      badge.textContent = formatDueLabel(item.dueAt);

      card.append(character, copy, badge);
      elements.reviewHardList.append(card);
    }
  }

  elements.reviewScheduleText.textContent = summary.dueCount
    ? `最近一张会在 ${formatDueLabel(summary.nextDueAt)} 进入复习。快答会延后，慢答或困难卡会更早出现。`
    : "答对后按 1、3、7、14、30 天逐步拉长；快答会适度延后，慢答会更早再见。";
}

function renderProgress() {
  ensureDaily();
  const allScripts = ["hiragana", "katakana"];
  const learned = allScripts.reduce((sum, script) => sum + getLearnedCount(state.data.progress, script), 0);
  const mastered = allScripts.reduce((sum, script) => sum + getMasteredCount(state.data.progress, script), 0);

  const totalKana = getTotalStudyUnits();
  elements.progressLearned.textContent = `${learned} / ${totalKana}`;
  elements.progressMastered.textContent = `${mastered} / ${totalKana}`;
  elements.progressToday.textContent = `${state.data.daily.answered} 题`;
  elements.progressStreak.textContent = `${state.data.streak || 0} 天`;

  elements.rowProgressList.replaceChildren();

  for (const row of ALL_ROWS) {
    const stage = getStage(row);
    const unlocked =
      isStageUnlocked(state.data.progress, "hiragana", stage) ||
      isStageUnlocked(state.data.progress, "katakana", stage);
    const hiragana = getRowStats(state.data.progress, row.id, "hiragana");
    const katakana = getRowStats(state.data.progress, row.id, "katakana");
    const seen = hiragana.seen + katakana.seen;
    const total = hiragana.total + katakana.total;
    const progress = total ? seen / total : 0;

    const item = document.createElement("div");
    item.className = "row-progress-item";
    if (!unlocked) item.classList.add("is-locked");

    const label = document.createElement("strong");
    label.textContent = stage > 1 ? `${row.label} · 阶段 ${stage}` : row.label;

    const track = document.createElement("div");
    track.className = "progress-track";
    const fill = document.createElement("span");
    fill.style.width = `${progress * 100}%`;
    track.append(fill);

    const count = document.createElement("span");
    count.textContent = `${seen}/${total}`;

    item.append(label, track, count);
    elements.rowProgressList.append(item);
  }
}

function renderInstallState() {
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  const isIOS =
    /iphone|ipad|ipod/i.test(window.navigator.userAgent) ||
    (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
  const dismissed = state.data.settings.dismissedInstall;

  elements.installButton.hidden = standalone || (!state.deferredInstallPrompt && !isIOS);
  elements.iosInstallBanner.hidden = standalone || !isIOS || dismissed;

  if (standalone) {
    elements.installHelpText.textContent = "当前已经从主屏幕打开，应用壳和假名数据都可以离线使用。";
  } else if (isIOS) {
    elements.installHelpText.textContent =
      "使用 Safari 打开本页，点“分享”，再选“添加到主屏幕”。之后即可全屏、离线打开。";
  } else {
    elements.installHelpText.textContent =
      "如果浏览器显示安装按钮，可直接安装。iPhone 需要使用 Safari 的“添加到主屏幕”。";
  }
}

function renderAll() {
  renderHome();
  renderReview();
  renderChart();
  renderProgress();
  renderInstallState();
}

function exportProgress() {
  const payload = {
    app: "Kana 5",
    exportedAt: new Date().toISOString(),
    data: state.data
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `kana-5-backup-${todayKey()}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
  showToast("进度备份已生成");
}

async function importProgress(file) {
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    const imported = parsed.data || parsed;

    if (!imported || typeof imported !== "object" || !imported.progress) {
      throw new Error("invalid");
    }

    state.data = {
      ...defaultState(),
      ...imported,
      progress: imported.progress,
      settings: {
        ...defaultState().settings,
        ...(imported.settings || {})
      }
    };
    saveState();
    renderAll();
    showToast("进度已导入");
  } catch {
    showToast("无法读取这个备份文件");
  } finally {
    elements.importInput.value = "";
  }
}

function resetProgress() {
  const shouldReset = window.confirm("这会清除全部学习记录，且无法撤销。确定继续吗？");
  if (!shouldReset) return;

  state.data = defaultState();
  saveState();
  renderAll();
  showToast("学习记录已清除");
}

function bindEvents() {
  for (const button of elements.navButtons) {
    button.addEventListener("click", (event) => {
      if (button.tagName === "A") event.preventDefault();
      if (state.session && state.activeView === "session") return;
      setView(button.dataset.nav);
      renderAll();
    });
  }

  for (const button of elements.modeButtons) {
    button.addEventListener("click", () => {
      state.data.settings.mode = button.dataset.mode;
      saveState();
      renderHome();
    });
  }

  for (const button of elements.chartScriptButtons) {
    button.addEventListener("click", () => {
      state.chartScript = button.dataset.chartScript;
      renderChart();
    });
  }

  for (const button of elements.chartStageButtons) {
    button.addEventListener("click", () => {
      state.chartStage = Number(button.dataset.chartStage);
      renderChart();
    });
  }

  elements.startSessionButton.addEventListener("click", () => startSession());
  elements.continueButton.addEventListener("click", continueSession);
  elements.closeSessionButton.addEventListener("click", closeSession);
  elements.anotherSessionButton.addEventListener("click", repeatSession);
  elements.finishSessionButton.addEventListener("click", finishSession);
  elements.startDueReviewButton.addEventListener("click", () => startReviewSession("due"));
  elements.startMistakeReviewButton.addEventListener("click", () => startReviewSession("mistakes"));
  elements.audioButton.addEventListener("click", () => {
    if (state.currentCard) speak(KANA_BY_ID.get(state.currentCard.id));
  });
  elements.detailAudioButton.addEventListener("click", () => {
    speak(KANA_BY_ID.get(state.chartDetailId));
  });
  elements.dismissInstallButton.addEventListener("click", () => {
    state.data.settings.dismissedInstall = true;
    saveState();
    renderInstallState();
  });
  elements.exportButton.addEventListener("click", exportProgress);
  elements.importButton.addEventListener("click", () => elements.importInput.click());
  elements.importInput.addEventListener("change", () => {
    const [file] = elements.importInput.files;
    if (file) importProgress(file);
  });
  elements.resetButton.addEventListener("click", resetProgress);

  elements.installButton.addEventListener("click", async () => {
    if (state.deferredInstallPrompt) {
      state.deferredInstallPrompt.prompt();
      await state.deferredInstallPrompt.userChoice;
      state.deferredInstallPrompt = null;
      renderInstallState();
      return;
    }

    setView("progress");
    renderAll();
    showToast("请按页面提示添加到主屏幕");
  });

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    state.deferredInstallPrompt = event;
    renderInstallState();
  });

  window.addEventListener("appinstalled", () => {
    state.deferredInstallPrompt = null;
    showToast("已经安装到设备");
    renderInstallState();
  });

  window.addEventListener("keydown", (event) => {
    if (state.activeView !== "session") return;

    if (state.answered) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        continueSession();
      }
      return;
    }

    const index = Number(event.key) - 1;
    const buttons = [...elements.answerGrid.querySelectorAll(".answer-button")];
    if (index >= 0 && index < buttons.length) {
      event.preventDefault();
      buttons[index].click();
    }
  });
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  try {
    await navigator.serviceWorker.register("./sw.js");
  } catch {
    // The app still works online if service worker registration is unavailable.
  }
}

function updateThemeColor() {
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", THEME_COLOR);
}

function init() {
  updateThemeColor();
  bindEvents();
  setView("home");
  renderAll();
  registerServiceWorker();
}

init();
