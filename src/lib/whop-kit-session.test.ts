import { describe, expect, it } from "vitest";
import {
  WHOP_KIT_SESSION_COOKIE,
  getCookieValueFromHeader,
  signWhopKitSessionJwt,
  verifyWhopKitSessionJwt,
} from "./whop-kit-session";

describe("getCookieValueFromHeader", () => {
  it("reads a cookie by name", () => {
    const raw = `foo=bar; ${WHOP_KIT_SESSION_COOKIE}=hello%3Dworld; other=1`;
    expect(getCookieValueFromHeader(raw, WHOP_KIT_SESSION_COOKIE)).toBe("hello=world");
  });

  it("returns null when missing", () => {
    expect(getCookieValueFromHeader(null, WHOP_KIT_SESSION_COOKIE)).toBe(null);
    expect(getCookieValueFromHeader("a=b", WHOP_KIT_SESSION_COOKIE)).toBe(null);
  });
});

describe("signWhopKitSessionJwt / verifyWhopKitSessionJwt", () => {
  it("round-trips user id", async () => {
    const secret = "test-secret-at-least-32-chars-long!!";
    const token = await signWhopKitSessionJwt("user_abc123", secret);
    const out = await verifyWhopKitSessionJwt(token, secret);
    expect(out).toEqual({ userId: "user_abc123" });
  });

  it("rejects wrong secret", async () => {
    const token = await signWhopKitSessionJwt("user_x", "secret-one-is-long-enough-here");
    const out = await verifyWhopKitSessionJwt(token, "different-secret-is-long-enough");
    expect(out).toBe(null);
  });
});
