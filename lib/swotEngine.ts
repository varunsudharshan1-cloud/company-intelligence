import swotTemplates from "@/data/swotTemplates.json";
import type { Industry, SWOTData } from "@/types";

const templates = swotTemplates as Record<Industry, SWOTData>;

/**
 * Generates SWOT analysis content for a given industry using deterministic
 * templates, personalized lightly with the company name.
 */
export function generateSWOT(industry: Industry, companyName: string): SWOTData {
  const base = templates[industry] ?? templates["General"];

  return {
    strengths: base.strengths.map((s) => s.replace("{company}", companyName)),
    weaknesses: base.weaknesses.map((s) => s.replace("{company}", companyName)),
    opportunities: base.opportunities.map((s) => s.replace("{company}", companyName)),
    threats: base.threats.map((s) => s.replace("{company}", companyName)),
  };
}
