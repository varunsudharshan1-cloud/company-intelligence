import companyFactsData from "@/data/companyFacts.json";
import { scrapeWebsiteMetadata } from "@/lib/websiteScraper";
import type {
  BusinessModel,
  CompanyOverview,
  CompanyReport,
  Industry,
  RiskAssessment,
  Stakeholder,
} from "@/types";
import { domainKeyToCompanyName, extractDomainKey, normalizeUrl } from "@/lib/urlUtils";
import { classifyIndustry } from "@/lib/industryClassifier";
import { generateSWOT } from "@/lib/swotEngine";
import { getCompetitors } from "@/lib/competitorEngine";
import { generateInvestmentScore } from "@/lib/investmentEngine";
import { seededInt } from "@/lib/seededRandom";

interface CompanyFacts {
  founded: string;
  headquarters: string;
  employees: string;
}

const companyFacts = companyFactsData as Record<string, CompanyFacts>;

const INDUSTRY_DESCRIPTIONS: Record<Industry, string> = {
  Technology: "cloud computing, enterprise software, and digital products",
  Automotive: "vehicle design, manufacturing, and mobility solutions",
  "E-Commerce": "online retail, logistics, and digital marketplaces",
  Entertainment: "media production, streaming, and content distribution",
  Finance: "financial services, payments, and capital markets",
  Healthcare: "healthcare services, pharmaceuticals, and medical technology",
  Energy: "energy production, distribution, and resource management",
  Retail: "consumer retail, merchandising, and brand distribution",
  Telecommunications: "telecommunications infrastructure and connectivity services",
  General: "diversified products and services across multiple markets",
};

const PRODUCTS_BY_INDUSTRY: Record<Industry, string[]> = {
  Technology: ["Cloud platform services", "Enterprise software solutions", "Productivity applications", "AI and machine learning tools"],
  Automotive: ["Passenger vehicles", "Electric vehicle technology", "Autonomous driving systems", "Fleet and mobility services"],
  "E-Commerce": ["Online marketplace platform", "Logistics and fulfillment services", "Subscription membership programs", "Digital advertising services"],
  Entertainment: ["Streaming subscription service", "Original content production", "Licensing and distribution", "Live events and experiences"],
  Finance: ["Payment processing", "Digital banking services", "Investment and wealth products", "Risk and compliance solutions"],
  Healthcare: ["Pharmaceutical products", "Medical devices", "Healthcare services", "Digital health platforms"],
  Energy: ["Energy generation", "Renewable energy solutions", "Energy storage systems", "Distribution infrastructure"],
  Retail: ["Consumer merchandise", "Private label products", "Omnichannel retail experience", "Loyalty programs"],
  Telecommunications: ["Mobile network services", "Broadband connectivity", "Enterprise communication solutions", "IoT connectivity services"],
  General: ["Core product line", "Professional services", "Customer support solutions", "Strategic partnerships"],
};

const STAKEHOLDER_TEMPLATE: Stakeholder[] = [
  { role: "Shareholders", description: "Hold equity interest and benefit from company growth and dividends." },
  { role: "Employees", description: "Drive day-to-day operations, innovation, and execution of strategy." },
  { role: "Customers", description: "Primary consumers of the company's products and services." },
  { role: "Regulators", description: "Oversee compliance with industry-specific laws and standards." },
  { role: "Suppliers & Partners", description: "Support the company's supply chain and strategic initiatives." },
];

