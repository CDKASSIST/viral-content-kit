import { createHash, randomBytes } from "node:crypto";

function base64url(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export function randomPkceVerifier(): string {
  return base64url(randomBytes(32));
}

export function randomOAuthState(): string {
  return base64url(randomBytes(16));
}

export async function pkceChallengeS256(verifier: string): Promise<string> {
  const hash = createHash("sha256").update(verifier, "utf8").digest();
  return base64url(hash);
}
