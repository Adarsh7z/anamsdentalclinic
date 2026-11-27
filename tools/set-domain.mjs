// Switch the website to its new domain in one step.
// Usage (from the site folder):  node tools/set-domain.mjs https://www.your-new-domain.in
// It replaces the current address in every .html, .xml and .txt file
// (canonical links, share tags, schema, sitemap, robots.txt, llms.txt).
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const OLD = "https://anamsdentalclinic.pages.dev";
const next = (process.argv[2] || "").replace(/\/+$/, "");
if (!/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}$/i.test(next)) {
  console.error("Give the new address, for example: node tools/set-domain.mjs https://www.example.in");
  process.exit(1);
}
const SKIP = new Set(["node_modules", ".git", "Deploy out", ".wrangler", "index.backup.html"]);
let files = 0, hits = 0;
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if (![".html", ".xml", ".txt"].includes(extname(p))) continue;
    const s = readFileSync(p, "utf8");
    const n = s.split(OLD).length - 1;
    if (n) { writeFileSync(p, s.split(OLD).join(next)); files++; hits += n; }
  }
})(process.cwd());
console.log(`Updated ${hits} links in ${files} files to ${next}.`);
console.log("Next: deploy, then run: node tools/indexnow.mjs");
console.log("");
console.log("IMPORTANT, do not skip (GO-LIVE.md step 2):");
console.log("  Cloudflare blocks AI crawlers by default on new domains.");
console.log("  Dashboard > your domain > Security > Bots (or AI Crawl Control):");
console.log("  set 'Block AI bots' to OFF / Allow, and keep 'Manage robots.txt' OFF.");
console.log("  Otherwise ChatGPT, Claude and Perplexity cannot read the site.");