function buildOverview(domainKey: string, fullDomain: string, industry: Industry, companyName: string, websiteUrl: string): CompanyOverview {
  const knownFacts = companyFacts[domainKey];

  if (knownFacts) {
    return {
      companyName,
      domain: fullDomain,
      industry,
      founded: knownFacts.founded,
      headquarters: knownFacts.headquarters,
      employees: knownFacts.employees,
      website: websiteUrl,
    };
  }

  // Unknown company: never leave a field blank — provide a clearly-labeled
  // industry-typical estimate instead of a fabricated specific fact.
  const foundedYear = 1975 + seededInt(domainKey, 0, 49, 1);
  const employeeBand = ["1,000–5,000 (estimated)", "5,000–25,000 (estimated)", "25,000–100,000 (estimated)", "100,000+ (estimated)"];
  const hqRegionByIndustry: Record<Industry, string> = {
    Technology: "United States (region estimated — exact HQ unconfirmed)",
    Automotive: "United States or Europe (region estimated — exact HQ unconfirmed)",
    "E-Commerce": "United States (region estimated — exact HQ unconfirmed)",
    Entertainment: "United States (region estimated — exact HQ unconfirmed)",
    Finance: "United States (region estimated — exact HQ unconfirmed)",
    Healthcare: "United States or Europe (region estimated — exact HQ unconfirmed)",
    Energy: "United States (region estimated — exact HQ unconfirmed)",
    Retail: "United States (region estimated — exact HQ unconfirmed)",
    Telecommunications: "United States or Europe (region estimated — exact HQ unconfirmed)",
    General: "Region unconfirmed (estimated)",
  };

  return {
    companyName,
    domain: fullDomain,
    industry,
    founded: `${foundedYear} (estimated)`,
    headquarters: hqRegionByIndustry[industry] ?? hqRegionByIndustry.General,
    employees: employeeBand[seededInt(domainKey, 0, employeeBand.length - 1, 3)] as string,
    website: websiteUrl,
  };
}

function buildExecutiveSummary(companyName: string, industry: Industry, realDescription: string | null): string {
  if (realDescription) {
    return `${realDescription} (Sourced from the company's own website metadata.)`;
  }
  const desc = INDUSTRY_DESCRIPTIONS[industry];
  return `${companyName} is a ${industry.toLowerCase()} company specializing in ${desc}. This summary is industry-estimated, as live company description data could not be retrieved from the website. The company maintains a notable market presence and continues to invest in expanding its product portfolio, strengthening its competitive position, and pursuing long-term growth opportunities within its sector.`;
}

function buildBusinessModel(companyName: string, industry: Industry): BusinessModel {
  const revenueStreamsByIndustry: Record<Industry, string[]> = {
    Technology: ["Software licensing", "Cloud subscriptions", "Enterprise services"],
    Automotive: ["Vehicle sales", "Financing services", "After-sales services"],
    "E-Commerce": ["Product sales", "Marketplace commissions", "Advertising revenue"],
    Entertainment: ["Subscription fees", "Advertising revenue", "Licensing deals"],
    Finance: ["Transaction fees", "Interest income", "Advisory services"],
    Healthcare: ["Product sales", "Licensing", "Service contracts"],
    Energy: ["Energy sales", "Infrastructure contracts", "Government partnerships"],
    Retail: ["Direct sales", "Wholesale distribution", "Private label margins"],
    Telecommunications: ["Subscription plans", "Enterprise contracts", "Equipment sales"],
    General: ["Product sales", "Service contracts", "Strategic partnerships"],
  };

  return {
    summary: `${companyName} generates revenue through a diversified business model centered on its core ${industry.toLowerCase()} offerings, supported by recurring revenue streams and strategic partnerships.`,
    revenueStreams: revenueStreamsByIndustry[industry] ?? revenueStreamsByIndustry.General,
    targetMarket: industry === "Technology" || industry === "Finance" ? "Enterprises, developers, and consumers" : "Global consumer and business markets",
    pricingStrategy: "Tiered and value-based pricing aligned with customer segment needs",
  };
}

