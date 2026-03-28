'use client';
import { useEffect } from "react";

const SITE_NAME = "Star-Head";
const SITE_URL  = process.env.NEXT_PUBLIC_SITE_URL ?? "https://star-head.sc";
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

export interface SEOOptions {
  /** Page title — will be rendered as "Title · Star-Head" (or just "Star-Head" if omitted) */
  title?:       string;
  /** Page description (max ~160 chars) */
  description?: string;
  /** Canonical path, e.g. "/ships/42". Full URL is built from VITE_SITE_URL. */
  path?:        string;
  /** Open Graph image URL (absolute). Defaults to /og-image.png */
  image?:       string;
  /** "website" | "article" | "profile". Defaults to "website" */
  ogType?:      string;
  /** Prevent indexing (login, admin, etc.) */
  noindex?:     boolean;
  /** JSON-LD structured data object — injected as <script type="application/ld+json"> */
  jsonLd?:      Record<string, unknown>;
}

const DEFAULT_DESC =
  "Star-Head est la base de données ultime pour Star Citizen : vaisseaux, composants, armures, lieux et blueprints.";

export function useSEO({
  title,
  description = DEFAULT_DESC,
  path,
  image = DEFAULT_IMAGE,
  ogType = "website",
  noindex = false,
  jsonLd,
}: SEOOptions = {}) {
  const fullTitle = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME} — Base de données Star Citizen`;
  const canonicalURL = path ? `${SITE_URL}${path}` : undefined;

  useEffect(() => {
    // ── Title ──────────────────────────────────────────────────────────────
    document.title = fullTitle;

    // Helper to upsert a <meta> tag
    const setMeta = (selector: string, value: string | null) => {
      let el = document.head.querySelector<HTMLMetaElement>(selector);
      if (value == null) { el?.remove(); return; }
      if (!el) {
        el = document.createElement("meta");
        const [attr, val] = selector.replace(/[\[\]]/g, "").split("=");
        el.setAttribute(attr, val.replace(/"/g, ""));
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    };

    // Helper to upsert a <link> tag
    const setLink = (rel: string, href: string | null) => {
      let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
      if (href == null) { el?.remove(); return; }
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
    };

    // ── Meta description ───────────────────────────────────────────────────
    setMeta('meta[name="description"]',          description);

    // ── Robots ────────────────────────────────────────────────────────────
    setMeta('meta[name="robots"]', noindex ? "noindex,nofollow" : "index,follow");

    // ── Open Graph ─────────────────────────────────────────────────────────
    setMeta('meta[property="og:title"]',       fullTitle);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:type"]',        ogType);
    setMeta('meta[property="og:image"]',       image);
    setMeta('meta[property="og:site_name"]',   SITE_NAME);
    if (canonicalURL) setMeta('meta[property="og:url"]', canonicalURL);

    // ── Twitter Card ──────────────────────────────────────────────────────
    setMeta('meta[name="twitter:card"]',        "summary_large_image");
    setMeta('meta[name="twitter:title"]',       fullTitle);
    setMeta('meta[name="twitter:description"]', description);
    setMeta('meta[name="twitter:image"]',       image);

    // ── Canonical ─────────────────────────────────────────────────────────
    setLink("canonical", canonicalURL ?? null);

    // ── JSON-LD ────────────────────────────────────────────────────────────
    const setJsonLd = (data: Record<string, unknown> | undefined) => {
      let el = document.head.querySelector<HTMLScriptElement>('script#ld-json');
      if (!data) { el?.remove(); return; }
      if (!el) {
        el = document.createElement('script');
        el.setAttribute('type', 'application/ld+json');
        el.setAttribute('id', 'ld-json');
        document.head.appendChild(el);
      }
      el.textContent = JSON.stringify(data);
    };
    setJsonLd(jsonLd);

    // ── Cleanup : restore defaults on unmount ──────────────────────────────
    return () => {
      document.title = `${SITE_NAME} — Base de données Star Citizen`;
      setMeta('meta[name="description"]',          DEFAULT_DESC);
      setMeta('meta[name="robots"]',               "index,follow");
      setMeta('meta[property="og:title"]',         `${SITE_NAME} — Base de données Star Citizen`);
      setMeta('meta[property="og:description"]',   DEFAULT_DESC);
      setMeta('meta[property="og:type"]',          "website");
      setMeta('meta[property="og:image"]',         DEFAULT_IMAGE);
      setMeta('meta[property="og:url"]',           null);
      setMeta('meta[name="twitter:title"]',        `${SITE_NAME} — Base de données Star Citizen`);
      setMeta('meta[name="twitter:description"]',  DEFAULT_DESC);
      setMeta('meta[name="twitter:image"]',        DEFAULT_IMAGE);
      setLink("canonical",                         null);
      setJsonLd(undefined);
    };
  }, [fullTitle, description, canonicalURL, image, ogType, noindex, jsonLd]);
}
