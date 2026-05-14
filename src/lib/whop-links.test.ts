import { describe, expect, it } from "vitest";
import { WHOP_STORE_FALLBACK, resolvePublicWhopUrl } from "./whop-links";

describe("resolvePublicWhopUrl", () => {
  it("uses fallback when env is undefined", () => {
    expect(resolvePublicWhopUrl(undefined)).toBe(WHOP_STORE_FALLBACK);
  });

  it("uses fallback when env is empty or whitespace", () => {
    expect(resolvePublicWhopUrl("")).toBe(WHOP_STORE_FALLBACK);
    expect(resolvePublicWhopUrl("   ")).toBe(WHOP_STORE_FALLBACK);
  });

  it("uses trimmed env value when set", () => {
    const url = "https://whop.com/example/checkout/";
    expect(resolvePublicWhopUrl(`  ${url}  `)).toBe(url);
  });

  it("respects custom fallback", () => {
    expect(resolvePublicWhopUrl(undefined, "https://example.com/")).toBe(
      "https://example.com/",
    );
    expect(resolvePublicWhopUrl("", "https://example.com/")).toBe(
      "https://example.com/",
    );
  });
});
