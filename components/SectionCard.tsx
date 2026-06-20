export default function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-card border border-border rounded-xl p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-slate-100 mb-4">{title}</h2>
      {children}
    </section>
  );
}
