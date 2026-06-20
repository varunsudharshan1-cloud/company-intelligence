"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UrlForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!url.trim()) {
      setError("Please enter a company website URL.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const json = await res.json();

      if (!json.success) {
        setError(json.error ?? "Unable to analyze that URL.");
        setLoading(false);
        return;
      }

      sessionStorage.setItem("company-report", JSON.stringify(json.data));
      router.push("/report");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 bg-card border border-border rounded-xl p-2"
      >
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Company Website URL"
          className="flex-1 bg-transparent px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-accent hover:bg-accentHover transition-colors text-white font-medium px-6 py-3 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? "Analyzing…" : "Analyze Company"}
        </button>
      </form>
      {error && <p className="mt-3 text-sm text-red-400 text-center">{error}</p>}
    </div>
  );
}
