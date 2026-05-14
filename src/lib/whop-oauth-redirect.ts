/**
 * Validates `next` for Whop OAuth start — only same-site relative paths under /experiences/.
 * Rejects absolute URLs, protocol-relative URLs, and path traversal.
 */
export function isAllowedWhopOAuthNextPath(next: string | null | undefined): boolean {
  if (next == null || next === "") return false;
  const trimmed = next.trim();
  if (!trimmed.startsWith("/")) return false;
  if (trimmed.startsWith("//")) return false;
  if (trimmed.includes("://")) return false;
  if (trimmed.includes("\0") || trimmed.includes("\\")) return false;
  const pathOnly = trimmed.split("?")[0]?.split("#")[0] ?? "";
  if (!pathOnly.startsWith("/experiences/")) return false;
  const segments = pathOnly.split("/").filter(Boolean);
  if (segments.length < 2) return false;
  if (segments[0] !== "experiences") return false;
  if (segments.some((s) => s === ".." || s === ".")) return false;
  return true;
}
