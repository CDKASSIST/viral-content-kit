"use client";

import { isDevPaymentBypassBuildtime } from "@/lib/dev-payment-bypass";

export default function DevBypassBanner() {
  if (!isDevPaymentBypassBuildtime()) return null;

  return (
    <div
      role="status"
      className="sticky top-0 z-[100] border-b-2 border-dashed border-orange-500 bg-orange-950/95 px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.2em] text-orange-200 shadow-md backdrop-blur-sm"
    >
      DEV MODE — payment bypass active (local testing only)
    </div>
  );
}
