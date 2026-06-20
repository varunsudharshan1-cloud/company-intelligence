export default function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted">
        <p>© {new Date().getFullYear()} Company Intelligence Agent. Built with Next.js.</p>
        <p>For demonstration and educational purposes only. Not investment advice.</p>
      </div>
    </footer>
  );
}
