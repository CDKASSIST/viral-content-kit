import { readFile } from "node:fs/promises";

const TEMPLATE_PATH =
  "/Users/calvindeklerk/Desktop/CODYS PRODUCTS /viral_content_creator_kit_final.html";

export default async function Home() {
  const html = (await readFile(TEMPLATE_PATH, "utf8")).replace(
    /<button class="btn-gold">Get on Whop<\/button>/g,
    "",
  );

  return (
    <main style={{ width: "100vw", minHeight: "100vh" }}>
      <iframe
        title="Viral Content Creator Kit"
        srcDoc={html}
        style={{
          width: "100%",
          minHeight: "100vh",
          border: "none",
          display: "block",
        }}
      />
    </main>
  );
}
