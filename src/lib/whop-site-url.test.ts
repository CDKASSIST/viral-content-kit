import { describe, expect, it, vi, afterEach } from "vitest";
import { resolvePublicAppBaseUrl, resolveWhopKitAppUrl, whopKitAppPath } from "./whop-site-url";

describe("whop-site-url", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("whopKitAppPath encodes experience id", () => {
    expect(whopKitAppPath("exp_abc")).toBe("/experiences/exp_abc");
  });

  it("resolvePublicAppBaseUrl prefers NEXT_PUBLIC_APP_URL", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://example.com/path/");
    vi.stubEnv("VERCEL_URL", "ignore.vercel.app");
    expect(resolvePublicAppBaseUrl()).toBe("https://example.com");
  });

  it("resolvePublicAppBaseUrl falls back to VERCEL_URL", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "");
    vi.stubEnv("VERCEL_URL", "my-app.vercel.app");
    expect(resolvePublicAppBaseUrl()).toBe("https://my-app.vercel.app");
  });

  it("resolveWhopKitAppUrl returns null without base or id", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "");
    vi.stubEnv("VERCEL_URL", "");
    expect(resolveWhopKitAppUrl("exp_x")).toBe(null);
  });

  it("resolveWhopKitAppUrl joins base and path", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://shop.example");
    expect(resolveWhopKitAppUrl("exp_test")).toBe("https://shop.example/experiences/exp_test");
  });
});
