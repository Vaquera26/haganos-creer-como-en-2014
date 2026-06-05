import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import SectionWrapper from "../ui/SectionWrapper.jsx";
import Flag from "../ui/Flag.jsx";
import { MX_GREEN, MX_RED, MX_GOLD, AXIS_CLR, GRID_CLR, TOOLTIP_STYLE } from "../../theme.js";

const PARTIDOS = [
  { rival: "Sudáfrica", flagCode: "za", rank: 60, fecha: "11 Jun", sede: "Azteca", xgMx: 1.45, xgRiv: 0.99,
    gana: 47.5, empata: 26.6, pierde: 25.9,
    marcadores: [{ m: "1-0", p: 12.7, t: "G" }, { m: "1-1", p: 12.6, t: "E" }, { m: "2-1", p: 9.0, t: "G" }, { m: "0-1", p: 7.2, t: "P" }] },
  { rival: "Corea del Sur", flagCode: "kr", rank: 25, fecha: "18 Jun", sede: "Guadalajara", xgMx: 1.27, xgRiv: 1.13,
    gana: 40.1, empata: 27.2, pierde: 32.7,
    marcadores: [{ m: "1-1", p: 12.9, t: "E" }, { m: "1-0", p: 11.6, t: "G" }, { m: "0-1", p: 10.2, t: "P" }, { m: "2-1", p: 8.4, t: "G" }] },
  { rival: "Chequia", flagCode: "cz", rank: 41, fecha: "24 Jun", sede: "Azteca", xgMx: 1.35, xgRiv: 1.07,
    gana: 43.4, empata: 27.3, pierde: 29.3,
    marcadores: [{ m: "1-1", p: 12.9, t: "E" }, { m: "1-0", p: 11.8, t: "G" }, { m: "0-1", p: 9.5, t: "P" }, { m: "2-1", p: 9.3, t: "G" }] },
];

const CHART_DATA = PARTIDOS.map((p) => ({ rival: p.rival, Gana: p.gana, Empata: p.empata, Pierde: p.pierde }));
const mColor = (t) => ({ G: MX_GREEN, E: MX_GOLD, P: MX_RED }[t]);

export default function S03_ProbabilidadPartido() {
  return (
    <SectionWrapper id="s03" number={3}
      title="Probabilidad por Partido"
      subtitle="El 11 de junio en el Azteca contra Sudáfrica es el partido que no se puede dejar ir — es el que, sobre el papel, más se debe ganar. El 18 en Guadalajara contra Corea del Sur es el que puede definir si México termina primero o segundo, y esa diferencia en el bracket vale mucho. El 24 de vuelta en el Azteca contra Chequia debería ser trámite, pero en el fútbol mexicano los trámites tienen una manera de complicarse.">
      <div className="card">
        <div className="chart-label">
          Distribución de probabilidades por partido (apilado)
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={CHART_DATA} margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke={GRID_CLR} strokeDasharray="3 3" />
            <XAxis dataKey="rival" tick={{ fill: "#444", fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: AXIS_CLR, fontSize: 10 }} axisLine={false} tickLine={false} unit="%" />
            <Tooltip {...TOOLTIP_STYLE} formatter={(v, n) => [`${v}%`, n]} />
            <Legend wrapperStyle={{ fontSize: 11, color: "#555" }} />
            <ReferenceLine y={50} stroke="#ccc" strokeDasharray="4 2" />
            <Bar dataKey="Gana"   stackId="a" fill={MX_GREEN} opacity={0.85} />
            <Bar dataKey="Empata" stackId="a" fill={MX_GOLD}  opacity={0.85} />
            <Bar dataKey="Pierde" stackId="a" fill={MX_RED}   opacity={0.85} radius={[3,3,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 12 }}>
        {PARTIDOS.map((p) => (
          <div key={p.rival} className="card">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Flag code="mx" className="w-7 h-5 rounded" alt="México" />
              <span style={{ fontSize: 10, color: "#aaa" }}>vs</span>
              <Flag code={p.flagCode} className="w-7 h-5 rounded" alt={p.rival} />
              <div style={{ marginLeft: 4 }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{p.rival}</div>
                <div style={{ fontSize: 10, color: "#888" }}>{p.fecha} · FIFA #{p.rank}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 12 }}>
              {[["Gana", p.gana, MX_GREEN], ["Empata", p.empata, MX_GOLD], ["Pierde", p.pierde, MX_RED]].map(([label, val, col]) => (
                <div key={label} style={{ border: "1px solid var(--border-mid)", borderRadius: 4, padding: "6px 4px", textAlign: "center" }}>
                  <div style={{ fontSize: 16, fontWeight: 900, color: col }}>{val}%</div>
                  <div style={{ fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 10, color: "#888", marginBottom: 6 }}>
              xG: <strong style={{ color: MX_GREEN }}>{p.xgMx}</strong> — {p.xgRiv}
            </div>
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {p.marcadores.map((m) => (
                <span key={m.m} style={{
                  fontSize: 10, fontWeight: 700, color: mColor(m.t),
                  border: "1px solid var(--border-mid)",
                  borderRadius: 2, padding: "2px 6px",
                }}>
                  {m.m} <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>{m.p}%</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
</SectionWrapper>
  );
}
