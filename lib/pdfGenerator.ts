import jsPDF from "jspdf";
import type { CompanyReport } from "@/types";

/**
 * Generates and triggers download of a professional PDF report summarizing
 * the key sections of a CompanyReport, using the free jsPDF library.
 */
export function downloadReportPdf(report: CompanyReport): void {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const marginX = 48;
  let y = 60;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxWidth = pageWidth - marginX * 2;
  const pageHeight = doc.internal.pageSize.getHeight();

  function ensureSpace(lines: number, lineHeight = 16) {
    if (y + lines * lineHeight > pageHeight - 50) {
      doc.addPage();
      y = 60;
    }
  }

  function addHeading(text: string) {
    ensureSpace(2, 24);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(30, 30, 30);
    doc.text(text, marginX, y);
    y += 22;
  }

  function addParagraph(text: string) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(text, maxWidth);
    ensureSpace(lines.length);
    doc.text(lines, marginX, y);
    y += lines.length * 14 + 10;
  }

  function addBulletList(items: string[]) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(60, 60, 60);
    items.forEach((item) => {
      const lines = doc.splitTextToSize(`•  ${item}`, maxWidth);
      ensureSpace(lines.length);
      doc.text(lines, marginX, y);
      y += lines.length * 14 + 2;
    });
    y += 8;
  }

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(20, 20, 20);
  doc.text(`${report.overview.companyName} — Intelligence Report`, marginX, y);
  y += 18;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text(`Generated ${new Date(report.generatedAt).toLocaleString()}`, marginX, y);
  y += 30;

  addHeading("Executive Summary");
  addParagraph(report.executiveSummary);

  addHeading("Company Overview");
  addParagraph(
    `Industry: ${report.overview.industry}   |   Founded: ${report.overview.founded}   |   HQ: ${report.overview.headquarters}   |   Employees: ${report.overview.employees}`
  );

  addHeading("Products & Services");
  addBulletList(report.productsAndServices);

  addHeading("SWOT Analysis — Strengths");
  addBulletList(report.swot.strengths);
  addHeading("SWOT Analysis — Weaknesses");
  addBulletList(report.swot.weaknesses);
  addHeading("SWOT Analysis — Opportunities");
  addBulletList(report.swot.opportunities);
  addHeading("SWOT Analysis — Threats");
  addBulletList(report.swot.threats);

  addHeading("Investment Score");
  addParagraph(`Overall Score: ${report.investmentScore.overallScore} / 100 — ${report.investmentScore.recommendationLabel}`);

  addHeading("Recommendation");
  addParagraph(report.recommendation);

  doc.save(`${report.overview.companyName.replace(/\s+/g, "-")}-Intelligence-Report.pdf`);
}
