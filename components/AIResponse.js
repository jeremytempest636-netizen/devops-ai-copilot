const severityConfig = {
  LOW: { color: "text-success", bg: "bg-success/10", border: "border-success/30" },
  MEDIUM: { color: "text-warning", bg: "bg-warning/10", border: "border-warning/30" },
  HIGH: { color: "text-danger", bg: "bg-danger/10", border: "border-danger/30" },
  CRITICAL: { color: "text-danger", bg: "bg-danger/20", border: "border-danger/50" },
};

export default function AIResponse({ diagnosis }) {
  if (!diagnosis) return null;

  const cfg = severityConfig[diagnosis.severity] || severityConfig.MEDIUM;

  return (
    <div className={`border ${cfg.border} ${cfg.bg} rounded-xl p-5 space-y-4`}>
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm">AI Diagnosis</h3>
        <span className={`text-xs font-semibold px-2 py-1 rounded ${cfg.bg} ${cfg.color}`}>
          {diagnosis.severity}
        </span>
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-1">Problem</p>
        <p className="text-sm">{diagnosis.problem}</p>
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-1">Possible Causes</p>
        <ul className="text-sm space-y-1">
          {diagnosis.possibleCauses?.map((cause, i) => (
            <li key={i} className="text-gray-300">• {cause}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-1">Recommended Actions</p>
        <ul className="text-sm space-y-1">
          {diagnosis.recommendations?.map((rec, i) => (
            <li key={i} className="text-gray-300">• {rec}</li>
          ))}
        </ul>
      </div>

      {diagnosis.commands?.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-1">Commands</p>
          <div className="bg-black/40 rounded-lg p-3 font-mono text-xs space-y-1">
            {diagnosis.commands.map((cmd, i) => (
              <div key={i} className="text-gray-300">$ {cmd}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}