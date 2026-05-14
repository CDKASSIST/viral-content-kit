/** Default store when `NEXT_PUBLIC_WHOP_*` are unset or blank in `.env.local`. */
export const WHOP_STORE_FALLBACK = "https://whop.com/codybnxthehond/";

export function resolvePublicWhopUrl(
  envValue: string | undefined,
  fallback: string = WHOP_STORE_FALLBACK,
): string {
  const trimmed = envValue?.trim();
  return trimmed || fallback;
}
