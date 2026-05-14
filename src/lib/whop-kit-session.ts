import { SignJWT, jwtVerify } from "jose";

export const WHOP_KIT_SESSION_COOKIE = "whop_kit_session";

function getSecretKey(secret: string): Uint8Array {
  return new TextEncoder().encode(secret);
}

export async function signWhopKitSessionJwt(
  userId: string,
  secret: string,
): Promise<string> {
  const key = getSecretKey(secret);
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(key);
}

export async function verifyWhopKitSessionJwt(
  token: string,
  secret: string,
): Promise<{ userId: string } | null> {
  try {
    const key = getSecretKey(secret);
    const { payload } = await jwtVerify(token, key);
    const sub = payload.sub;
    if (typeof sub !== "string" || sub.length < 3) return null;
    return { userId: sub };
  } catch {
    return null;
  }
}

export function getCookieValueFromHeader(
  cookieHeader: string | null,
  name: string,
): string | null {
  if (!cookieHeader) return null;
  for (const segment of cookieHeader.split(";")) {
    const idx = segment.indexOf("=");
    if (idx === -1) continue;
    const k = segment.slice(0, idx).trim();
    if (k !== name) continue;
    const v = segment.slice(idx + 1).trim();
    try {
      return decodeURIComponent(v);
    } catch {
      return v;
    }
  }
  return null;
}
