export default function Header({ title, subtitle }) {
  return (
    <div className="flex items-center justify-between px-8 h-14 border-b border-borderColor">
      <div className="flex items-baseline gap-3">
        <h1 className="text-[15px] font-semibold">{title}</h1>
        {subtitle && (
          <span className="text-[13px] text-gray-500">{subtitle}</span>
        )}
      </div>
      <div className="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center text-[11px] font-medium text-gray-300">
        IT
      </div>
    </div>
  );
}