const FEATURES = [
  {
    title: "Company Analysis",
    description: "Automatically extract company identity and generate a structured overview from any website URL.",
    icon: "🏢",
  },
  {
    title: "SWOT Intelligence",
    description: "Deterministic strengths, weaknesses, opportunities, and threats mapped to the company's industry.",
    icon: "📊",
  },
  {
    title: "Investment Scoring",
    description: "Rule-based scoring across market presence, stability, growth, innovation, and risk.",
    icon: "📈",
  },
];

export default function FeatureCards() {
  return (
    <section id="features" className="max-w-5xl mx-auto px-6 py-20">
      <div className="grid sm:grid-cols-3 gap-6">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="bg-card border border-border rounded-xl p-6 hover:border-accent/50 transition-colors"
          >
            <div className="text-2xl mb-4">{f.icon}</div>
            <h3 className="text-slate-100 font-medium mb-2">{f.title}</h3>
            <p className="text-sm text-muted leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
