import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-border bg-bg/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-accent" />
          <span className="font-semibold text-slate-100 tracking-tight">Company Intelligence Agent</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-muted">
          <a href="#features" className="hover:text-slate-100 transition-colors">
            Features
          </a>
        </nav>
      </div>
    </header>
  );
}
