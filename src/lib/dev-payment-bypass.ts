/**
 * Local-only payment bypass for testing post-purchase flows without Whop checkout.
 * Never enable in production builds.
 */
export function isDevPaymentBypassBuildtime(): boolean {
  return (
    process.env.NEXT_PUBLIC_DEV_BYPASS_PAYMENT === "true" &&
    process.env.NODE_ENV !== "production"
  );
}

export type DevKitBypassTier = "starter" | "pro";

export function parseDevKitBypassTier(
  value: string | string[] | undefined,
): DevKitBypassTier | null {
  if (typeof value !== "string") return null;
  if (value === "starter" || value === "pro") return value;
  return null;
}
