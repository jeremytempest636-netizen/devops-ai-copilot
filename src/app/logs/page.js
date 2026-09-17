"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import AIResponse from "@/components/AIResponse";

export default function LogsPage() {
  const [logs, setLogs] = useState("");
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleAnalyze() {
    if (!logs.trim()) return;

    setLoading(true);
    setError(null);
    setDiagnosis(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logs }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Analysis failed");
      }

      const data = await res.json();
      setDiagnosis(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex bg-bgPrimary min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <Header
          title="AI Log Analyzer"
          subtitle="Paste logs to get an AI-powered root cause diagnosis"
        />

        <div className="p-8 space-y-6 max-w-3xl">
          <div className="bg-bgCard border border-borderColor rounded-xl p-5">
            <textarea
              value={logs}
              onChange={(e) => setLogs(e.target.value)}
              placeholder={`2026-09-17 10:32:12 ERROR\nConnection refused 127.0.0.1:5432\n\n2026-09-17 10:32:13 ERROR\nDatabase connection failed`}
              className="w-full h-48 bg-black/40 border border-borderColor rounded-lg p-4 text-sm font-mono text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-accent"
            />

            <button
              onClick={handleAnalyze}
              disabled={loading || !logs.trim()}
              className="mt-4 bg-accent hover:bg-accent/80 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              {loading ? "Analyzing..." : "Analyze with AI"}
            </button>
          </div>

          {error && (
            <div className="bg-danger/10 border border-danger/30 rounded-xl p-4 text-sm text-danger">
              ⚠️ {error}
            </div>
          )}

          <AIResponse diagnosis={diagnosis} />
        </div>
      </main>
    </div>
  );
}