"use client";

import { WhopCheckoutEmbed } from "@whop/checkout/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { whopKitAppPath } from "@/lib/whop-site-url";

type CheckoutEmbedClientProps = {
  returnUrl: string | null;
};

function oauthStartHref(nextPath: string): string {
  return `/api/auth/whop/start?next=${encodeURIComponent(nextPath)}`;
}

export default function CheckoutEmbedClient({ returnUrl }: CheckoutEmbedClientProps) {
  const searchParams = useSearchParams();
  const tier = (searchParams.get("tier") ?? "").toLowerCase();

  const planId = useMemo(() => {
    if (tier === "starter") return process.env.NEXT_PUBLIC_WHOP_STARTER_PLAN_ID?.trim() ?? "";
    if (tier === "pro") return process.env.NEXT_PUBLIC_WHOP_PRO_PLAN_ID?.trim() ?? "";
    return "";
  }, [tier]);

  const experienceId = process.env.NEXT_PUBLIC_WHOP_EXPERIENCE_ID?.trim() ?? "";
  const nextPath = experienceId ? whopKitAppPath(experienceId) : "";

  const tierLabel = tier === "pro" ? "Creator Kit (Pro)" : tier === "starter" ? "Starter Kit" : null;

  if (tier !== "starter" && tier !== "pro") {
    return (
      <main className="min-h-dvh max-w-full overflow-x-hidden bg-zinc-950 px-6 py-16 text-zinc-100">
        <div className="mx-auto max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8">
          <h1 className="text-xl font-semibold text-zinc-50">Pick a kit</h1>
          <p className="mt-3 text-sm text-zinc-400">
            Open checkout with <span className="font-mono text-zinc-300">?tier=starter</span> or{" "}
            <span className="font-mono text-zinc-300">?tier=pro</span>.
          </p>
          <Link
            href="/#kits"
            className="mt-6 inline-flex text-sm font-medium text-amber-200 underline-offset-4 hover:underline"
          >
            Back to kits
          </Link>
        </div>
      </main>
    );
  }

  if (!planId) {
    return (
      <main className="min-h-dvh max-w-full overflow-x-hidden bg-zinc-950 px-6 py-16 text-zinc-100">
        <div className="mx-auto max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8">
          <h1 className="text-xl font-semibold text-zinc-50">Checkout not configured</h1>
          <p className="mt-3 text-sm text-zinc-400">
            Set <span className="font-mono text-amber-200/90">NEXT_PUBLIC_WHOP_{tier === "pro" ? "PRO" : "STARTER"}_PLAN_ID</span>{" "}
            for this tier (Whop plan id from your checkout link).
          </p>
          <Link href="/" className="mt-6 inline-flex text-sm font-medium text-amber-200 underline-offset-4 hover:underline">
            Home
          </Link>
        </div>
      </main>
    );
  }

  if (!nextPath) {
    return (
      <main className="min-h-dvh max-w-full overflow-x-hidden bg-zinc-950 px-6 py-16 text-zinc-100">
        <div className="mx-auto max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8">
          <h1 className="text-xl font-semibold text-zinc-50">Experience not configured</h1>
          <p className="mt-3 text-sm text-zinc-400">
            Set <span className="font-mono text-amber-200/90">NEXT_PUBLIC_WHOP_EXPERIENCE_ID</span> so we know where to send you after payment and sign-in.
          </p>
          <Link href="/" className="mt-6 inline-flex text-sm font-medium text-amber-200 underline-offset-4 hover:underline">
            Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh max-w-full overflow-x-hidden bg-zinc-950 px-6 py-12 text-zinc-100 sm:py-16">
      <div className="mx-auto max-w-xl">
        <p className="text-xs uppercase tracking-[0.14em] text-amber-200">Checkout</p>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-50">{tierLabel}</h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          Complete payment below. You will then sign in with Whop once to unlock your kit on this site.
        </p>
        <div className="mt-8 min-h-[480px] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50">
          <WhopCheckoutEmbed
            theme="dark"
            planId={planId}
            returnUrl={returnUrl ?? undefined}
            onComplete={() => {
              window.location.replace(oauthStartHref(nextPath));
            }}
            fallback={
              <div className="flex min-h-[320px] items-center justify-center text-sm text-zinc-500">
                Loading checkout…
              </div>
            }
          />
        </div>
        <Link
          href="/#kits"
          className="mt-8 inline-flex text-sm font-medium text-zinc-400 underline-offset-4 hover:text-zinc-200 hover:underline"
        >
          ← Change kit
        </Link>
      </div>
    </main>
  );
}
