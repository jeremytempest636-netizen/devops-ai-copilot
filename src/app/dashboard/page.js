"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import MetricCard from "@/components/MetricCard";
import ContainerTable from "@/components/ContainerTable";
import AIResponse from "@/components/AIResponse";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    cpu: 0,
    memory: 0,
    disk: 0,
  });

  const [containers, setContainers] = useState([]);
  const [dockerError, setDockerError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [diagnosis, setDiagnosis] = useState(null);
  const [diagnosing, setDiagnosing] = useState(false);

  async function fetchData() {
    try {
      const metricsRes = await fetch("/api/metrics", {
        cache: "no-store",
      });

      if (!metricsRes.ok) {
        throw new Error("Failed to fetch metrics");
      }

      const metricsData = await metricsRes.json();
      setMetrics(metricsData);
    } catch (error) {
      console.error("Metrics fetch failed:", error);
    }

    try {
      const dockerRes = await fetch("/api/docker", {
        cache: "no-store",
      });

      if (!dockerRes.ok) {
        throw new Error("Failed to connect to Docker");
      }

      const dockerData = await dockerRes.json();

      setContainers(dockerData);
      setDockerError(null);
    } catch (error) {
      console.error("Docker fetch failed:", error);

      setDockerError(
        "Failed to connect to Docker. Is Docker Desktop running?"
      );
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchData();

    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const hasProblem = containers.some(
    (container) =>
      container.status === "restarting" ||
      container.status === "warning"
  );

  async function handleDiagnose() {
    setDiagnosing(true);
    setDiagnosis(null);

    try {
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Diagnosis failed");
      }

      const data = await res.json();

      setDiagnosis(data);
    } catch (error) {
      console.error("AI diagnosis failed:", error);

      setDiagnosis({
        severity: "HIGH",
        problem: "Unable to generate AI diagnosis.",
        possibleCauses: [
          "AI API request failed",
          "OpenRouter configuration may be incorrect",
        ],
        recommendations: [
          "Check the OpenRouter API key",
          "Check the AI API route",
          "Check the server console for errors",
        ],
        commands: [],
      });
    } finally {
      setDiagnosing(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-bgPrimary">
      <Sidebar />

      <main className="flex-1">
        <Header
          title="Infrastructure Overview"
          subtitle="Real-time system and container health"
        />

        <div className="space-y-6 p-8">
          {/* Metrics */}
          {loading ? (
            <div className="text-sm text-gray-500">
              Loading metrics...
            </div>
          ) : (
            <div className="flex gap-4">
              <MetricCard
                label="CPU Usage"
                value={metrics.cpu}
              />

              <MetricCard
                label="Memory Usage"
                value={metrics.memory}
              />

              <MetricCard
                label="Disk Usage"
                value={metrics.disk}
              />
            </div>
          )}

          {/* Docker Containers */}
          {dockerError ? (
            <div className="rounded-xl border border-danger/30 bg-bgCard p-5 text-sm text-danger">
              ⚠️ {dockerError}
            </div>
          ) : (
            <ContainerTable containers={containers} />
          )}

          {/* AI Incident Analysis */}
          <div className="rounded-xl border border-borderColor bg-bgCard p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-medium">
                AI Incident Analysis
              </h3>

              {hasProblem && (
                <button
                  onClick={handleDiagnose}
                  disabled={diagnosing}
                  className="rounded-lg bg-accent px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-accent/80 disabled:bg-gray-700"
                >
                  {diagnosing
                    ? "Diagnosing..."
                    : "Diagnose with AI"}
                </button>
              )}
            </div>

            {!hasProblem && !diagnosis && (
              <p className="text-sm text-gray-500">
                No active incidents. AI diagnosis will appear
                here once a container issue is detected.
              </p>
            )}

            {hasProblem && !diagnosis && !diagnosing && (
              <p className="text-sm text-warning">
                ⚠️ Issue detected in one or more containers.
                Click "Diagnose with AI" for a root-cause
                analysis.
              </p>
            )}

            {diagnosing && (
              <p className="text-sm text-gray-500">
                Analyzing infrastructure state with AI...
              </p>
            )}
          </div>

          {/* AI Response */}
          {diagnosis && (
            <AIResponse diagnosis={diagnosis} />
          )}
        </div>
      </main>
    </div>
  );
}