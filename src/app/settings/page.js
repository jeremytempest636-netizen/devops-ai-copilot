"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const REFRESH_KEY = "devops-ai-refresh-interval";

export default function SettingsPage() {
  const [status, setStatus] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(5000);
  const [clearing, setClearing] = useState(false);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    fetch("/api/settings/status")
      .then((res) => res.json())
      .then(setStatus)
      .catch(() => setStatus({ hasApiKey: false, model: "unknown" }));

    const saved = localStorage.getItem(REFRESH_KEY);
    if (saved) setRefreshInterval(Number(saved));
  }, []);

  function handleIntervalChange(value) {
    setRefreshInterval(value);
    localStorage.setItem(REFRESH_KEY, String(value));
  }

  async function handleClearHistory() {
    const confirmed = window.confirm(
      "This will permanently delete all incident history. Continue?"
    );
    if (!confirmed) return;

    setClearing(true);
    try {
      await fetch("/api/incidents", { method: "DELETE" });
      setCleared(true);
      setTimeout(() => setCleared(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setClearing(false);
    }
  }

  return (
    <div className="flex bg-bgPrimary min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <Header title="Settings" subtitle="Configuration and preferences" />

        <div className="p-6 space-y-4 max-w-2xl">
          <div className="bg-bgCard border border-borderColor rounded-lg p-5 space-y-1">
            <h3 className="text-[13px] font-medium text-gray-300 mb-3">AI Configuration</h3>

            <div className="flex items-center justify-between py-3 border-t border-borderColor">
              <div>
                <p className="text-[13px] text-gray-300">OpenRouter API key</p>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  Set via <span className="font-mono">.env.local</span>
                </p>
              </div>
              {status ? (
                <span
                  className={`flex items-center gap-1.5 text-[12px] font-medium ${
                    status.hasApiKey ? "text-success" : "text-danger"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      status.hasApiKey ? "bg-success" : "bg-danger"
                    }`}
                  />
                  {status.hasApiKey ? "Connected" : "Not configured"}
                </span>
              ) : (
                <span className="text-[12px] text-gray-600">Checking...</span>
              )}
            </div>

            <div className="flex items-center justify-between py-3 border-t border-borderColor">
              <p className="text-[13px] text-gray-300">Model</p>
              <span className="font-mono text-[12px] text-gray-400">
                {status?.model || "—"}
              </span>
            </div>
          </div>

          <div className="bg-bgCard border border-borderColor rounded-lg p-5">
            <h3 className="text-[13px] font-medium text-gray-300 mb-3">Monitoring</h3>

            <div className="flex items-center justify-between py-3 border-t border-borderColor">
              <div>
                <p className="text-[13px] text-gray-300">Refresh interval</p>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  How often the dashboard polls system and container data
                </p>
              </div>
              <select
                value={refreshInterval}
                onChange={(e) => handleIntervalChange(Number(e.target.value))}
                className="bg-black/40 border border-borderColor rounded-md text-[13px] text-gray-200 px-3 py-1.5 focus:outline-none focus:border-accent"
              >
                <option value={3000}>3 seconds</option>
                <option value={5000}>5 seconds</option>
                <option value={10000}>10 seconds</option>
                <option value={30000}>30 seconds</option>
              </select>
            </div>
          </div>

          <div className="bg-bgCard border border-borderColor rounded-lg p-5">
            <h3 className="text-[13px] font-medium text-gray-300 mb-3">Data Management</h3>

            <div className="flex items-center justify-between py-3 border-t border-borderColor">
              <div>
                <p className="text-[13px] text-gray-300">Incident history</p>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  Permanently delete all saved incidents
                </p>
              </div>
              <button
                onClick={handleClearHistory}
                disabled={clearing}
                className="bg-danger/10 hover:bg-danger/20 text-danger text-[12px] font-medium px-3 py-1.5 rounded-md transition-colors disabled:opacity-50"
              >
                {clearing ? "Clearing..." : cleared ? "Cleared" : "Clear history"}
              </button>
            </div>
          </div>

          <div className="bg-bgCard border border-borderColor rounded-lg p-5">
            <h3 className="text-[13px] font-medium text-gray-300 mb-3">About</h3>
            <div className="space-y-2 pt-1">
              <div className="flex justify-between text-[12px]">
                <span className="text-gray-600">Version</span>
                <span className="font-mono text-gray-400">0.1.0</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-gray-600">Framework</span>
                <span className="font-mono text-gray-400">Next.js 16</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-gray-600">Container runtime</span>
                <span className="font-mono text-gray-400">Docker Engine API</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}