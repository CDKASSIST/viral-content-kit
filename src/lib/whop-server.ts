import Whop from "@whop/sdk";
import {
  WHOP_KIT_SESSION_COOKIE,
  getCookieValueFromHeader,
  verifyWhopKitSessionJwt,
} from "@/lib/whop-kit-session";

let client: Whop | null = null;

type ResolveWhopUserOptions = {
  /** When true, only honored if `NEXT_PUBLIC_DEV_BYPASS_PAYMENT` is set and this is not a production build. */
  grantDevBypass?: boolean;
};

function headersFromSource(
  headerSource: string | Headers | Request | null | undefined,
): Headers | null {
  if (headerSource === null || headerSource === undefined) return null;
  if (typeof headerSource === "string") return null;
  if (headerSource instanceof Headers) return headerSource;
  return headerSource.headers;
}

/** Resolves the Whop-authenticated viewer for kit delivery. */
export async function resolveWhopUserForDelivery(
  headerSource: string | Headers | Request | null | undefined,
  options?: ResolveWhopUserOptions,
): Promise<{ userId: string } | null> {
  if (
    process.env.NEXT_PUBLIC_DEV_BYPASS_PAYMENT === "true" &&
    process.env.NODE_ENV !== "production" &&
    options?.grantDevBypass === true
  ) {
    return { userId: "dev_bypass_user" };
  }

  const headers = headersFromSource(headerSource);
  if (!headers) return null;

  const whop = getWhop();
  const auth = await whop.verifyUserToken(headers, { dontThrow: true });
  if (auth) return { userId: auth.userId };

  const sessionSecret = process.env.WHOP_KIT_SESSION_SECRET?.trim();
  if (sessionSecret) {
    const raw = getCookieValueFromHeader(headers.get("cookie"), WHOP_KIT_SESSION_COOKIE);
    if (raw) {
      const session = await verifyWhopKitSessionJwt(raw, sessionSecret);
      if (session) return { userId: session.userId };
    }
  }

  return null;
}

/** Server-side Whop API client (uses `WHOP_API_KEY`, `WHOP_APP_ID`, etc. from the environment). */
export function getWhop(): Whop {
  if (!client) {
    client = new Whop();
  }
  return client;
}

export function whopDeliveryEnvReady(): boolean {
  return Boolean(
    process.env.WHOP_API_KEY?.trim() && process.env.WHOP_APP_ID?.trim(),
  );
}

/** When Whop env is missing, block kit routes unless local payment bypass is active with a tier. */
export function kitDeliveryBlockedUnlessDevBypass(useDevBypass: boolean): boolean {
  if (whopDeliveryEnvReady()) return false;
  if (process.env.NEXT_PUBLIC_DEV_BYPASS_PAYMENT !== "true" || process.env.NODE_ENV === "production") {
    return true;
  }
  return !useDevBypass;
}
