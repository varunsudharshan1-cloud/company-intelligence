import industriesData from "@/data/industries.json";
import type { Industry } from "@/types";

const industryMap = industriesData as Record<string, Industry>;

const KEYWORD_INDUSTRY_HINTS: Array<{ keywords: string[]; industry: Industry }> = [
  { keywords: ["bank", "capital", "invest", "financial", "pay"], industry: "Finance" },
  { keywords: ["health", "pharma", "med", "bio", "care"], industry: "Healthcare" },
  { keywords: ["motors", "auto", "car", "vehicle", "ev"], industry: "Automotive" },
  { keywords: ["energy", "oil", "gas", "solar", "power"], industry: "Energy" },
  { keywords: ["shop", "store", "mart", "retail", "market"], industry: "Retail" },
  { keywords: ["telecom", "mobile", "wireless", "network"], industry: "Telecommunications" },
  { keywords: ["studio", "media", "film", "music", "stream", "play"], industry: "Entertainment" },
  { keywords: ["cloud", "soft", "tech", "data", "app", "ai", "labs", "systems"], industry: "Technology" },
];

/**
 * Determines the industry classification for a given domain key using a
 * deterministic lookup table, falling back to keyword heuristics and
 * finally a general default.
 */
export function classifyIndustry(domainKey: string): Industry {
  const exact = industryMap[domainKey];
  if (exact) return exact;

  const lower = domainKey.toLowerCase();
  for (const hint of KEYWORD_INDUSTRY_HINTS) {
    if (hint.keywords.some((kw) => lower.includes(kw))) {
      return hint.industry;
    }
  }

  return "General";
}
