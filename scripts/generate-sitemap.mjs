import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const SITE = "https://www.matchupgg.com";
const API = "https://matchupgg-api.vercel.app/api/matchup-pages";

const STATIC_URLS = [
  { loc: "/", changefreq: "weekly", priority: "1.0" },
  { loc: "/pricing", changefreq: "weekly", priority: "0.8" },
  { loc: "/matchups", changefreq: "weekly", priority: "0.7" },
  { loc: "/coach", changefreq: "monthly", priority: "0.5" },
  { loc: "/contact", changefreq: "monthly", priority: "0.3" },
  { loc: "/privacy", changefreq: "yearly", priority: "0.2" },
];

/**
 * Pulls the current /matchups slugs from the live backend so every SEO page
 * lands in the sitemap without hand-editing this file. Falls back to just
 * the static pages if the backend is unreachable at build time — a slightly
 * stale sitemap is fine, a failed deploy is not.
 */
async function fetchMatchupSlugs() {
  try {
    const res = await fetch(API, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const items = await res.json();
    return Array.isArray(items) ? items.map((i) => i.slug).filter(Boolean) : [];
  } catch (err) {
    console.warn(`[sitemap] Could not fetch matchup pages, generating without them: ${err.message}`);
    return [];
  }
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

const slugs = await fetchMatchupSlugs();

const entries = [
  ...STATIC_URLS.map((u) => xmlEntry(u.loc, u)),
  ...slugs.map((slug) => xmlEntry(`/matchups/${slug}`, { changefreq: "monthly", priority: "0.6" })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>\n`;

// Writes into dist/ (post-build), not public/ — the static public/sitemap.xml
// stays checked in as a fallback for anyone running `vite preview` without
// this script, but every real deploy ships the freshly generated one.
const outPath = fileURLToPath(new URL("../dist/sitemap.xml", import.meta.url));
writeFileSync(outPath, xml);
console.log(`[sitemap] Wrote ${STATIC_URLS.length} static + ${slugs.length} matchup URLs to dist/sitemap.xml`);
