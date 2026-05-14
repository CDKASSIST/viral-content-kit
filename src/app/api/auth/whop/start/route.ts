import { NextResponse } from "next/server";
import {
  WHOP_OAUTH_NEXT_COOKIE,
  WHOP_OAUTH_PKCE_MAX_AGE_SEC,
  WHOP_OAUTH_PKCE_VERIFIER_COOKIE,
  WHOP_OAUTH_STATE_COOKIE,
} from "@/lib/whop-oauth-cookies";
import { pkceChallengeS256, randomOAuthState, randomPkceVerifier } from "@/lib/whop-oauth-pkce";
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

export async function GET(request: Request): Promise<Response> {
  const clientId = whopOAuthClientId();
  const base = resolvePublicAppBaseUrl();
  if (!clientId || !base) {
    return new NextResponse("Whop OAuth is not configured (NEXT_PUBLIC_WHOP_APP_ID, NEXT_PUBLIC_APP_URL).", {
      status: 503,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const url = new URL(request.url);
  const nextRaw = url.searchParams.get("next")?.trim() ?? "";
  if (!isAllowedWhopOAuthNextPath(nextRaw)) {
    return new NextResponse(
      "Invalid or missing next parameter. Use a path starting with /experiences/",
      { status: 400, headers: { "content-type": "text/plain; charset=utf-8" } },
    );
  }

  const redirectUri = `${base}/api/auth/whop/callback`;
  const codeVerifier = randomPkceVerifier();
  const state = randomOAuthState();
  const codeChallenge = await pkceChallengeS256(codeVerifier);

  const authorize = new URL("https://api.whop.com/oauth/authorize");
  authorize.searchParams.set("response_type", "code");
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("redirect_uri", redirectUri);
  authorize.searchParams.set("scope", "openid");
  authorize.searchParams.set("state", state);
  authorize.searchParams.set("code_challenge", codeChallenge);
  authorize.searchParams.set("code_challenge_method", "S256");

  const companyId = process.env.WHOP_OAUTH_COMPANY_ID?.trim();
  if (companyId) authorize.searchParams.set("company_id", companyId);

  const res = NextResponse.redirect(authorize.toString(), 302);
  const cookieOpts = {
    httpOnly: true as const,
    secure: secureCookie(),
    sameSite: "lax" as const,
    path: "/",
    maxAge: WHOP_OAUTH_PKCE_MAX_AGE_SEC,
  };
  res.cookies.set(WHOP_OAUTH_PKCE_VERIFIER_COOKIE, codeVerifier, cookieOpts);
  res.cookies.set(WHOP_OAUTH_STATE_COOKIE, state, cookieOpts);
  res.cookies.set(WHOP_OAUTH_NEXT_COOKIE, nextRaw, cookieOpts);
  return res;
}
