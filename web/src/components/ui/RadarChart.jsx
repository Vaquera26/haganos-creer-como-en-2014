export default function RadarChart({ datasets, labels, size = 260, max = 10 }) {
  const n = labels.length;
  const cx = size / 2;
  const cy = size / 2;
  const r  = size * 0.36;

  const angle = (i) => (i / n) * 2 * Math.PI - Math.PI / 2;
  const pt    = (i, val) => {
    const a = angle(i);
    const rv = (val / max) * r;
    return { x: cx + rv * Math.cos(a), y: cy + rv * Math.sin(a) };
  };
  const label_pt = (i) => {
    const a = angle(i);
    return { x: cx + (r * 1.28) * Math.cos(a), y: cy + (r * 1.28) * Math.sin(a) };
  };

  const rings = [0.25, 0.5, 0.75, 1.0];

  return (
    <svg width={size} height={size} className="overflow-visible">
      {/* rings */}
      {rings.map((f) => {
        const pts = Array.from({ length: n }, (_, i) => {
          const a = angle(i);
          return `${cx + r * f * Math.cos(a)},${cy + r * f * Math.sin(a)}`;
        }).join(" ");
        return (
          <polygon key={f} points={pts} fill="none" stroke="#1a2b1c" strokeWidth="1" />
        );
      })}

      {/* axes */}
      {Array.from({ length: n }, (_, i) => {
        const end = pt(i, max);
        return (
          <line key={i} x1={cx} y1={cy} x2={end.x} y2={end.y}
            stroke="#1a2b1c" strokeWidth="1" />
        );
      })}

      {/* datasets */}
      {datasets.map(({ values, color, opacity = 0.2, strokeWidth = 2 }) => {
        const pts = values.map((v, i) => {
          const p = pt(i, v);
          return `${p.x},${p.y}`;
        }).join(" ");
        return (
          <g key={color}>
            <polygon points={pts} fill={color} fillOpacity={opacity} stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" />
          </g>
        );
      })}

      {/* labels */}
      {labels.map((label, i) => {
        const lp = label_pt(i);
        const parts = label.split("\n");
        return (
          <text key={i} x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle"
            fill="#9ca3af" fontSize="9.5" fontFamily="Inter, sans-serif">
            {parts.map((p, j) => (
              <tspan key={j} x={lp.x} dy={j === 0 ? "0" : "12"}>{p}</tspan>
            ))}
          </text>
        );
      })}
    </svg>
  );
}
