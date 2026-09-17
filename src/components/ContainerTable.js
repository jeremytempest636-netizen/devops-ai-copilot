const statusConfig = {
  running: { color: "text-success", dot: "bg-success", label: "Running" },
  warning: { color: "text-warning", dot: "bg-warning", label: "Warning" },
  restarting: { color: "text-danger", dot: "bg-danger", label: "Restarting" },
  stopped: { color: "text-gray-600", dot: "bg-gray-600", label: "Stopped" },
};

export default function ContainerTable({ containers }) {
  return (
    <div className="bg-bgCard border border-borderColor rounded-lg overflow-hidden">
      <div className="px-4 h-11 flex items-center border-b border-borderColor">
        <h3 className="text-[13px] font-medium text-gray-300">Containers</h3>
      </div>

      {containers.length === 0 ? (
        <div className="px-4 py-10 text-center text-[13px] text-gray-600">
          No containers found. Start a container to see it here.
        </div>
      ) : (
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left text-gray-600 border-b border-borderColor">
              <th className="px-4 py-2 font-normal text-[11px]">Name</th>
              <th className="px-4 py-2 font-normal text-[11px]">Status</th>
              <th className="px-4 py-2 font-normal text-[11px]">CPU</th>
              <th className="px-4 py-2 font-normal text-[11px]">Memory</th>
            </tr>
          </thead>
          <tbody>
            {containers.map((c) => {
              const cfg = statusConfig[c.status] || statusConfig.warning;
              return (
                <tr
                  key={c.name}
                  className="border-b border-borderColor last:border-0 hover:bg-white/[0.015]"
                >
                  <td className="px-4 py-2.5 font-mono text-gray-200">{c.name}</td>
                  <td className="px-4 py-2.5">
                    <span className={`flex items-center gap-1.5 ${cfg.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {cfg.label}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-mono text-gray-500">{c.cpu}</td>
                  <td className="px-4 py-2.5 font-mono text-gray-500">{c.memory}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}