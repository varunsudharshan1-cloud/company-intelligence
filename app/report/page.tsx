"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { CompanyReport } from "@/types";
import OverviewCard from "@/components/OverviewCard";
import SWOTCard from "@/components/SWOTCard";
import CompetitorCard from "@/components/CompetitorCard";
import ScoreCard from "@/components/ScoreCard";
import RecommendationCard from "@/components/RecommendationCard";
import SectionCard from "@/components/SectionCard";
import { downloadReportPdf } from "@/lib/pdfGenerator";

export default function ReportPage() {
  const [report, setReport] = useState<CompanyReport | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("company-report");
    if (!raw) {
      setNotFound(true);
      return;
    }
    try {
      setReport(JSON.parse(raw) as CompanyReport);
    } catch {
      setNotFound(true);
    }
  }, []);

  if (notFound) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold text-slate-100 mb-3">No report found</h1>
        <p className="text-muted mb-6">Please analyze a company first from the homepage.</p>
        <Link href="/" className="text-accent hover:text-accentHover font-medium">
          ← Back to homepage
        </Link>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center text-muted">
        Loading report…
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted mb-1">Intelligence Report</p>
          <h1 className="text-3xl font-semibold text-slate-50">{report.overview.companyName}</h1>
          <p className="mt-2 text-xs">
            {report.liveDataFetched ? (
              <span className="text-emerald-400">● Live data fetched from {report.overview.domain}</span>
            ) : (
              <span className="text-amber-400">● Could not reach website — showing industry estimates only</span>
            )}
          </p>
        </div>
        <button
          onClick={() => downloadReportPdf(report)}
          className="bg-accent hover:bg-accentHover transition-colors text-white font-medium px-5 py-2.5 rounded-lg whitespace-nowrap"
        >
          Download PDF
        </button>
      </div>

      <SectionCard title="Executive Summary">
        <p className="text-slate-300 leading-relaxed">{report.executiveSummary}</p>
      </SectionCard>

      <OverviewCard overview={report.overview} />

      <SectionCard title="Products & Services">
        <ul className="grid sm:grid-cols-2 gap-2">
          {report.productsAndServices.map((p) => (
            <li key={p} className="text-sm text-slate-300 flex gap-2">
              <span className="text-muted">•</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="Business Model">
        <p className="text-slate-300 leading-relaxed mb-4">{report.businessModel.summary}</p>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted mb-1">Revenue Streams</p>
            <ul className="space-y-1">
              {report.businessModel.revenueStreams.map((r) => (
                <li key={r} className="text-slate-300">• {r}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted mb-1">Target Market</p>
            <p className="text-slate-300">{report.businessModel.targetMarket}</p>
            <p className="text-xs uppercase tracking-wide text-muted mt-3 mb-1">Pricing Strategy</p>
            <p className="text-slate-300">{report.businessModel.pricingStrategy}</p>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Stakeholders">
        <div className="grid sm:grid-cols-2 gap-3">
          {report.stakeholders.map((s) => (
            <div key={s.role} className="border border-border rounded-lg p-4 bg-bg/40">
              <p className="font-medium text-slate-100">{s.role}</p>
              <p className="text-sm text-muted mt-1">{s.description}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <CompetitorCard competitors={report.competitors} />
      <SWOTCard swot={report.swot} />

      <SectionCard title="Risk Assessment">
        <p className="text-slate-100 font-medium mb-3">
          Risk Level: <span className="text-accent">{report.riskAssessment.level}</span>
        </p>
        <ul className="space-y-1.5">
          {report.riskAssessment.factors.map((f) => (
            <li key={f} className="text-sm text-slate-300 flex gap-2">
              <span className="text-muted">•</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      <ScoreCard score={report.investmentScore} />
      <RecommendationCard recommendation={report.recommendation} />

      <div className="flex justify-center pt-4">
        <button
          onClick={() => downloadReportPdf(report)}
          className="bg-accent hover:bg-accentHover transition-colors text-white font-medium px-6 py-3 rounded-lg"
        >
          Download PDF Report
        </button>
      </div>
    </div>
  );
}
