"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import IncidentCard from "@/components/IncidentCard";

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | open | resolved

  async function fetchIncidents() {
    try {
      const res = await fetch("/api/incidents");
      const data = await res.json();
      setIncidents(data);
    } catch (e) {
      console.error("Failed to fetch incidents", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchIncidents();
  }, []);

  async function handleResolve(id) {
    await fetch(`/api/incidents/${id}`, { method: "PATCH" });
    await fetchIncidents();
  }

  const filtered = incidents.filter((i) => {
    if (filter === "all") return true;
    return i.status === filter;
  });

  return (
    <div className="flex bg-bgPrimary min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <Header
          title="Incident History"
          subtitle="All AI-diagnosed incidents, past and present"
        />

        <div className="p-8 space-y-4">
          <div className="flex gap-2">
            {["all", "open", "resolved"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg capitalize transition-colors ${
                  filter === f
                    ? "bg-accent text-white"
                    : "bg-bgCard text-gray-400 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-sm text-gray-500">Loading incidents...</div>
          ) : filtered.length === 0 ? (
            <div className="bg-bgCard border border-borderColor rounded-xl p-8 text-center text-sm text-gray-500">
              No incidents found.
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((incident) => (
                <IncidentCard
                  key={incident.id}
                  incident={incident}
                  onResolve={handleResolve}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}