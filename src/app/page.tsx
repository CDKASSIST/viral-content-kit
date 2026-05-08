"use client";

import ProductCard from "@/components/ProductCard";
import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

const starterWhopLink = "";
const proWhopLink = "";

const starterFeatures = [
  "20 Hooks to break creator's block fast",
  "20 Plug-and-play Scripts you can post today",
  "14-Day Action Plan for consistent output",
];

const proFeatures = [
  "200+ High-performing Hooks across top niches",
  "100 Conversion-focused Scripts for short-form",
  "100 Proven Video Ideas to keep momentum",
  "30-Day Creator Challenge with daily prompts",
  "Monetization Guide to turn views into sales",
];

export default function Home() {
  const [starterClicks, setStarterClicks] = useState(0);
  const [proClicks, setProClicks] = useState(0);

  useEffect(() => {
    const savedStarterClicks = Number(localStorage.getItem("starterClicks") ?? 0);
    const savedProClicks = Number(localStorage.getItem("proClicks") ?? 0);

    setStarterClicks(savedStarterClicks);
    setProClicks(savedProClicks);
  }, []);

  const handleClick = (
    key: "starterClicks" | "proClicks",
    setValue: Dispatch<SetStateAction<number>>,
  ) => {
    setValue((current) => {
      const next = current + 1;
      localStorage.setItem(key, String(next));
      return next;
    });
  };

  return (
    <main className="relative min-h-dvh overflow-hidden bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_transparent_60%)]" />
      <section className="mx-auto w-full max-w-6xl px-6 pb-16 pt-20 sm:px-8 lg:pt-28">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-3xl">
          <p className="mb-4 inline-flex rounded-full border border-zinc-700/80 bg-zinc-900 px-3 py-1 text-xs uppercase tracking-[0.16em] text-zinc-300">
            Viral Content System
          </p>
          <h1 className="text-balance text-4xl font-semibold leading-tight text-zinc-50 sm:text-5xl lg:text-6xl">
            Build a Viral Content Page From Scratch
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-300 sm:text-lg">
            Launch faster with proven short-form hooks, ready-to-use scripts, and a
            roadmap that helps you grow audience and monetize your content with confidence.
          </p>
          <a
            href="#kits"
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-amber-300 px-6 py-3 text-sm font-semibold text-zinc-950 transition-colors duration-200 hover:bg-amber-200"
          >
            Get Started
          </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-xl">
              <p className="text-xs uppercase tracking-[0.14em] text-zinc-400">
                Growth Outcome
              </p>
              <p className="mt-2 text-3xl font-semibold text-zinc-50">3x Faster</p>
              <p className="mt-2 text-sm text-zinc-300">
                Publish consistently with done-for-you hooks, scripts, and weekly plan structure.
              </p>
            </div>
            <div className="rounded-2xl border border-amber-300/40 bg-amber-300/10 p-5 shadow-xl shadow-amber-500/10">
              <p className="text-xs uppercase tracking-[0.14em] text-amber-200">
                Creator Kit Advantage
              </p>
              <p className="mt-2 text-3xl font-semibold text-zinc-50">More Reach</p>
              <p className="mt-2 text-sm text-zinc-200">
                Pro users get high-volume ideas plus monetization guidance to turn views into revenue.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="kits" className="mx-auto w-full max-w-6xl px-6 pb-24 sm:px-8">
        <div className="mb-10 flex flex-col gap-3">
          <h2 className="text-3xl font-semibold text-zinc-50 sm:text-4xl">
            Choose Your Kit
          </h2>
          <p className="max-w-2xl text-sm text-zinc-400 sm:text-base">
            Pick the kit that matches your stage right now. Starter helps you launch
            fast, while Pro gives you the full system to scale and monetize.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
          <ProductCard
            title="Starter Kit"
            description="Best for new creators who want a simple, low-risk starting point to publish consistently and build confidence."
            features={starterFeatures}
            price="$25 USD"
            buttonText="Buy Starter"
            href={starterWhopLink}
            onButtonClick={() => handleClick("starterClicks", setStarterClicks)}
          />

          <ProductCard
            title="Creator Kit (Pro)"
            description="Built for serious creators who want faster growth, more content volume, and a clear monetization path."
            features={proFeatures}
            price="$60 USD"
            buttonText="Get Full Access"
            href={proWhopLink}
            badge="Most Popular"
            highlighted
            onButtonClick={() => handleClick("proClicks", setProClicks)}
          />
        </div>

        <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
          <p className="text-sm text-zinc-300 sm:text-base">
            <span className="font-semibold text-zinc-100">Need the quick version?</span>{" "}
            Starter gets you posting in days.{" "}
            <span className="font-semibold text-amber-200">
              Pro is the better long-term value
            </span>{" "}
            if you want more winning angles, more scripts, and the monetization system
            that helps each post work harder for your business.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-amber-300/30 bg-zinc-900/70 p-6 shadow-lg shadow-amber-500/10">
          <p className="text-xs uppercase tracking-[0.14em] text-amber-200">
            Why creators choose Pro
          </p>
          <p className="mt-2 text-lg font-medium text-zinc-100 sm:text-xl">
            You get the full growth engine: high-volume content assets plus a practical
            monetization framework to grow followers and turn attention into income.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <p className="text-xs uppercase tracking-[0.14em] text-zinc-400">Trust</p>
            <h3 className="mt-2 text-xl font-semibold text-zinc-100">
              Built for real posting consistency
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">
              Both kits are designed to reduce decision fatigue so you can focus on shipping
              content that grows followers and improves conversions.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6">
            <p className="text-xs uppercase tracking-[0.14em] text-zinc-400">FAQ</p>
            <h3 className="mt-2 text-xl font-semibold text-zinc-100">
              One-time payment or subscription?
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">
              Both plans are one-time purchases. Start with Starter for quick momentum, or
              choose Pro if you want full depth, scale, and monetization support from day one.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
