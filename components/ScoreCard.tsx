import type { InvestmentScore } from "@/types";
import SectionCard from "@/components/SectionCard";

const COLOR_MAP: Record<InvestmentScore["recommendationColor"], string> = {
  green: "text-emerald-400",
  amber: "text-amber-400",
  red: "text-red-400",
};

export default function ScoreCard({ score }: { score: InvestmentScore }) {
  return (
    <SectionCard title="Investment Score">
      <div className="flex items-end gap-4 mb-6">
        <span className="text-5xl font-semibold text-slate-50">{score.overallScore}</span>
        <span className="text-muted pb-1">/ 100</span>
        <span className={`ml-auto font-medium ${COLOR_MAP[score.recommendationColor]}`}>
          {score.recommendationLabel}
        </span>
      </div>

      <div className="space-y-4">
        {score.categories.map((c) => (
          <div key={c.category}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-300">{c.category}</span>
              <span className="text-muted">{c.score}/100</span>
            </div>
            <div className="h-2 rounded-full bg-bg border border-border overflow-hidden">
              <div
                className="h-full bg-accent rounded-full"
                style={{ width: `${c.score}%` }}
              />
            </div>
            <p className="text-xs text-muted mt-1">{c.rationale}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
