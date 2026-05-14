/**
 * Public site origin for links shown to customers (e.g. “open your kit after Whop”).
 * Prefer NEXT_PUBLIC_APP_URL; on Vercel you can omit it and rely on VERCEL_URL at runtime.
 */
export function resolvePublicAppBaseUrl(): string | null {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicit) {
    try {
      const u = new URL(explicit);
      return `${u.protocol}//${u.host}`;
    } catch {
      return null;
    }
  }
  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "").replace(/\/$/, "");
    return `https://${host}`;
  }
  return null;
}

export function whopKitAppPath(experienceId: string): string {
  return `/experiences/${encodeURIComponent(experienceId)}`;
}

export function resolveWhopKitAppUrl(experienceId: string): string | null {
  const base = resolvePublicAppBaseUrl();
  if (!base || !experienceId.trim()) return null;
  return `${base}${whopKitAppPath(experienceId.trim())}`;
}
