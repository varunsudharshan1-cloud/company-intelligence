import type { CompetitorEntry } from "@/types";
import SectionCard from "@/components/SectionCard";

export default function CompetitorCard({ competitors }: { competitors: CompetitorEntry[] }) {
  return (
    <SectionCard title="Competitors">
      <div className="grid sm:grid-cols-2 gap-3">
        {competitors.map((c) => (
          <div key={c.name} className="border border-border rounded-lg p-4 bg-bg/40">
            <p className="font-medium text-slate-100">{c.name}</p>
            <p className="text-sm text-muted mt-1">{c.description}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
