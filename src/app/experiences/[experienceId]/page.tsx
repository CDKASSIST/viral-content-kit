import Link from "next/link";
import { headers } from "next/headers";
import { parseDevKitBypassTier } from "@/lib/dev-payment-bypass";
import { resolveAuthorizedKit } from "@/lib/kit-delivery";
import { resolveWhopKitAppUrl } from "@/lib/whop-site-url";
import {
  getWhop,
  kitDeliveryBlockedUnlessDevBypass,
  resolveWhopUserForDelivery,
} from "@/lib/whop-server";

export const dynamic = "force-dynamic";

export default async function ExperienceKitPage({
  params,
  searchParams,
}: {
  params: Promise<{ experienceId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { experienceId } = await params;
  const sp = await searchParams;
  const devTier = parseDevKitBypassTier(sp.dev_kit_tier);
  const useDevBypass =
    process.env.NEXT_PUBLIC_DEV_BYPASS_PAYMENT === "true" &&
    process.env.NODE_ENV !== "production" &&
    (devTier === "starter" || devTier === "pro");

  if (kitDeliveryBlockedUnlessDevBypass(useDevBypass)) {
    return (
      <main className="min-h-dvh bg-zinc-950 px-6 py-16 text-zinc-100">
        <div className="mx-auto max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8">
          <h1 className="text-xl font-semibold text-zinc-50">Kit delivery not configured</h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            Set <code className="text-amber-200/90">WHOP_API_KEY</code> and{" "}
            <code className="text-amber-200/90">WHOP_APP_ID</code> on the server, then add
            product IDs so purchases map to the right HTML file.
          </p>
          {process.env.NEXT_PUBLIC_DEV_BYPASS_PAYMENT === "true" &&
          process.env.NODE_ENV !== "production" ? (
            <p className="mt-4 text-sm text-zinc-500">
              For local testing without Whop keys, open the marketing site &quot;Dev: Skip to
              Product&quot; link (adds <code className="text-amber-200/90">?dev_kit_tier=</code>
              ).
            </p>
          ) : null}
        </div>
      </main>
    );
  }

  const auth = await resolveWhopUserForDelivery(await headers(), {
    grantDevBypass: useDevBypass,
  });

  if (!auth) {
    const whopKitAppUrl = resolveWhopKitAppUrl(
      process.env.NEXT_PUBLIC_WHOP_EXPERIENCE_ID?.trim() ?? "",
    );
    return (
      <main className="min-h-dvh bg-zinc-950 px-6 py-16 text-zinc-100">
        <div className="mx-auto max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8">
          <h1 className="text-xl font-semibold text-zinc-50">Sign in through Whop</h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            Open this page from your purchase inside Whop (the embedded app view) so your
            session can be verified. The public marketing site cannot unlock your kit on its
            own.
          </p>
          {whopKitAppUrl ? (
            <p className="mt-4 text-sm leading-relaxed text-zinc-500">
              Configure Whop so the kit app opens{" "}
              <a href={whopKitAppUrl} className="font-medium text-amber-200 underline-offset-4 hover:underline">
                this URL
              </a>{" "}
              (must match your experience id in the address bar).
            </p>
          ) : null}
          <Link
            href="/"
            className="mt-6 inline-flex text-sm font-medium text-amber-200 underline-offset-4 hover:underline"
          >
            Back to marketing site
          </Link>
        </div>
      </main>
    );
  }

  const whop = useDevBypass ? null : getWhop();
  const kit = await resolveAuthorizedKit(whop, auth.userId, experienceId, {
    devBypassTier: useDevBypass ? devTier : null,
  });

  if (!kit.ok) {
    return (
      <main className="min-h-dvh bg-zinc-950 px-6 py-16 text-zinc-100">
        <div className="mx-auto max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8">
          <h1 className="text-xl font-semibold text-zinc-50">Access issue</h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">{kit.message}</p>
        </div>
      </main>
    );
  }

  const tierLabel =
    kit.tier === "pro" ? "Creator Kit (Pro)" : "Starter Kit";

  const documentHref =
    useDevBypass && devTier
      ? `/experiences/${encodeURIComponent(experienceId)}/document?dev_kit_tier=${encodeURIComponent(devTier)}`
      : `/experiences/${encodeURIComponent(experienceId)}/document`;

  return (
    <main className="min-h-dvh bg-zinc-950 px-6 py-16 text-zinc-100">
      <div className="mx-auto max-w-lg rounded-2xl border border-amber-300/30 bg-zinc-900/80 p-8 shadow-lg shadow-amber-500/10">
        <p className="text-xs uppercase tracking-[0.14em] text-amber-200">Delivered</p>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-50">Your kit is ready</h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          You unlocked the <span className="font-medium text-zinc-200">{tierLabel}</span>.
          Open the full interactive HTML below. You can bookmark it for return visits while
          your membership is active.
        </p>
        <a
          href={documentHref}
          className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-amber-300 px-5 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-200"
        >
          Open HTML kit
        </a>
      </div>
    </main>
  );
}
