"use client";

import { useEffect, useMemo, useState } from "react";

export default function AdminPage() {
  const [starterClicks, setStarterClicks] = useState(0);
  const [proClicks, setProClicks] = useState(0);
  const [views, setViews] = useState(0);
  const [purchases, setPurchases] = useState(0);

  useEffect(() => {
    setStarterClicks(Number(localStorage.getItem("starterClicks") ?? 0));
    setProClicks(Number(localStorage.getItem("proClicks") ?? 0));
    setViews(Number(localStorage.getItem("pageViews") ?? 0));
    setPurchases(Number(localStorage.getItem("purchases") ?? 0));
  }, []);

  const totalClicks = starterClicks + proClicks;
  const viewToPurchaseRate = useMemo(() => {
    if (views === 0) return 0;
    return (purchases / views) * 100;
  }, [purchases, views]);

  const handleViewsChange = (value: string) => {
    const next = Number(value) || 0;
    setViews(next);
    localStorage.setItem("pageViews", String(next));
  };

  const handlePurchasesChange = (value: string) => {
    const next = Number(value) || 0;
    setPurchases(next);
    localStorage.setItem("purchases", String(next));
  };

  const resetMetrics = () => {
    localStorage.setItem("starterClicks", "0");
    localStorage.setItem("proClicks", "0");
    localStorage.setItem("pageViews", "0");
    localStorage.setItem("purchases", "0");
    setStarterClicks(0);
    setProClicks(0);
    setViews(0);
    setPurchases(0);
  };

  return (
    <main className="min-h-dvh bg-zinc-950 px-6 py-12 text-zinc-100 sm:px-8">
      <section className="mx-auto w-full max-w-4xl">
        <p className="inline-flex rounded-full border border-zinc-700/80 bg-zinc-900 px-3 py-1 text-xs uppercase tracking-[0.16em] text-zinc-300">
          Admin Panel
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-zinc-50 sm:text-4xl">
          Conversion Dashboard
        </h1>
        <p className="mt-3 text-sm text-zinc-400 sm:text-base">
          Track outbound link clicks and monitor your view-to-purchase conversion rate.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-5">
            <p className="text-sm text-zinc-400">Total link clicks</p>
            <p className="mt-1 text-3xl font-semibold text-zinc-100">{totalClicks}</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-5">
            <p className="text-sm text-zinc-400">Starter clicks</p>
            <p className="mt-1 text-3xl font-semibold text-zinc-100">{starterClicks}</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-5">
            <p className="text-sm text-zinc-400">Pro clicks</p>
            <p className="mt-1 text-3xl font-semibold text-zinc-100">{proClicks}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-zinc-300">
            Total views
            <input
              type="number"
              min={0}
              value={views}
              onChange={(event) => handleViewsChange(event.target.value)}
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none ring-amber-300/50 focus:ring-2"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-zinc-300">
            Total purchases
            <input
              type="number"
              min={0}
              value={purchases}
              onChange={(event) => handlePurchasesChange(event.target.value)}
              className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none ring-amber-300/50 focus:ring-2"
            />
          </label>
        </div>

        <div className="mt-6 rounded-2xl border border-amber-300/30 bg-zinc-900/70 p-6">
          <p className="text-sm text-zinc-300">
            View to purchase rate:{" "}
            <span className="font-semibold text-amber-200">
              {viewToPurchaseRate.toFixed(2)}%
            </span>
          </p>
          <button
            type="button"
            onClick={resetMetrics}
            className="mt-4 rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800"
          >
            Reset metrics
          </button>
        </div>
      </section>
    </main>
  );
}
