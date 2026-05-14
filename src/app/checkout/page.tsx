import { Suspense } from "react";
import CheckoutEmbedClient from "./CheckoutEmbedClient";
import { resolvePublicAppBaseUrl } from "@/lib/whop-site-url";

export default function CheckoutPage() {
  const base = resolvePublicAppBaseUrl();
  const returnUrl = base ? `${base}/checkout/complete` : null;

  return (
    <Suspense
      fallback={
        <main className="min-h-dvh bg-zinc-950 px-6 py-16 text-zinc-100">
          <div className="mx-auto max-w-xl text-sm text-zinc-500">Loading…</div>
        </main>
      }
    >
      <CheckoutEmbedClient returnUrl={returnUrl} />
    </Suspense>
  );
}
