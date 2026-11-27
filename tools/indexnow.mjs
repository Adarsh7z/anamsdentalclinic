// Tell Bing (and other IndexNow search engines) that the site's pages changed.
// Run after each deploy, from the site folder:  node tools/indexnow.mjs
// Google does not use IndexNow; for Google, submit sitemap.xml in Search Console.
import { readFileSync } from "node:fs";

const KEY = "e51e24f0ead2c13042e72e41f22bb83d";  // must match the file /e51e24f0ead2c13042e72e41f22bb83d.txt on the site
const sitemap = readFileSync(new URL("../sitemap.xml", import.meta.url), "utf8");
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const host = new URL(urls[0]).host;
if (host.endsWith(".pages.dev")) {
  console.log("Note: still on the pages.dev address. This works, but run it again after switching to the real domain.");
}
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key: KEY, keyLocation: `https://${host}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow answered ${res.status} ${res.statusText} for ${urls.length} pages.`);
console.log("200 or 202 means accepted. 403 means the key file is not live yet; deploy first.");
