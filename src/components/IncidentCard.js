"use client";

import { useState } from "react";

const severityColors = {
  LOW: "text-success",
  MEDIUM: "text-warning",
  HIGH: "text-danger",
  CRITICAL: "text-critical",
};

export default function IncidentCard({ incident, onResolve }) {
  const [expanded, setExpanded] = useState(false);
  const [resolving, setResolving] = useState(false);

  const severityColor = severityColors[incident.severity] || "text-gray-500";

  async function handleResolve(e) {
    e.stopPropagation();
    setResolving(true);
    await onResolve(incident.id);
    setResolving(false);
  }

  const formattedDate = new Date(incident.createdAt).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <div className="bg-bgCard border border-borderColor rounded-lg overflow-hidden">
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/[0.02]"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-mono text-[11px] text-gray-600 shrink-0">{incident.id}</span>
          <span className="text-[13px] text-gray-200 truncate">{incident.problem}</span>
        </div>

        <div className="flex items-center gap-3 shrink-0 pl-4">
          <span className="text-[11px] text-gray-600 font-mono hidden sm:inline">
            {formattedDate}
          </span>
          <span className={`font-mono text-[11px] font-medium ${severityColor}`}>
            {incident.severity}
          </span>
          <span
            className={`text-[11px] px-2 py-0.5 rounded ${
              incident.status === "resolved"
                ? "bg-success/10 text-success"
                : "bg-warning/10 text-warning"
            }`}
          >
            {incident.status === "resolved" ? "Resolved" : "Open"}
          </span>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-borderColor space-y-4">
          <div>
            <p className="text-[11px] text-gray-600 mb-1.5">Possible causes</p>
            <ul className="text-[13px] space-y-1">
              {incident.possibleCauses?.map((c, i) => (
                <li key={i} className="text-gray-400">— {c}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] text-gray-600 mb-1.5">Recommended actions</p>
            <ul className="text-[13px] space-y-1">
              {incident.recommendations?.map((r, i) => (
                <li key={i} className="text-gray-400">— {r}</li>
              ))}
            </ul>
          </div>

          {incident.commands?.length > 0 && (
            <div>
              <p className="text-[11px] text-gray-600 mb-1.5">Commands</p>
              <div className="bg-black/50 border border-borderColor rounded-md p-3 font-mono text-[12px] space-y-1">
                {incident.commands.map((cmd, i) => (
                  <div key={i} className="text-gray-400">
                    <span className="text-gray-600">$ </span>
                    {cmd}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-gray-600">
              {incident.source === "auto-detection" ? "Automatic detection" : "Manual log analysis"}
            </span>

            {incident.status !== "resolved" && (
              <button
                onClick={handleResolve}
                disabled={resolving}
                className="bg-success/10 hover:bg-success/20 text-success text-[11px] font-medium px-3 py-1.5 rounded-md transition-colors"
              >
                {resolving ? "Resolving..." : "Mark as resolved"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}