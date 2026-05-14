import { readFile } from "node:fs/promises";
import path from "node:path";

const ALLOWED = new Set(["creator-starter.html", "creator-pro.html"]);

const kitsDir = path.join(process.cwd(), "content", "kits");

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ filename: string }> },
) {
  const { filename } = await context.params;
  if (!ALLOWED.has(filename)) {
    return new Response("Not found.", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const absolutePath = path.join(kitsDir, filename);
  const resolvedKits = path.resolve(kitsDir);
  if (!path.resolve(absolutePath).startsWith(resolvedKits + path.sep)) {
    return new Response("Not found.", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  try {
    const html = await readFile(absolutePath, "utf8");
    return new Response(html, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "private, no-store",
      },
    });
  } catch {
    return new Response("Kit file is missing on the server.", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
}
