import { describe, expect, it } from "vitest";
import { isAllowedWhopOAuthNextPath } from "./whop-oauth-redirect";

describe("isAllowedWhopOAuthNextPath", () => {
  it("allows /experiences/ paths", () => {
    expect(isAllowedWhopOAuthNextPath("/experiences/exp_test")).toBe(true);
    expect(isAllowedWhopOAuthNextPath("/experiences/exp_test/document")).toBe(true);
  });

  it("rejects non-experience paths", () => {
    expect(isAllowedWhopOAuthNextPath("/checkout")).toBe(false);
    expect(isAllowedWhopOAuthNextPath("/experiences")).toBe(false);
    expect(isAllowedWhopOAuthNextPath("")).toBe(false);
  });

  it("rejects absolute and protocol-relative URLs", () => {
    expect(isAllowedWhopOAuthNextPath("https://evil.com/experiences/x")).toBe(false);
    expect(isAllowedWhopOAuthNextPath("//evil.com/experiences/x")).toBe(false);
  });

  it("rejects traversal segments", () => {
    expect(isAllowedWhopOAuthNextPath("/experiences/../admin")).toBe(false);
    expect(isAllowedWhopOAuthNextPath("/experiences/foo/./bar")).toBe(false);
  });
});
