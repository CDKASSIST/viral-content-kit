import Link from "next/link";
import { redirect } from "next/navigation";
import { whopKitAppPath } from "@/lib/whop-site-url";

export const dynamic = "force-dynamic";

export default async function CheckoutCompletePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const status = typeof sp.status === "string" ? sp.status : undefined;
  const experienceId = process.env.NEXT_PUBLIC_WHOP_EXPERIENCE_ID?.trim() ?? "";

  if (status === "success" && experienceId) {
    const next = whopKitAppPath(experienceId);
    redirect(`/api/auth/whop/start?next=${encodeURIComponent(next)}`);
  }

  const failed = status === "error" || status === "failed";

  return (
    <main className="min-h-dvh bg-zinc-950 px-6 py-16 text-zinc-100">
      <div className="mx-auto max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900/80 p-8">
        <h1 className="text-xl font-semibold text-zinc-50">
          {failed ? "Payment did not complete" : "Return from checkout"}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          {failed
            ? "Your payment was cancelled or failed. You can return to checkout and try again."
            : "If you finished paying, use the button below to sign in with Whop and open your kit."}
        </p>
        {experienceId ? (
          <Link
            href={`/api/auth/whop/start?next=${encodeURIComponent(whopKitAppPath(experienceId))}`}
            className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-amber-300 px-5 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-200"
          >
            Continue to sign in
          </Link>
        ) : null}
        <Link
          href="/#kits"
          className="mt-4 inline-flex w-full items-center justify-center text-sm font-medium text-zinc-400 underline-offset-4 hover:text-zinc-200 hover:underline"
        >
          Back to kits
        </Link>
      </div>
    </main>
  );
}
