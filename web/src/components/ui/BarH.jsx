const COLOR_MAP = {
  green:  "#166534",
  red:    "#991b1b",
  gold:   "#2d6a4f",
  blue:   "#6b7280",
  gray:   "#6b7280",
};

export default function BarH({ label, value, max = 100, color = "green", suffix = "%", sublabel, bold }) {
  const pct = Math.round((value / max) * 100);
  const hex = COLOR_MAP[color] ?? COLOR_MAP.green;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 12, color: bold ? "#111" : "#555", fontWeight: bold ? 700 : 400 }}>{label}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: hex }}>{value}{suffix}</span>
      </div>
      {sublabel && <p style={{ fontSize: 10, color: "#888", marginBottom: 3 }}>{sublabel}</p>}
      <div style={{ height: 6, background: "#ebebeb", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: hex, borderRadius: 3, transition: "width 0.8s ease" }} />
      </div>
    </div>
  );
}
