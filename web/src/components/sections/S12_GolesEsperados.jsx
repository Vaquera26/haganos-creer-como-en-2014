import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";
import SectionWrapper from "../ui/SectionWrapper.jsx";
import Flag from "../ui/Flag.jsx";
import { MX_GREEN, MX_RED, MX_GOLD, AXIS_CLR, GRID_CLR, TOOLTIP_STYLE } from "../../theme.js";

const PARTIDOS = [
  { rival: "Sudáfrica", f: "za", fecha: "11 Jun", xgMx: 1.45, xgRiv: 0.99, pG: 47.5, pE: 26.6, pP: 25.9,
    m: [{ s: "1-0", p: 12.7, t: "G" }, { s: "1-1", p: 12.6, t: "E" }, { s: "2-1", p: 9.0, t: "G" }, { s: "2-0", p: 8.1, t: "G" }, { s: "0-1", p: 7.2, t: "P" }, { s: "0-0", p: 5.4, t: "E" }] },
  { rival: "Corea del Sur", f: "kr", fecha: "18 Jun", xgMx: 1.27, xgRiv: 1.13, pG: 40.1, pE: 27.2, pP: 32.7,
    m: [{ s: "1-1", p: 12.9, t: "E" }, { s: "1-0", p: 11.6, t: "G" }, { s: "0-1", p: 10.2, t: "P" }, { s: "2-1", p: 8.4, t: "G" }, { s: "1-2", p: 6.8, t: "P" }, { s: "0-0", p: 6.1, t: "E" }] },
  { rival: "Chequia", f: "cz", fecha: "24 Jun", xgMx: 1.35, xgRiv: 1.07, pG: 43.4, pE: 27.3, pP: 29.3,
    m: [{ s: "1-1", p: 12.9, t: "E" }, { s: "1-0", p: 11.8, t: "G" }, { s: "0-1", p: 9.5, t: "P" }, { s: "2-1", p: 9.3, t: "G" }, { s: "2-0", p: 7.2, t: "G" }, { s: "0-0", p: 5.8, t: "E" }] },
];

const mc = (t) => ({ G: MX_GREEN, E: MX_GOLD, P: MX_RED }[t]);
export default function S12_GolesEsperados() {
  return (
    <SectionWrapper id="s12" number={12}
      title="Modelo de Goles Esperados (xG)"
      subtitle="El problema histórico de México no ha sido crear ocasiones — ha sido no convertirlas y regalárselas al rival en los peores momentos. En Brasil 2014 le creó oportunidades claras a Argentina y no las metió. En Rusia 2018 le marcó el gol del siglo a Alemania y luego se cayó completamente ante Brasil. Los xG no mienten sobre la calidad del juego, pero tampoco garantizan nada si el rematador falla.">
      <div className="g-3">
        {PARTIDOS.map((p) => (
          <div key={p.rival} className="card">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <Flag code="mx" className="w-6 h-4 rounded" alt="México" />
              <span style={{ fontSize: 10, color: "#aaa" }}>vs</span>
              <Flag code={p.f} className="w-6 h-4 rounded" alt={p.rival} />
              <div style={{ marginLeft: 4 }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{p.rival}</div>
                <div style={{ fontSize: 10, color: "#888" }}>{p.fecha} · xG {p.xgMx}—{p.xgRiv}</div>
              </div>
            </div>

            {/* barras por marcador */}
            <ResponsiveContainer width="100%" height={190}>
              <BarChart data={p.m} layout="vertical" margin={{ top: 0, right: 36, left: 20, bottom: 0 }}>
                <CartesianGrid horizontal={false} stroke={GRID_CLR} strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fill: AXIS_CLR, fontSize: 9 }} unit="%" axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="s" tick={{ fill: "#444", fontSize: 10, fontWeight: 700 }} width={20} axisLine={false} tickLine={false} />
                <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`${v}%`, "Probabilidad"]} />
                <Bar dataKey="p" radius={[0, 2, 2, 0]}
                  label={{ position: "right", formatter: (v) => `${v}%`, fill: "#888", fontSize: 9 }}>
                  {p.m.map((m, i) => <Cell key={i} fill={mc(m.t)} opacity={0.8} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <div className="g-3" style={{ marginTop: 10 }}>
              {[["Gana", p.pG, MX_GREEN], ["Empata", p.pE, MX_GOLD], ["Pierde", p.pP, MX_RED]].map(([l, v, c]) => (
                <div key={l} style={{ border: "1px solid var(--border-mid)", borderRadius: 3, padding: "5px 3px", textAlign: "center" }}>
                  <div style={{ fontSize: 14, fontWeight: 900, color: c }}>{v}%</div>
                  <div style={{ fontSize: 9, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
</SectionWrapper>
  );
}
