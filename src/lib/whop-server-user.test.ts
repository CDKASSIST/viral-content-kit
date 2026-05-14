import { afterEach, describe, expect, it, vi } from "vitest";
import {
  WHOP_KIT_SESSION_COOKIE,
  signWhopKitSessionJwt,
} from "./whop-kit-session";

const verifyUserToken = vi.hoisted(() =>
  vi.fn<[], Promise<{ userId: string } | null>>(),
);

vi.mock("@whop/sdk", () => ({
  __esModule: true,
  default: class MockWhop {
    verifyUserToken = verifyUserToken;
  },
}));

describe("resolveWhopUserForDelivery", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
    verifyUserToken.mockReset();
  });

  it("prefers iframe verifyUserToken over kit session cookie", async () => {
    vi.stubEnv("WHOP_API_KEY", "k");
    vi.stubEnv("WHOP_APP_ID", "a");
    vi.stubEnv("WHOP_KIT_SESSION_SECRET", "cookie-secret-at-least-32-bytes-long");
    verifyUserToken.mockResolvedValue({ userId: "from_iframe" });
    const { resolveWhopUserForDelivery } = await import("./whop-server");
    const secret = process.env.WHOP_KIT_SESSION_SECRET!;
    const cookie = await signWhopKitSessionJwt("from_cookie", secret);
    const headers = new Headers({
      cookie: `${WHOP_KIT_SESSION_COOKIE}=${encodeURIComponent(cookie)}`,
    });
    const result = await resolveWhopUserForDelivery(headers);
    expect(result?.userId).toBe("from_iframe");
  });

  it("uses kit session cookie when verifyUserToken returns null", async () => {
    vi.stubEnv("WHOP_API_KEY", "k");
    vi.stubEnv("WHOP_APP_ID", "a");
    vi.stubEnv("WHOP_KIT_SESSION_SECRET", "cookie-secret-at-least-32-bytes-long");
    verifyUserToken.mockResolvedValue(null);
    const { resolveWhopUserForDelivery } = await import("./whop-server");
    const secret = process.env.WHOP_KIT_SESSION_SECRET!;
    const cookie = await signWhopKitSessionJwt("user_from_oauth", secret);
    const headers = new Headers({
      cookie: `${WHOP_KIT_SESSION_COOKIE}=${encodeURIComponent(cookie)}`,
    });
    const result = await resolveWhopUserForDelivery(headers);
    expect(result?.userId).toBe("user_from_oauth");
  });
});
