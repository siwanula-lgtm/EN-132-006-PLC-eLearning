// แปลง infographic SVG → PNG (2x) ด้วยฟอนต์ Prompt จาก @fontsource
// ต้องติดตั้ง playwright ก่อน: npm i -D playwright && npx playwright install chromium
import { chromium } from "playwright";
import { readdir, readFile, mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "../..");
const SVG_DIR = path.join(HERE, "svg");
const OUT_DIR = path.join(ROOT, "public", "images", "infographic");
const FONT_DIR = path.join(ROOT, "node_modules", "@fontsource", "prompt", "files");

const face = (w) =>
  ["thai", "latin"]
    .map(
      (s) =>
        `@font-face{font-family:Prompt;font-weight:${w};src:url("${pathToFileURL(
          path.join(FONT_DIR, `prompt-${s}-${w}-normal.woff2`)
        ).href}") format("woff2");}`
    )
    .join("");

await mkdir(OUT_DIR, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 2 });
const files = (await readdir(SVG_DIR)).filter((f) => f.endsWith(".svg")).sort();
for (const f of files) {
  const svg = await readFile(path.join(SVG_DIR, f), "utf-8");
  const [, w, h] = /width="(\d+)" height="(\d+)"/.exec(svg);
  await page.setViewportSize({ width: Number(w), height: Number(h) });
  await page.setContent(
    `<html><head><style>${[400, 600, 700].map(face).join("")}body{margin:0}</style></head><body>${svg}</body></html>`,
    { waitUntil: "load" }
  );
  await page.evaluate(() => document.fonts.ready);
  await page.locator("svg").screenshot({ path: path.join(OUT_DIR, f.replace(/\.svg$/, ".png")) });
  console.log("✓", f);
}
await browser.close();
