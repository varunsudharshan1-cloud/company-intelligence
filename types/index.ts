// Core domain types for the Company Intelligence Agent

export type Industry =
  | "Technology"
  | "Automotive"
  | "E-Commerce"
  | "Entertainment"
  | "Finance"
  | "Healthcare"
  | "Energy"
  | "Retail"
  | "Telecommunications"
  | "General";

export interface SWOTData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface CompetitorEntry {
  name: string;
  description: string;
}

export interface InvestmentCategoryScore {
  category:
    | "Market Presence"
    | "Business Stability"
    | "Growth Potential"
    | "Innovation"
    | "Risk";
  score: number; // 0 - 100
  weight: number; // 0 - 1
  rationale: string;
}

export interface InvestmentScore {
  overallScore: number; // 0 - 100
  categories: InvestmentCategoryScore[];
  recommendationLabel: "Strong Candidate" | "Moderate Candidate" | "High Risk Candidate";
  recommendationColor: "green" | "amber" | "red";
}

export interface RiskAssessment {
  level: "Low" | "Moderate" | "Elevated" | "High";
  factors: string[];
}

export interface CompanyOverview {
  companyName: string;
  domain: string;
  industry: Industry;
  founded: string;
  headquarters: string;
  employees: string;
  website: string;
}

export interface BusinessModel {
  summary: string;
  revenueStreams: string[];
  targetMarket: string;
  pricingStrategy: string;
}

export interface Stakeholder {
  role: string;
  description: string;
}

export interface CompanyReport {
  overview: CompanyOverview;
  executiveSummary: string;
  productsAndServices: string[];
  businessModel: BusinessModel;
  stakeholders: Stakeholder[];
  competitors: CompetitorEntry[];
  swot: SWOTData;
  riskAssessment: RiskAssessment;
  investmentScore: InvestmentScore;
  recommendation: string;
  generatedAt: string;
  liveDataFetched: boolean;
  rawSiteDescription: string | null;
}

export interface AnalyzeRequestBody {
  url: string;
}

export interface AnalyzeResponseBody {
  success: boolean;
  data?: CompanyReport;
  error?: string;
}
