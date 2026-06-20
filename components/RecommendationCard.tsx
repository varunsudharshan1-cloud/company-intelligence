import SectionCard from "@/components/SectionCard";

export default function RecommendationCard({ recommendation }: { recommendation: string }) {
  return (
    <SectionCard title="Recommendation">
      <p className="text-slate-300 leading-relaxed">{recommendation}</p>
    </SectionCard>
  );
}
