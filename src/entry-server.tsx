import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import type { HelmetServerState } from "react-helmet-async";
import { AppProviders, AppRoutes } from "./App";
import { GLOSSARY } from "./data/glossary";
import { GUIDES } from "./data/guides";

/**
 * Public, indexable routes whose content is available without an API call,
 * rendered to static HTML at build time (scripts/prerender.mjs) so crawlers
 * — AdSense's reviewer included — see real text instead of an empty
 * <div id="root">. Routes that fetch their content client-side (champion,
 * matchup pages) are deliberately left out: they'd prerender as a spinner.
 */
export const PRERENDER_ROUTES = [
  "/",
  "/modo-solo",
  "/pricing",
  "/contact",
  "/privacy",
  "/guias",
  ...GUIDES.map((g) => `/guias/${g.slug}`),
  "/glossario",
  ...GLOSSARY.map((e) => `/glossario/${e.slug}`),
];

export function render(url: string) {
  const helmetContext: { helmet?: HelmetServerState } = {};
  const html = renderToString(
    <AppProviders helmetContext={helmetContext}>
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>
    </AppProviders>,
  );
  const helmet = helmetContext.helmet;
  const head = helmet
    ? [helmet.title.toString(), helmet.meta.toString(), helmet.link.toString()].join("\n")
    : "";
  return { html, head };
}
