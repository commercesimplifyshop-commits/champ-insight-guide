import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const SITE = "https://www.matchupgg.com";
const API_BASE = "https://matchupgg-api.vercel.app/api";

const STATIC_URLS = [
  { loc: "/", changefreq: "weekly", priority: "1.0" },
  { loc: "/modo-solo", changefreq: "weekly", priority: "0.8" },
  { loc: "/pricing", changefreq: "weekly", priority: "0.8" },
  { loc: "/matchups", changefreq: "weekly", priority: "0.7" },
  { loc: "/campeoes", changefreq: "monthly", priority: "0.7" },
  { loc: "/glossario", changefreq: "monthly", priority: "0.6" },
  { loc: "/coach", changefreq: "monthly", priority: "0.5" },
  { loc: "/contact", changefreq: "monthly", priority: "0.3" },
  { loc: "/privacy", changefreq: "yearly", priority: "0.2" },
];

// Kept in sync by hand with src/data/glossary.ts's slugs — this plain .mjs
// build script can't import that .ts file's array directly without adding a
// transpile step just for this, so the list is duplicated (only the slugs,
// not the content).
const GLOSSARY_SLUGS = [
  "wave-management",
  "power-spike",
  "trading",
  "zoning",
  "roaming",
  "split-push",
  "poke",
  "engage-disengage",
  "vision-control",
  "objective-priority",
  "counter-jungle",
  "snowball",
  "scaling",
  "build-path",
  "last-hitting",
];

async function fetchJson(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[sitemap] Could not fetch ${url}: ${err.message}`);
    return null;
  }
}

/**
 * Pulls the current /matchups slugs and full champion list from the live
 * backend so every SEO page lands in the sitemap without hand-editing this
 * file. Falls back to skipping whichever list is unreachable at build time
 * — a slightly stale/incomplete sitemap is fine, a failed deploy is not.
 */
async function fetchMatchupSlugs() {
  const items = await fetchJson(`${API_BASE}/matchup-pages`);
  return Array.isArray(items) ? items.map((i) => i.slug).filter(Boolean) : [];
}

async function fetchChampionIds() {
  const items = await fetchJson(`${API_BASE}/champions`);
  return Array.isArray(items) ? items.map((c) => c.id?.toLowerCase()).filter(Boolean) : [];
}

function xmlEntry(loc, { changefreq, priority }) {
  return [
    "  <url>",
    `    <loc>${SITE}${loc}</loc>`,
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : null,
    priority ? `    <priority>${priority}</priority>` : null,
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

const [matchupSlugs, championIds] = await Promise.all([fetchMatchupSlugs(), fetchChampionIds()]);

const entries = [
  ...STATIC_URLS.map((u) => xmlEntry(u.loc, u)),
  ...matchupSlugs.map((slug) => xmlEntry(`/matchups/${slug}`, { changefreq: "monthly", priority: "0.6" })),
  ...championIds.map((id) => xmlEntry(`/campeoes/${id}`, { changefreq: "monthly", priority: "0.6" })),
  ...GLOSSARY_SLUGS.map((slug) => xmlEntry(`/glossario/${slug}`, { changefreq: "yearly", priority: "0.5" })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;

// Writes into dist/ (post-build), not public/ — the static public/sitemap.xml
// stays checked in as a fallback for anyone running `vite preview` without
// this script, but every real deploy ships the freshly generated one.
const outPath = fileURLToPath(new URL("../dist/sitemap.xml", import.meta.url));
writeFileSync(outPath, xml);
console.log(
  `[sitemap] Wrote ${STATIC_URLS.length} static + ${matchupSlugs.length} matchup + ${championIds.length} champion + ${GLOSSARY_SLUGS.length} glossary URLs to dist/sitemap.xml`,
);
