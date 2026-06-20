import type { SWOTData } from "@/types";
import SectionCard from "@/components/SectionCard";

const QUADRANTS: Array<{ key: keyof SWOTData; label: string; color: string }> = [
  { key: "strengths", label: "Strengths", color: "border-emerald-500/30 bg-emerald-500/5" },
  { key: "weaknesses", label: "Weaknesses", color: "border-red-500/30 bg-red-500/5" },
  { key: "opportunities", label: "Opportunities", color: "border-indigo-500/30 bg-indigo-500/5" },
  { key: "threats", label: "Threats", color: "border-amber-500/30 bg-amber-500/5" },
];

export default function SWOTCard({ swot }: { swot: SWOTData }) {
  return (
    <SectionCard title="SWOT Analysis">
      <div className="grid sm:grid-cols-2 gap-4">
        {QUADRANTS.map((q) => (
          <div key={q.key} className={`rounded-lg border p-4 ${q.color}`}>
            <h3 className="text-sm font-medium text-slate-100 mb-2">{q.label}</h3>
            <ul className="space-y-1.5">
              {swot[q.key].map((item, i) => (
                <li key={i} className="text-sm text-slate-300 flex gap-2">
                  <span className="text-muted">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
