/**
 * Fetches the real, live website and extracts whatever genuine metadata is
 * present in its HTML (title, meta description, Open Graph tags, etc).
 * This is real data scraped from the actual site — not generated or guessed.
 *
 * No AI APIs are used here; this is a plain HTTP fetch + regex-based HTML
 * metadata extraction, which is free and requires no API key.
 */

export interface ScrapedSiteData {
  title: string | null;
  metaDescription: string | null;
  ogSiteName: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  fetchSucceeded: boolean;
}

function extractTag(html: string, regex: RegExp): string | null {
  const match = html.match(regex);
  if (!match || !match[1]) return null;
  return decodeHtmlEntities(match[1].trim());
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/**
 * Attempts to fetch the given URL and pull out real <title>, meta description,
 * and Open Graph tags from the raw HTML. Returns fetchSucceeded: false if the
 * site could not be reached or blocked the request (common for many sites),
 * in which case all fields will be null and callers must clearly label the
 * report as lacking live data rather than fabricating it.
 */
export async function scrapeWebsiteMetadata(url: string): Promise<ScrapedSiteData> {
  const empty: ScrapedSiteData = {
    title: null,
    metaDescription: null,
    ogSiteName: null,
    ogDescription: null,
    ogImage: null,
    fetchSucceeded: false,
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; CompanyIntelligenceAgent/1.0; +https://example.com/bot)",
      },
      redirect: "follow",
    });

    clearTimeout(timeout);

    if (!res.ok) {
      return empty;
    }

    const html = await res.text();

    const title = extractTag(html, /<title[^>]*>([^<]*)<\/title>/i);
    const metaDescription = extractTag(
      html,
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i
    );
    const ogSiteName = extractTag(
      html,
      /<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']*)["']/i
    );
    const ogDescription = extractTag(
      html,
      /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i
    );
    const ogImage = extractTag(
      html,
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["']/i
    );

    return {
      title,
      metaDescription,
      ogSiteName,
      ogDescription,
      ogImage,
      fetchSucceeded: true,
    };
  } catch {
    return empty;
  }
}
