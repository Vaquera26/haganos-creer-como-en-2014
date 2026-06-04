export default function BarH({ label, value, max = 100, color = "green", suffix = "%", sublabel, bold }) {
  const pct = Math.round((value / max) * 100);
  const colors = {
    green:  "bg-mx-green",
    red:    "bg-mx-red",
    gold:   "bg-mx-gold",
    gray:   "bg-zinc-500",
    blue:   "bg-blue-600",
  };
  const barColor = colors[color] ?? "bg-mx-green";

  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1">
        <span className={`text-sm ${bold ? "font-bold text-white" : "text-gray-300"}`}>{label}</span>
        <span className={`text-sm font-bold ${color === "green" ? "text-mx-green" : color === "gold" ? "text-mx-gold" : color === "red" ? "text-mx-red" : "text-gray-400"}`}>
          {value}{suffix}
        </span>
      </div>
      {sublabel && <p className="text-xs text-gray-500 mb-1">{sublabel}</p>}
      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
