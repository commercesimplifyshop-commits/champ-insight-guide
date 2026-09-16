import { Helmet } from "react-helmet-async";

const SITE_URL = "https://www.matchupgg.com";
const SITE_NAME = "MATCHUP.GG";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

interface SeoProps {
  title: string;
  description: string;
  /** Path only, e.g. "/pricing" — joined with SITE_URL. Defaults to "/". */
  path?: string;
  /** Set for pages with no unique public content (auth-gated, admin, 404). */
  noindex?: boolean;
  image?: string;
}

/**
 * Per-route <title>/meta overrides on top of index.html's static defaults.
 * Helmet only patches the DOM after hydration, so index.html's own tags
 * remain the fallback for crawlers that don't execute JS (see llms.txt for
 * that same audience via a plain-text channel instead).
 */
const Seo = ({ title, description, path = "/", noindex = false, image = DEFAULT_IMAGE }: SeoProps) => {
  const url = `${SITE_URL}${path}`;
  const fullTitle = path === "/" ? title : `${title} — ${SITE_NAME}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default Seo;
