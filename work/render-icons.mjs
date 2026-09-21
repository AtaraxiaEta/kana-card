import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const iconUrl = pathToFileURL(resolve("outputs/kana-card/icons/icon.svg")).href;
const profilePath = resolve(`work/edge-icon-profile-${Date.now()}`);
const outputs = [
  [180, "apple-touch-icon.png"],
  [192, "icon-192.png"],
  [512, "icon-512.png"]
];

mkdirSync(profilePath, { recursive: true });

for (const [size, fileName] of outputs) {
  const outputPath = resolve("outputs/kana-card/icons", fileName);
  const result = spawnSync(
    edgePath,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      `--window-size=${size},${size}`,
      "--virtual-time-budget=1500",
      `--user-data-dir=${profilePath}`,
      `--screenshot=${outputPath}`,
      iconUrl
    ],
    { stdio: "ignore" }
  );
  if (result.status !== 0) throw new Error(`Failed to render ${fileName}`);
  console.log(`Rendered ${fileName}`);
}