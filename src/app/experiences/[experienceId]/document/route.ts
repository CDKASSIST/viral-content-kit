import { readFile } from "node:fs/promises";
import { headers } from "next/headers";
import { parseDevKitBypassTier } from "@/lib/dev-payment-bypass";
import { resolveAuthorizedKit } from "@/lib/kit-delivery";
import {
  getWhop,
  kitDeliveryBlockedUnlessDevBypass,
  resolveWhopUserForDelivery,
} from "@/lib/whop-server";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  context: { params: Promise<{ experienceId: string }> },
) {
  const { experienceId } = await context.params;
  const url = new URL(request.url);
  const devTier = parseDevKitBypassTier(url.searchParams.get("dev_kit_tier") ?? undefined);
  const useDevBypass =
    process.env.NEXT_PUBLIC_DEV_BYPASS_PAYMENT === "true" &&
    process.env.NODE_ENV !== "production" &&
    (devTier === "starter" || devTier === "pro");

  if (kitDeliveryBlockedUnlessDevBypass(useDevBypass)) {
    return new Response("Kit delivery is not configured on this server.", {
      status: 503,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const auth = await resolveWhopUserForDelivery(await headers(), {
    grantDevBypass: useDevBypass,
  });

  if (!auth) {
    return new Response(
      "Missing Whop session. Sign in with Whop from this site (after checkout) or open your kit from the Whop app.",
      {
        status: 401,
        headers: { "content-type": "text/plain; charset=utf-8" },
      },
    );
  }

  const whop = useDevBypass ? null : getWhop();
  const kit = await resolveAuthorizedKit(whop, auth.userId, experienceId, {
    devBypassTier: useDevBypass ? devTier : null,
  });
  if (!kit.ok) {
    return new Response(kit.message, {
      status: kit.status,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const html = await readFile(kit.absolutePath, "utf8");

  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "private, no-store",
    },
  });
}
