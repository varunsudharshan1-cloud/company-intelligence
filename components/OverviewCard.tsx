import type { CompanyOverview } from "@/types";
import SectionCard from "@/components/SectionCard";

export default function OverviewCard({ overview }: { overview: CompanyOverview }) {
  const rows: Array<[string, string]> = [
    ["Industry", overview.industry],
    ["Founded", overview.founded],
    ["Headquarters", overview.headquarters],
    ["Employees", overview.employees],
    ["Website", overview.website],
  ];

  return (
    <SectionCard title="Company Overview">
      <dl className="grid sm:grid-cols-2 gap-4">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs uppercase tracking-wide text-muted">{label}</dt>
            <dd className="text-slate-100 mt-1 break-words">{value}</dd>
          </div>
        ))}
      </dl>
    </SectionCard>
  );
}
