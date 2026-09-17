const severityConfig = {
  LOW: { color: "text-success", bar: "bg-success" },
  MEDIUM: { color: "text-warning", bar: "bg-warning" },
  HIGH: { color: "text-danger", bar: "bg-danger" },
  CRITICAL: { color: "text-critical", bar: "bg-critical" },
};

export default function AIResponse({ diagnosis }) {
  if (!diagnosis) return null;

  const cfg = severityConfig[diagnosis.severity] || severityConfig.MEDIUM;

  return (
    <div className="relative bg-bgCard border border-borderColor rounded-lg pl-5 pr-5 py-5 space-y-4 overflow-hidden">
      <span className={`absolute left-0 top-0 bottom-0 w-1 ${cfg.bar}`} />

      <div className="flex items-center justify-between">
        <h3 className="text-[13px] font-medium text-gray-300">AI Diagnosis</h3>
        <span className={`font-mono text-[11px] font-medium ${cfg.color}`}>
          {diagnosis.severity}
        </span>
      </div>

      <div>
        <p className="text-[11px] text-gray-600 mb-1.5">Problem</p>
        <p className="text-[13px] text-gray-200">{diagnosis.problem}</p>
      </div>

      <div>
        <p className="text-[11px] text-gray-600 mb-1.5">Possible causes</p>
        <ul className="text-[13px] space-y-1">
          {diagnosis.possibleCauses?.map((cause, i) => (
            <li key={i} className="text-gray-400">— {cause}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-[11px] text-gray-600 mb-1.5">Recommended actions</p>
        <ul className="text-[13px] space-y-1">
          {diagnosis.recommendations?.map((rec, i) => (
            <li key={i} className="text-gray-400">— {rec}</li>
          ))}
        </ul>
      </div>

      {diagnosis.commands?.length > 0 && (
        <div>
          <p className="text-[11px] text-gray-600 mb-1.5">Commands</p>
          <div className="bg-black/50 border border-borderColor rounded-md p-3 font-mono text-[12px] space-y-1">
            {diagnosis.commands.map((cmd, i) => (
              <div key={i} className="text-gray-400">
                <span className="text-gray-600">$ </span>
                {cmd}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}