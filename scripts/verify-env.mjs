import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const envPath = path.join(root, ".env.local");

const KEYS = [
  "NEXT_PUBLIC_WHOP_STARTER_URL",
  "NEXT_PUBLIC_WHOP_PRO_URL",
];

/** Warn when unset — required for `/experiences/...` gated HTML delivery. */
const DELIVERY_HINTS = [
  "WHOP_API_KEY",
  "WHOP_APP_ID",
  "WHOP_PRO_PRODUCT_ID",
  "WHOP_STARTER_PRODUCT_ID",
];

/** Embedded checkout + OAuth on your domain */
const EMBED_OAUTH_HINTS = [
  "NEXT_PUBLIC_APP_URL",
  "NEXT_PUBLIC_WHOP_EXPERIENCE_ID",
  "NEXT_PUBLIC_WHOP_STARTER_PLAN_ID",
  "NEXT_PUBLIC_WHOP_PRO_PLAN_ID",
  "NEXT_PUBLIC_WHOP_APP_ID",
  "WHOP_CLIENT_SECRET",
  "WHOP_KIT_SESSION_SECRET",
];

function parseEnvLocal(text) {
  /** @type {Record<string, string>} */
  const out = {};
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    out[key] = value;
  }
  return out;
}

function isHttpsUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === "https:";
  } catch {
    return false;
  }
}

function isHttpOrHttpsAppUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

if (!fs.existsSync(envPath)) {
  console.error("verify-env: missing .env.local at", envPath);
  process.exit(1);
}

const vars = parseEnvLocal(fs.readFileSync(envPath, "utf8"));
let failed = false;

for (const key of KEYS) {
  const value = vars[key];
  if (value === undefined || value === "") {
    console.warn(
      `verify-env: ${key} is empty — Next.js will use the in-code fallback URL.`,
    );
    continue;
  }
  if (!isHttpsUrl(value)) {
    console.error(
      `verify-env: ${key} must be a full https URL (got: ${JSON.stringify(value)})`,
    );
    failed = true;
  } else {
    console.log("verify-env: OK", key);
  }
}

if (failed) process.exit(1);
console.log("verify-env: all set non-empty keys look valid.");

for (const key of DELIVERY_HINTS) {
  const value = vars[key];
  if (value === undefined || value === "") {
    console.warn(
      `verify-env: ${key} is empty — authenticated kit pages under /experiences/ will not work until set.`,
    );
  }
}

const appUrl = vars.NEXT_PUBLIC_APP_URL;
if (appUrl && !isHttpOrHttpsAppUrl(appUrl)) {
  console.warn(
    `verify-env: NEXT_PUBLIC_APP_URL should be a full http(s) URL (got: ${JSON.stringify(appUrl)})`,
  );
}

for (const key of EMBED_OAUTH_HINTS) {
  const value = vars[key];
  if (value === undefined || value === "") {
    console.warn(
      `verify-env: ${key} is empty — embedded checkout + OAuth kit unlock on your domain will not work until set.`,
    );
  }
}
