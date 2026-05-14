import { type NextRequest, NextResponse } from "next/server";
import {
  WHOP_KIT_SESSION_COOKIE,
  signWhopKitSessionJwt,
} from "@/lib/whop-kit-session";
import {
  WHOP_OAUTH_NEXT_COOKIE,
  WHOP_OAUTH_PKCE_VERIFIER_COOKIE,
  WHOP_OAUTH_STATE_COOKIE,
} from "@/lib/whop-oauth-cookies";
import { isAllowedWhopOAuthNextPath } from "@/lib/whop-oauth-redirect";
import { resolvePublicAppBaseUrl } from "@/lib/whop-site-url";

function secureCookie(): boolean {
  return process.env.NODE_ENV === "production";
}

function whopOAuthClientId(): string | null {
  const v =
    process.env.NEXT_PUBLIC_WHOP_APP_ID?.trim() || process.env.WHOP_APP_ID?.trim();
  return v || null;
}

function clearPkceCookies(res: NextResponse): void {
  const clear = { path: "/", maxAge: 0 };
  res.cookies.set(WHOP_OAUTH_PKCE_VERIFIER_COOKIE, "", clear);
  res.cookies.set(WHOP_OAUTH_STATE_COOKIE, "", clear);
  res.cookies.set(WHOP_OAUTH_NEXT_COOKIE, "", clear);
}

export async function GET(request: NextRequest): Promise<Response> {
  const base = resolvePublicAppBaseUrl();
  const clientId = whopOAuthClientId();
  const clientSecret = process.env.WHOP_CLIENT_SECRET?.trim();
  const sessionSecret = process.env.WHOP_KIT_SESSION_SECRET?.trim();

  if (!base || !clientId || !clientSecret || !sessionSecret) {
    return new NextResponse("Whop OAuth callback is not fully configured.", {
      status: 503,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const url = new URL(request.url);
  const err = url.searchParams.get("error");
  if (err) {
    const desc = url.searchParams.get("error_description") ?? "";
    return new NextResponse(`OAuth error: ${err} ${desc}`.trim(), {
      status: 400,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");
  if (!code || !returnedState) {
    return new NextResponse("Missing code or state.", {
      status: 400,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const verifier = request.cookies.get(WHOP_OAUTH_PKCE_VERIFIER_COOKIE)?.value;
  const storedState = request.cookies.get(WHOP_OAUTH_STATE_COOKIE)?.value;
  const nextPath = request.cookies.get(WHOP_OAUTH_NEXT_COOKIE)?.value;

  if (!verifier || !storedState || returnedState !== storedState) {
    return new NextResponse("Invalid OAuth state — try signing in again.", {
      status: 400,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  if (!nextPath || !isAllowedWhopOAuthNextPath(nextPath)) {
    return new NextResponse("Invalid stored redirect path.", {
      status: 400,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const redirectUri = `${base}/api/auth/whop/callback`;

  const tokenRes = await fetch("https://api.whop.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
      code_verifier: verifier,
    }),
  });

  if (!tokenRes.ok) {
    const body = await tokenRes.text();
    return new NextResponse(`Token exchange failed: ${tokenRes.status} ${body}`, {
      status: 502,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const tokens = (await tokenRes.json()) as { access_token?: string };
  const accessToken = tokens.access_token;
  if (!accessToken) {
    return new NextResponse("Token response missing access_token.", {
      status: 502,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const userinfoRes = await fetch("https://api.whop.com/oauth/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!userinfoRes.ok) {
    const body = await userinfoRes.text();
    return new NextResponse(`Userinfo failed: ${userinfoRes.status} ${body}`, {
      status: 502,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const userinfo = (await userinfoRes.json()) as { sub?: string };
  const userId = userinfo.sub;
  if (typeof userId !== "string" || !userId) {
    return new NextResponse("Userinfo missing sub.", {
      status: 502,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const jwt = await signWhopKitSessionJwt(userId, sessionSecret);
  const res = NextResponse.redirect(new URL(nextPath, base).toString(), 302);
  clearPkceCookies(res);
  res.cookies.set(WHOP_KIT_SESSION_COOKIE, jwt, {
    httpOnly: true,
    secure: secureCookie(),
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
