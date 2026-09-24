import { writeFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const SITE = "https://www.matchupgg.com";
const API_BASE = "https://matchupgg-api.vercel.app/api";

// Same list the prerender step renders to static HTML — the indexable pages
// with real, original text. Champion pages (Riot's Data Dragon text,
// noindexed) and the Coach placeholder are intentionally absent.
const ssrEntry = fileURLToPath(new URL("../dist-ssr/entry-server.js", import.meta.url));
const { PRERENDER_ROUTES } = await import(pathToFileURL(ssrEntry).href);

const PRIORITY = { "/": "1.0", "/modo-solo": "0.8", "/pricing": "0.8", "/guias": "0.8", "/glossario": "0.7" };

async function fetchMatchupSlugs() {
  try {
    const res = await fetch(`${API_BASE}/matchup-pages`, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const items = await res.json();
    return Array.isArray(items) ? items.map((i) => i.slug).filter(Boolean) : [];
  } catch (err) {
    console.warn(`[sitemap] Could not fetch matchup pages: ${err.message}`);
    return [];
  }
}

function xmlEntry(loc, priority) {
  return `  <url>\n    <loc>${SITE}${loc}</loc>\n    <priority>${priority}</priority>\n  </url>`;
}

const matchupSlugs = await fetchMatchupSlugs();

const entries = [
  ...PRERENDER_ROUTES.map((route) => xmlEntry(route, PRIORITY[route] ?? "0.6")),
  // The /matchups hub is noindexed while empty, so it's only listed once
  // there are generated pages behind it.
  ...(matchupSlugs.length ? [xmlEntry("/matchups", "0.6")] : []),
  ...matchupSlugs.map((slug) => xmlEntry(`/matchups/${slug}`, "0.5")),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;

writeFileSync(fileURLToPath(new URL("../dist/sitemap.xml", import.meta.url)), xml);
console.log(`[sitemap] Wrote ${PRERENDER_ROUTES.length} prerendered + ${matchupSlugs.length} matchup URLs to dist/sitemap.xml`);
