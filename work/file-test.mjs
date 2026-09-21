import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { setTimeout as delay } from "node:timers/promises";

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const port = 9224;
const pageUrl = pathToFileURL(resolve("outputs/kana-card/index.html")).href;
const profilePath = resolve(`work/edge-file-profile-${Date.now()}`);
mkdirSync(profilePath, { recursive: true });

const browser = spawn(
  edgePath,
  [
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profilePath}`,
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    pageUrl
  ],
  { stdio: "ignore" }
);

async function getPageTarget() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`);
      const targets = await response.json();
      const page = targets.find((target) => target.type === "page" && target.url.startsWith("file:"));
      if (page) return page;
    } catch {
      // Edge may need another moment to open the debugging endpoint.
    }
    await delay(250);
  }
  throw new Error("Could not connect to the Edge debugging endpoint.");
}

function createClient(socketUrl) {
  return new Promise((resolveClient, rejectClient) => {
    const socket = new WebSocket(socketUrl);
    const pending = new Map();
    let nextId = 1;

    socket.addEventListener("open", () => {
      resolveClient({
        send(method, params = {}) {
          return new Promise((resolveCommand, rejectCommand) => {
            const id = nextId;
            nextId += 1;
            pending.set(id, { resolve: resolveCommand, reject: rejectCommand });
            socket.send(JSON.stringify({ id, method, params }));
          });
        },
        close() {
          socket.close();
        }
      });
    });

    socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (!message.id || !pending.has(message.id)) return;
      const request = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) request.reject(new Error(message.error.message));
      else request.resolve(message.result);
    });

    socket.addEventListener("error", () => rejectClient(new Error("WebSocket connection failed.")));
  });
}

async function evaluate(client, expression) {
  const result = await client.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || "Evaluation failed.");
  return result.result.value;
}

let client;

try {
  const target = await getPageTarget();
  client = await createClient(target.webSocketDebuggerUrl);
  await client.send("Runtime.enable");
  await delay(900);

  const home = await evaluate(client, `({
    url: location.href,
    title: document.querySelector("#homeTitle")?.textContent,
    scriptLoaded: Boolean(document.querySelector("#startSessionButton")),
    bundlePresent: [...document.scripts].some((script) => script.src.endsWith("app.bundle.js"))
  })`);

  const reviewNav = await evaluate(client, `({
    navCount: document.querySelectorAll(".nav-button").length,
    reviewButton: Boolean(document.querySelector('[data-nav="review"]'))
  })`);

  await evaluate(client, `document.querySelector('[data-nav="review"]').click(); true`);
  await delay(150);
  const reviewPage = await evaluate(client, `({
    visible: !document.querySelector("#reviewView")?.hidden,
    due: document.querySelector("#reviewDueValue")?.textContent,
    schedule: document.querySelector("#reviewScheduleText")?.textContent
  })`);
  await evaluate(client, `document.querySelector('[data-nav="home"]').click(); true`);
  await delay(150);
  await evaluate(client, `document.querySelector("#startSessionButton").click(); true`);
  await delay(250);

  const session = await evaluate(client, `({
    visible: !document.querySelector("#sessionView")?.hidden,
    prompt: document.querySelector("#promptText")?.textContent,
    answers: document.querySelectorAll("#answerGrid .answer-button").length
  })`);

  await evaluate(client, `document.querySelector("#answerGrid .answer-button").click(); true`);
  await delay(200);

  const feedback = await evaluate(client, `({
    visible: !document.querySelector("#feedbackPanel")?.hidden,
    title: document.querySelector("#feedbackTitle")?.textContent,
    saved: Boolean(localStorage.getItem("kana-card-state-v1"))
  })`);

  await evaluate(client, `localStorage.setItem("kana-card-state-v1", JSON.stringify({
    version: 1,
    progress: {
      "hiragana:a": {
        seen: true,
        stage: 2,
        streak: 1,
        lapses: 0,
        dueAt: Date.now() - 1000,
        lastSeen: Date.now() - 86400000,
        attempts: 1,
        correct: 1,
        averageMs: 1500,
        fastCorrect: 0,
        slowCorrect: 0,
        hard: false
      }
    },
    streak: 0,
    lastStudyDate: "",
    daily: { date: "2026-09-21", answered: 0, correct: 0, newCards: 0, sessions: 0 },
    settings: { mode: "hiragana", dismissedInstall: true }
  })); location.reload(); true`);
  await delay(900);
  await evaluate(client, `document.querySelector('[data-nav="review"]').click(); true`);
  await delay(150);

  const dueReviewPage = await evaluate(client, `({
    due: document.querySelector("#reviewDueValue")?.textContent,
    startEnabled: !document.querySelector("#startDueReviewButton")?.disabled
  })`);

  await evaluate(client, `document.querySelector("#startDueReviewButton").click(); true`);
  await delay(200);
  const dueSession = await evaluate(client, `({
    visible: !document.querySelector("#sessionView")?.hidden,
    prompt: document.querySelector("#promptText")?.textContent,
    caption: document.querySelector("#cardCaption")?.textContent
  })`);

  console.log(JSON.stringify({ home, reviewNav, reviewPage, session, feedback, dueReviewPage, dueSession }, null, 2));
} finally {
  client?.close();
  browser.kill();
}