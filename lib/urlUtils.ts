export class InvalidUrlError extends Error {}

/**
 * Validates a raw user-entered string as a usable website URL and normalizes it.
 * Accepts inputs with or without protocol, e.g. "microsoft.com" or "https://www.microsoft.com".
 */
export function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new InvalidUrlError("Please enter a company website URL.");
  }

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  let parsed: URL;
  try {
    parsed = new URL(withProtocol);
  } catch {
    throw new InvalidUrlError("That doesn't look like a valid URL.");
  }

  if (!parsed.hostname.includes(".")) {
    throw new InvalidUrlError("Please enter a full domain, e.g. company.com");
  }

  return parsed.toString();
}

/**
 * Extracts the bare, lowercase, registrable-ish domain key used to look up
 * deterministic company data, e.g. "https://www.microsoft.com/about" -> "microsoft".
 */
export function extractDomainKey(url: string): { domainKey: string; fullDomain: string } {
  const parsed = new URL(url);
  let hostname = parsed.hostname.toLowerCase();

  if (hostname.startsWith("www.")) {
    hostname = hostname.slice(4);
  }

  const parts = hostname.split(".");
  // Take the second-level label as the brand key (handles .com, .co.uk, .ai, etc.)
  const brand = parts.length >= 2 ? parts[parts.length - 2] : parts[0];

  return {
    domainKey: brand,
    fullDomain: hostname,
  };
}

/**
 * Converts a domain key like "microsoft" or "coca-cola" into a display-friendly
 * company name, e.g. "Microsoft", "Coca-Cola".
 */
export function domainKeyToCompanyName(domainKey: string): string {
  return domainKey
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("-");
}
