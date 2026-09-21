import { spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const port = 9223;
const profilePath = resolve(`work/edge-test-profile-${Date.now()}`);
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
    "http://127.0.0.1:8080/"
  ],
  { stdio: "ignore" }
);

async function getPageTarget() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`);
      const targets = await response.json();
      const page = targets.find((target) => target.type === "page" && target.url.includes("127.0.0.1:8080"));
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

      if (message.error) {
        request.reject(new Error(message.error.message));
      } else {
        request.resolve(message.result);
      }
    });

    socket.addEventListener("error", () => {
      rejectClient(new Error("WebSocket connection failed."));
    });
  });
}

function evaluateExpression(client, expression) {
  return client
    .send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true
    })
    .then((result) => {
      if (result.exceptionDetails) {
        throw new Error(result.exceptionDetails.text || "Browser evaluation failed.");
      }
      return result.result.value;
    });
}

let client;

try {
  const target = await getPageTarget();
  client = await createClient(target.webSocketDebuggerUrl);
  await client.send("Runtime.enable");
  await delay(1200);

  const home = await evaluateExpression(
    client,
    `({
      title: document.querySelector("#homeTitle")?.textContent,
      startVisible: !document.querySelector("#startSessionButton")?.hidden,
      manifest: document.querySelector('link[rel="manifest"]')?.getAttribute("href"),
      serviceWorkerSupported: "serviceWorker" in navigator
    })`
  );

  await evaluateExpression(client, `document.querySelector("#startSessionButton").click(); true`);
  await delay(500);

  const session = await evaluateExpression(
    client,
    `({
      viewVisible: !document.querySelector("#sessionView")?.hidden,
      prompt: document.querySelector("#promptText")?.textContent,
      answerCount: document.querySelectorAll("#answerGrid .answer-button").length,
      question: document.querySelector("#questionInstruction")?.textContent
    })`
  );

  await evaluateExpression(client, `document.querySelector("#answerGrid .answer-button").click(); true`);
  await delay(300);

  const feedback = await evaluateExpression(
    client,
    `({
      visible: !document.querySelector("#feedbackPanel")?.hidden,
      title: document.querySelector("#feedbackTitle")?.textContent,
      storedProgress: Boolean(JSON.parse(localStorage.getItem("kana-card-state-v1"))?.progress)
    })`
  );

  await evaluateExpression(client, `document.querySelector("#continueButton").click(); true`);
  await delay(300);

  const afterContinue = await evaluateExpression(
    client,
    `({
      feedbackHidden: document.querySelector("#feedbackPanel")?.hidden,
      nextPrompt: document.querySelector("#promptText")?.textContent,
      sessionCount: document.querySelector("#sessionCount")?.textContent
    })`
  );

  const serviceWorker = await evaluateExpression(
    client,
    `Promise.race([
      navigator.serviceWorker.ready.then((registration) => ({
        active: Boolean(registration.active),
        scope: registration.scope
      })),
      new Promise((resolve) => setTimeout(() => resolve({ active: false, scope: "" }), 3000))
    ])`
  );

  console.log(JSON.stringify({ home, session, feedback, afterContinue, serviceWorker }, null, 2));
} finally {
  client?.close();
  browser.kill();
}
