import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LineChart, Line, ReferenceLine, ResponsiveContainer } from "recharts";
import SectionWrapper from "../ui/SectionWrapper.jsx";
import { MX_GREEN, MX_RED, MX_GOLD, AXIS_CLR, GRID_CLR, TOOLTIP_STYLE } from "../../theme.js";
import imgRafa from "../../mundiales/Seleccion-mexicana-Rafa-Marquez.webp";

const H = [
  { año: 1930, ronda: "Grupos",  n: 1, host: false, r: 33, gf: 4,  ga: 13 },
  { año: 1950, ronda: "Grupos",  n: 1, host: false, r: 0,  gf: 2,  ga: 10 },
  { año: 1954, ronda: "Grupos",  n: 1, host: false, r: 0,  gf: 2,  ga: 8  },
  { año: 1958, ronda: "Grupos",  n: 1, host: false, r: 11, gf: 1,  ga: 8  },
  { año: 1962, ronda: "Grupos",  n: 1, host: false, r: 33, gf: 3,  ga: 9  },
  { año: 1966, ronda: "Grupos",  n: 1, host: false, r: 11, gf: 1,  ga: 5  },
  { año: 1970, ronda: "Cuartos", n: 4, host: true,  r: 75, gf: 6,  ga: 4  },
  { año: 1978, ronda: "Grupos",  n: 1, host: false, r: 33, gf: 4,  ga: 8  },
  { año: 1986, ronda: "Cuartos", n: 4, host: true,  r: 67, gf: 7,  ga: 4  },
  { año: 1994, ronda: "Octavos", n: 3, host: false, r: 42, gf: 4,  ga: 4  },
  { año: 1998, ronda: "Octavos", n: 3, host: false, r: 58, gf: 10, ga: 5  },
  { año: 2002, ronda: "Octavos", n: 3, host: false, r: 58, gf: 7,  ga: 3  },
  { año: 2006, ronda: "Octavos", n: 3, host: false, r: 58, gf: 7,  ga: 5  },
  { año: 2010, ronda: "Octavos", n: 3, host: false, r: 67, gf: 8,  ga: 7  },
  { año: 2014, ronda: "Octavos", n: 3, host: false, r: 58, gf: 5,  ga: 5  },
  { año: 2018, ronda: "Octavos", n: 3, host: false, r: 50, gf: 4,  ga: 4  },
  { año: 2022, ronda: "Grupos",  n: 1, host: false, r: 44, gf: 2,  ga: 3  },
];
const fc = (d) => d.host ? MX_GOLD : d.n >= 3 ? "#6b7280" : d.año === 2022 ? MX_RED : "#9ca3af";
export default function S07_MexicoVsHistoria() {
  return (
    <SectionWrapper id="s07" number={7}
      title="México contra su Historia"
      subtitle="En 1970 y 1986 México fue anfitrión único: todos sus partidos, desde el primero hasta el último, fueron en casa. En 2026 es co-anfitrión — y eso es diferente. Los grupos y las primeras rondas eliminatorias son en México, pero si llega a cuartos de final, juega en Estados Unidos. El patrón histórico dice que México solo fue lejos cuando fue local de verdad, en todo el torneo. Esta vez esa protección tiene límite."
      image={imgRafa}>
      <div className="g-2">
        <div className="card">
          <div className="chart-label">
            Ronda alcanzada por Mundial (1=Grupos → 4=Cuartos)
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={H} margin={{ top: 0, right: 8, left: -20, bottom: 20 }}>
              <CartesianGrid vertical={false} stroke={GRID_CLR} strokeDasharray="3 3" />
              <XAxis dataKey="año" tick={{ fill: AXIS_CLR, fontSize: 9 }} angle={-45} textAnchor="end" interval={0} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4]} tickFormatter={(v) => ["", "Grupos", "", "Octavos", "Cuartos"][v]}
                tick={{ fill: "#555", fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v, n, p) => [p.payload.ronda, "Ronda"]} />
              <ReferenceLine y={3} stroke={MX_RED} strokeDasharray="4 2" opacity={0.5}
                label={{ value: "techo histórico", fill: MX_RED, fontSize: 9, position: "insideTopRight" }} />
              <Bar dataKey="n" radius={[2,2,0,0]} maxBarSize={24}>
                {H.map((d, i) => <Cell key={i} fill={fc(d)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 6 }}>
            {[[MX_GOLD, "Sede"], ["#6b7280", "Octavos+"], [MX_RED, "Qatar 2022"], ["#9ca3af", "Grupos"]].map(([c, l]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#888" }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: c, display: "inline-block" }} />
                {l}
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="chart-label">
            Rendimiento general (% puntos posibles)
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={H} margin={{ top: 8, right: 12, left: -20, bottom: 20 }}>
              <CartesianGrid stroke={GRID_CLR} vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="año" tick={{ fill: AXIS_CLR, fontSize: 9 }} angle={-45} textAnchor="end" interval={0} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#555", fontSize: 9 }} unit="%" axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`${v}%`, "Rendimiento"]} />
              <Line dataKey="r" stroke={MX_GREEN} strokeWidth={2}
                dot={(p) => <circle key={p.key} cx={p.cx} cy={p.cy} r={p.payload.host ? 5 : 3}
                  fill={p.payload.host ? MX_GOLD : MX_GREEN} stroke="#fff" strokeWidth={1.5} />}
                type="monotone" />
            </LineChart>
          </ResponsiveContainer>
          <div className="g-2" style={{ marginTop: 12 }}>
            {[["4.20", "ronda prom. como sede", MX_GOLD], ["2.75", "ronda prom. fuera 1994-2018", "#9ca3af"]].map(([v, l, c]) => (
              <div key={l} style={{ border: `1px solid ${c}40`, borderRadius: 3, padding: "8px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: c }}>{v}</div>
                <div style={{ fontSize: 10, color: "#888", lineHeight: 1.4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
</SectionWrapper>
  );
}
