import Whop from "@whop/sdk";

let client: Whop | null = null;

type ResolveWhopUserOptions = {
  /** When true, only honored if `NEXT_PUBLIC_DEV_BYPASS_PAYMENT` is set and this is not a production build. */
  grantDevBypass?: boolean;
};

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

  if (headerSource === null || headerSource === undefined) return null;
  if (typeof headerSource === "string") return null;

  const whop = getWhop();
  const auth = await whop.verifyUserToken(headerSource as Headers, { dontThrow: true });
  if (!auth) return null;
  return { userId: auth.userId };
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
