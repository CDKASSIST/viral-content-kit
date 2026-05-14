import fs from "node:fs/promises";
import path from "node:path";
import type Whop from "@whop/sdk";

const KITS_DIR = path.join(process.cwd(), "content", "kits");

const DEFAULT_PRO_REL = path.join("content", "kits", "creator-pro.html");
const DEFAULT_STARTER_REL = path.join("content", "kits", "creator-starter.html");

function trimEnv(name: string): string | undefined {
  const v = process.env[name]?.trim();
  return v || undefined;
}

function resolveUnderKitsDir(relFromRepoRoot: string): string | null {
  const abs = path.resolve(process.cwd(), relFromRepoRoot);
  const kitsResolved = path.resolve(KITS_DIR);
  if (!abs.startsWith(kitsResolved + path.sep) && abs !== kitsResolved) {
    return null;
  }
  return abs;
}

export type KitResolution =
  | { ok: true; absolutePath: string; tier: "pro" | "starter" }
  | { ok: false; message: string; status: number };

async function resolveKitOnDiskForTier(tier: "pro" | "starter"): Promise<KitResolution> {
  const relFromRoot =
    tier === "pro"
      ? (trimEnv("KIT_HTML_PATH_PRO") ?? DEFAULT_PRO_REL)
      : (trimEnv("KIT_HTML_PATH_STARTER") ?? DEFAULT_STARTER_REL);

  const absolutePath = resolveUnderKitsDir(relFromRoot);
  if (!absolutePath) {
    return {
      ok: false,
      status: 500,
      message: "Kit file path must stay under content/kits.",
    };
  }

  try {
    await fs.access(absolutePath);
  } catch {
    return { ok: false, status: 404, message: "Kit file is missing on the server." };
  }

  return { ok: true, absolutePath, tier };
}

/**
 * Confirms the viewer may use this experience, then picks Pro vs Starter kit
 * from Whop product access. Requires `WHOP_PRO_PRODUCT_ID` / `WHOP_STARTER_PRODUCT_ID`
 * when both tiers exist.
 */
async function resolveAuthorizedKitViaWhop(
  whop: Whop,
  userId: string,
  experienceId: string,
): Promise<KitResolution> {
  const proProductId = trimEnv("WHOP_PRO_PRODUCT_ID");
  const starterProductId = trimEnv("WHOP_STARTER_PRODUCT_ID");

  const experienceAccess = await whop.users.checkAccess(experienceId, {
    id: userId,
  });
  if (!experienceAccess.has_access) {
    return {
      ok: false,
      status: 403,
      message: "You do not have access to this product experience.",
    };
  }

  let tier: "pro" | "starter" | null = null;

  if (proProductId) {
    const pro = await whop.users.checkAccess(proProductId, { id: userId });
    if (pro.has_access) tier = "pro";
  }
  if (!tier && starterProductId) {
    const st = await whop.users.checkAccess(starterProductId, { id: userId });
    if (st.has_access) tier = "starter";
  }

  if (!tier) {
    return {
      ok: false,
      status: 403,
      message:
        "No kit is linked to your purchase. The seller should set WHOP_PRO_PRODUCT_ID and WHOP_STARTER_PRODUCT_ID to the Whop product IDs for each checkout.",
    };
  }

  return resolveKitOnDiskForTier(tier);
}

export async function resolveAuthorizedKit(
  whop: Whop | null,
  userId: string,
  experienceId: string,
  options?: { devBypassTier?: "starter" | "pro" | null },
): Promise<KitResolution> {
  if (process.env.NEXT_PUBLIC_DEV_BYPASS_PAYMENT !== "true" || process.env.NODE_ENV === "production") {
    if (!whop) {
      return {
        ok: false,
        status: 503,
        message: "Kit delivery is not configured (Whop client unavailable).",
      };
    }
    return resolveAuthorizedKitViaWhop(whop, userId, experienceId);
  }

  if (options?.devBypassTier === "starter" || options?.devBypassTier === "pro") {
    return resolveKitOnDiskForTier(options.devBypassTier);
  }

  if (!whop) {
    return {
      ok: false,
      status: 503,
      message: "Kit delivery is not configured (Whop client unavailable).",
    };
  }
  return resolveAuthorizedKitViaWhop(whop, userId, experienceId);
}
