import { readFile } from "node:fs/promises";
import path from "node:path";

const ALLOWED = new Set(["creator-starter.html", "creator-pro.html"]);

const kitsDir = path.join(process.cwd(), "content", "kits");

function kitPreviewEnabled(): boolean {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_ENABLE_KIT_HTML_PREVIEW === "true"
  );
}

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ filename: string }> },
) {
  if (!kitPreviewEnabled()) {
    return new Response("Not found.", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

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
