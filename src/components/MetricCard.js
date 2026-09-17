export default function MetricCard({ label, value, unit = "%" }) {
  const status = value >= 85 ? "danger" : value >= 65 ? "warning" : "success";

  const barColor = {
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
  }[status];

  return (
    <div className="bg-bgCard border border-borderColor rounded-lg p-4 flex-1">
      <span className="text-[12px] text-gray-500">{label}</span>
      <div className="font-mono text-[28px] font-medium leading-none mt-3 mb-4">
        {value}
        <span className="text-[14px] text-gray-500 ml-0.5">{unit}</span>
      </div>
      <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-500`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
}