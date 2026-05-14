/**
 * Starts `next dev` with:
 * 1. macOS malloc-debug env vars stripped (avoids MallocStackLogging spam from worker processes).
 * 2. Webpack by default — Turbopack can sit on "○ Compiling / ..." forever when the repo lives
 *    next to another package-lock (e.g. parent "CODY TEST") or on some macOS setups. Opt in with
 *    `npm run dev -- --turbopack` or `USE_TURBOPACK=1 npm run dev`.
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const nextBin = path.join(root, "node_modules", ".bin", "next");

const STRIP_FROM_ENV = [
  "MallocStackLogging",
  "MallocStackLoggingNoCompact",
  "MallocScribble",
  "MallocGuardEdges",
];

const env = { ...process.env };
for (const key of STRIP_FROM_ENV) {
  delete env[key];
}

const userArgs = process.argv.slice(2);
const wantsTurbopack =
  env.USE_TURBOPACK === "1" ||
  env.USE_TURBOPACK === "true" ||
  userArgs.some((a) => a === "--turbo" || a === "--turbopack");

const nextArgs = wantsTurbopack ? ["dev", ...userArgs] : ["dev", "--webpack", ...userArgs];

const child = spawn(nextBin, nextArgs, {
  cwd: root,
  env,
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
