import { afterEach, describe, expect, it, vi } from "vitest";
import { parseDevKitBypassTier } from "./dev-payment-bypass";
import { kitDeliveryBlockedUnlessDevBypass, whopDeliveryEnvReady } from "./whop-server";

describe("parseDevKitBypassTier", () => {
  it("accepts starter and pro", () => {
    expect(parseDevKitBypassTier("starter")).toBe("starter");
    expect(parseDevKitBypassTier("pro")).toBe("pro");
  });

  it("rejects invalid values", () => {
    expect(parseDevKitBypassTier(undefined)).toBe(null);
    expect(parseDevKitBypassTier("")).toBe(null);
    expect(parseDevKitBypassTier("other")).toBe(null);
  });
});

describe("kitDeliveryBlockedUnlessDevBypass", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("never blocks when Whop delivery env is ready", () => {
    vi.stubEnv("WHOP_API_KEY", "k");
    vi.stubEnv("WHOP_APP_ID", "a");
    vi.stubEnv("NEXT_PUBLIC_DEV_BYPASS_PAYMENT", "true");
    vi.stubEnv("NODE_ENV", "development");
    expect(whopDeliveryEnvReady()).toBe(true);
    expect(kitDeliveryBlockedUnlessDevBypass(false)).toBe(false);
    expect(kitDeliveryBlockedUnlessDevBypass(true)).toBe(false);
  });

  it("blocks in production when env is missing even if useDevBypass", () => {
    vi.stubEnv("WHOP_API_KEY", "");
    vi.stubEnv("WHOP_APP_ID", "");
    vi.stubEnv("NEXT_PUBLIC_DEV_BYPASS_PAYMENT", "true");
    vi.stubEnv("NODE_ENV", "production");
    expect(kitDeliveryBlockedUnlessDevBypass(true)).toBe(true);
  });

  it("allows dev bypass when keys missing and tier bypass is active", () => {
    vi.stubEnv("WHOP_API_KEY", "");
    vi.stubEnv("WHOP_APP_ID", "");
    vi.stubEnv("NEXT_PUBLIC_DEV_BYPASS_PAYMENT", "true");
    vi.stubEnv("NODE_ENV", "development");
    expect(kitDeliveryBlockedUnlessDevBypass(true)).toBe(false);
    expect(kitDeliveryBlockedUnlessDevBypass(false)).toBe(true);
  });
});
