import type { Industry, InvestmentCategoryScore, InvestmentScore } from "@/types";
import { seededInt } from "@/lib/seededRandom";

const INDUSTRY_BASELINE: Record<Industry, number> = {
  Technology: 78,
  Automotive: 68,
  "E-Commerce": 72,
  Entertainment: 66,
  Finance: 74,
  Healthcare: 73,
  Energy: 65,
  Retail: 64,
  Telecommunications: 67,
  General: 62,
};

const CATEGORY_WEIGHTS: Record<InvestmentCategoryScore["category"], number> = {
  "Market Presence": 0.25,
  "Business Stability": 0.2,
  "Growth Potential": 0.25,
  Innovation: 0.2,
  Risk: 0.1,
};

/**
 * Computes a deterministic, rule-based investment score (0-100) for a company
 * based on its industry baseline and domain-derived variance, without calling
 * any external AI service.
 */
export function generateInvestmentScore(domainKey: string, industry: Industry): InvestmentScore {
  const baseline = INDUSTRY_BASELINE[industry] ?? INDUSTRY_BASELINE.General;

  const categoryDefs: Array<{
    category: InvestmentCategoryScore["category"];
    rationale: string;
  }> = [
    {
      category: "Market Presence",
      rationale: "Reflects brand recognition, market share, and reach within the industry.",
    },
    {
      category: "Business Stability",
      rationale: "Reflects revenue diversification and operational maturity.",
    },
    {
      category: "Growth Potential",
      rationale: "Reflects expansion opportunities and addressable market trends.",
    },
    {
      category: "Innovation",
      rationale: "Reflects R&D investment and product development velocity.",
    },
    {
      category: "Risk",
      rationale: "Reflects exposure to regulatory, competitive, and macroeconomic risk factors.",
    },
  ];

  const categories: InvestmentCategoryScore[] = categoryDefs.map((def, idx) => {
    const variance = seededInt(domainKey, -8, 10, idx);
    const score = Math.max(35, Math.min(98, baseline + variance));
    return {
      category: def.category,
      score,
      weight: CATEGORY_WEIGHTS[def.category],
      rationale: def.rationale,
    };
  });

  const weightedSum = categories.reduce((sum, c) => sum + c.score * c.weight, 0);
  const overallScore = Math.round(weightedSum);

  let recommendationLabel: InvestmentScore["recommendationLabel"];
  let recommendationColor: InvestmentScore["recommendationColor"];

  if (overallScore >= 80) {
    recommendationLabel = "Strong Candidate";
    recommendationColor = "green";
  } else if (overallScore >= 60) {
    recommendationLabel = "Moderate Candidate";
    recommendationColor = "amber";
  } else {
    recommendationLabel = "High Risk Candidate";
    recommendationColor = "red";
  }

  return {
    overallScore,
    categories,
    recommendationLabel,
    recommendationColor,
  };
}