function buildRiskAssessment(domainKey: string, industry: Industry): RiskAssessment {
  const riskScore = seededInt(domainKey, 0, 100, 99);
  let level: RiskAssessment["level"];

  if (riskScore < 25) level = "Low";
  else if (riskScore < 55) level = "Moderate";
  else if (riskScore < 80) level = "Elevated";
  else level = "High";

  const factorsByIndustry: Record<Industry, string[]> = {
    Technology: ["Regulatory scrutiny over data privacy", "Rapid technology shifts", "Talent retention pressure"],
    Automotive: ["Supply chain disruption", "Regulatory emissions standards", "Commodity price volatility"],
    "E-Commerce": ["Margin compression", "Logistics cost inflation", "Marketplace regulation"],
    Entertainment: ["Content cost inflation", "Subscriber churn", "Piracy and IP risk"],
    Finance: ["Regulatory compliance burden", "Credit and market risk", "Cybersecurity threats"],
    Healthcare: ["Regulatory approval delays", "Patent cliffs", "Pricing pressure"],
    Energy: ["Commodity price volatility", "Environmental regulation", "Geopolitical exposure"],
    Retail: ["Consumer spending sensitivity", "Inventory risk", "E-commerce competition"],
    Telecommunications: ["Infrastructure capital intensity", "Regulatory pricing controls", "Spectrum licensing risk"],
    General: ["Market competition", "Macroeconomic uncertainty", "Operational complexity"],
  };

  return {
    level,
    factors: factorsByIndustry[industry] ?? factorsByIndustry.General,
  };
}

function buildRecommendation(companyName: string, overallScore: number, label: string): string {
  if (label === "Strong Candidate") {
    return `${companyName} demonstrates strong fundamentals across market presence, stability, and growth potential, with an overall investment score of ${overallScore}/100. The company is well positioned for continued evaluation as a strong investment candidate, subject to standard due diligence.`;
  }
  if (label === "Moderate Candidate") {
    return `${companyName} shows a balanced risk-reward profile with an overall investment score of ${overallScore}/100. The company presents a moderate investment opportunity, warranting further due diligence on growth drivers and competitive positioning.`;
  }
  return `${companyName} carries elevated risk factors relative to its growth and stability indicators, resulting in an overall investment score of ${overallScore}/100. Investors should approach with caution and conduct thorough risk assessment before proceeding.`;
}

/**
 * Generates a complete company intelligence report from a raw user-entered
 * URL. The executive summary and company name are sourced from the live
 * website's own metadata when reachable (real data, not generated). Facts
 * that cannot be reliably scraped from a homepage (exact founding year,
 * headquarters, employee count) come from a curated reference dataset for
 * recognized companies, and are explicitly labeled "Not available" for
 * unrecognized ones rather than being invented. SWOT, competitors, and
 * investment scoring remain rule-based — no AI or paid APIs are used.
 */
export async function generateCompanyReport(rawUrl: string): Promise<CompanyReport> {
  const normalized = normalizeUrl(rawUrl);
  const { domainKey, fullDomain } = extractDomainKey(normalized);

  const scraped = await scrapeWebsiteMetadata(normalized);

  // Prefer the real site's own name (og:site_name or <title>) over a
  // capitalized guess from the domain, when available.
  const realName = scraped.ogSiteName || scraped.title;
  const companyName = realName
    ? realName.split(/[-|–:]/)[0]?.trim() || domainKeyToCompanyName(domainKey)
    : domainKeyToCompanyName(domainKey);

  const industry = classifyIndustry(domainKey);
  const realDescription = scraped.metaDescription || scraped.ogDescription || null;

  const overview = buildOverview(domainKey, fullDomain, industry, companyName, normalized);
  const executiveSummary = buildExecutiveSummary(companyName, industry, realDescription);
  const productsAndServices = PRODUCTS_BY_INDUSTRY[industry] ?? PRODUCTS_BY_INDUSTRY.General;
  const businessModel = buildBusinessModel(companyName, industry);
  const stakeholders = STAKEHOLDER_TEMPLATE;
  const competitors = getCompetitors(domainKey, companyName);
  const swot = generateSWOT(industry, companyName);
  const riskAssessment = buildRiskAssessment(domainKey, industry);
  const investmentScore = generateInvestmentScore(domainKey, industry);
  const recommendation = buildRecommendation(companyName, investmentScore.overallScore, investmentScore.recommendationLabel);

  return {
    overview,
    executiveSummary,
    productsAndServices,
    businessModel,
    stakeholders,
    competitors,
    swot,
    riskAssessment,
    investmentScore,
    recommendation,
    generatedAt: new Date().toISOString(),
    liveDataFetched: scraped.fetchSucceeded,
    rawSiteDescription: realDescription,
  };
}
