import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("content/kits shipped HTML", () => {
  it("starter kit includes expected title marker", () => {
    const p = path.join(process.cwd(), "content", "kits", "creator-starter.html");
    const html = readFileSync(p, "utf8");
    expect(html).toContain("The Viral Content Starter Kit");
  });

  it("pro kit is valid HTML", () => {
    const p = path.join(process.cwd(), "content", "kits", "creator-pro.html");
    const html = readFileSync(p, "utf8");
    expect(html).toContain("<!DOCTYPE html>");
  });
});
