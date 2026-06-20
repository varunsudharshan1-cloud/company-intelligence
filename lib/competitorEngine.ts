import competitorsData from "@/data/competitors.json";
import type { CompetitorEntry } from "@/types";

const competitorsMap = competitorsData as Record<string, string[]>;

/**
 * Returns a deterministic list of competitor entries for a given domain key.
 * Falls back to a generic industry-peer set when the company is not in the
 * curated dataset.
 */
export function getCompetitors(domainKey: string, companyName: string): CompetitorEntry[] {
  const names = competitorsMap[domainKey] ?? competitorsMap["default"] ?? [];

  return names.map((name) => ({
    name,
    description: `A recognized competitor to ${companyName} within its core market segment.`,
  }));
}
