import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const ssrEntry = fileURLToPath(new URL("../dist-ssr/entry-server.js", import.meta.url));

const { render, PRERENDER_ROUTES } = await import(pathToFileURL(ssrEntry).href);

const template = readFileSync(`${dist}index.html`, "utf8");

// The untouched template stays the SPA fallback (vercel.json rewrites unknown
// paths to /_spa.html) — dist/index.html itself gets overwritten below with
// the prerendered homepage, and every other route must not inherit that.
writeFileSync(`${dist}_spa.html`, template);

// Tags Helmet emits per route; the template's static defaults for them are
// dropped from prerendered pages so each page has exactly one of each.
const STATIC_HEAD_TAGS = [
  /<title>[\s\S]*?<\/title>\s*/,
  /<meta name="description"[^>]*>\s*/,
  /<meta property="og:title"[^>]*>\s*/,
  /<meta property="og:description"[^>]*>\s*/,
  /<meta property="og:url"[^>]*>\s*/,
  /<meta name="twitter:title"[^>]*>\s*/,
  /<meta name="twitter:description"[^>]*>\s*/,
];

let count = 0;
for (const route of PRERENDER_ROUTES) {
  const { html, head } = render(route);
  let page = template;
  for (const tag of STATIC_HEAD_TAGS) page = page.replace(tag, "");
  page = page.replace("</head>", `${head}\n  </head>`).replace('<div id="root"></div>', `<div id="root">${html}</div>`);

  const outFile = route === "/" ? `${dist}index.html` : `${dist}${route.slice(1)}/index.html`;
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, page);
  count++;
}

console.log(`[prerender] Wrote ${count} static pages`);
