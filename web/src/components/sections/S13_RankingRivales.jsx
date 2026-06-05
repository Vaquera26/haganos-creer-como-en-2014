import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";
import SectionWrapper from "../ui/SectionWrapper.jsx";
import Flag from "../ui/Flag.jsx";
import { MX_GREEN, MX_RED, MX_GOLD, AXIS_CLR, GRID_CLR, TOOLTIP_STYLE } from "../../theme.js";

const RIVALES = [
  { r: "Haití",              f: "ht",     rank: 90,  ronda: "R16", p: 86.0 },
  { r: "Qatar",              f: "qa",     rank: 71,  ronda: "R32", p: 83.0 },
  { r: "Bosnia-Herzegovina", f: "ba",     rank: 62,  ronda: "R32", p: 80.5 },
  { r: "Australia",          f: "au",     rank: 31,  ronda: "R16", p: 62.7 },
  { r: "Paraguay",           f: "py",     rank: 30,  ronda: "R16", p: 61.9 },
  { r: "Escocia",            f: "gb-sct", rank: 28,  ronda: "R16", p: 60.1 },
  { r: "Turquía",            f: "tr",     rank: 23,  ronda: "R16", p: 55.4 },
  { r: "Canadá",             f: "ca",     rank: 22,  ronda: "R32", p: 54.4 },
  { r: "Ecuador",            f: "ec",     rank: 21,  ronda: "R16", p: 53.5 },
  { r: "Japón",              f: "jp",     rank: 19,  ronda: "R16", p: 51.4 },
  { r: "Senegal",            f: "sn",     rank: 17,  ronda: "R16", p: 49.4 },
  { r: "EUA",                f: "us",     rank: 16,  ronda: "R16", p: 48.4 },
  { r: "Suiza",              f: "ch",     rank: 14,  ronda: "R32", p: 46.3 },
  { r: "Marruecos",          f: "ma",     rank: 13,  ronda: "R16", p: 45.3 },
  { r: "Croacia",            f: "hr",     rank: 10,  ronda: "R16", p: 42.1 },
  { r: "Brasil",             f: "br",     rank: 4,   ronda: "R16", p: 36.3 },
  { r: "Colombia",           f: "co",     rank: 12,  ronda: "QF",  p: 34.9 },
  { r: "Uruguay",            f: "uy",     rank: 11,  ronda: "QF",  p: 34.2 },
  { r: "Bélgica",            f: "be",     rank: 9,   ronda: "QF",  p: 32.8 },
  { r: "Países Bajos",       f: "nl",     rank: 8,   ronda: "QF",  p: 32.0 },
  { r: "Alemania",           f: "de",     rank: 7,   ronda: "QF",  p: 31.3 },
  { r: "Portugal",           f: "pt",     rank: 6,   ronda: "SF",  p: 30.6 },
  { r: "Inglaterra",         f: "gb-eng", rank: 5,   ronda: "SF",  p: 29.9 },
  { r: "España",             f: "es",     rank: 3,   ronda: "SF",  p: 28.4 },
  { r: "Francia",            f: "fr",     rank: 2,   ronda: "QF",  p: 27.7 },
  { r: "Argentina",          f: "ar",     rank: 1,   ronda: "QF",  p: 27.0 },
];

const bc = (p) => p >= 65 ? MX_GREEN : p >= 45 ? MX_GOLD : p >= 33 ? "#2d6a4f" : MX_RED;
const rc = { R32: MX_GREEN, R16: "#6b7280", QF: MX_GOLD, SF: "#2d6a4f" };
export default function S13_RankingRivales() {
  return (
    <SectionWrapper id="s13" number={13}
      title="Ranking de Rivales Más Peligrosos"
      subtitle="La pregunta no es solo si México clasifica — es contra quién le toca después. En este torneo hay selecciones que México puede competir de tú a tú y otras que solo ganas si ellas tienen un día pésimo y tú uno de los mejores de tu historia. Aquí están ordenados los posibles rivales por lo que representan realmente, no solo por el número de su ranking.">
      <div className="g-side">
        <div className="card">
          <div className="chart-label">
            P(México gana) · todos los posibles rivales eliminatorios
          </div>
          <ResponsiveContainer width="100%" height={580}>
            <BarChart data={[...RIVALES].reverse()} layout="vertical"
              margin={{ top: 0, right: 50, left: 120, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke={GRID_CLR} strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: AXIS_CLR, fontSize: 9 }} unit="%" axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="r" tick={{ fill: "#444", fontSize: 10, fontWeight: 600 }} width={120} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v, n, pr) => [`${v}%  · Ronda esperada: ${pr.payload.ronda}`]} />
              <Bar dataKey="p" radius={[0, 3, 3, 0]}
                label={{ position: "right", formatter: (v) => `${v}%`, fill: "#888", fontSize: 9, fontWeight: 700 }}>
                {[...RIVALES].reverse().map((r, i) => <Cell key={i} fill={bc(r.p)} opacity={0.85} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
            {[[MX_GREEN, "≥65% (favorable)"], [MX_GOLD, "45-64%"], ["#2d6a4f", "33-44%"], [MX_RED, "<33% (difícil)"]].map(([c, l]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#888" }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: c, display: "inline-block" }} />
                {l}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="card">
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700, color: MX_GREEN, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, borderBottom: "2px solid var(--text)", paddingBottom: 6 }}>
              Ruta ideal · termina 1ro
            </div>
            {[{ r: "R32", e: "Qatar", f: "qa", p: 83.0 }, { r: "R16", e: "Haití", f: "ht", p: 86.0 }, { r: "QF", e: "Escocia", f: "gb-sct", p: 60.1 }].map((x) => (
              <div key={x.r} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid #f0f0f0" }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: "#888", width: 28 }}>{x.r}</span>
                <Flag code={x.f} className="w-6 h-4 rounded" alt={x.e} />
                <span style={{ flex: 1, fontSize: 11, color: "#444" }}>{x.e}</span>
                <span style={{ fontSize: 12, fontWeight: 900, color: MX_GREEN }}>{x.p}%</span>
              </div>
            ))}
          </div>

          <div className="card">
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700, color: MX_RED, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, borderBottom: "2px solid var(--text)", paddingBottom: 6 }}>
              Ruta pesadilla · termina 2do
            </div>
            {[{ r: "R32", e: "Suiza", f: "ch", p: 46.3 }, { r: "R16", e: "Brasil", f: "br", p: 36.3 }, { r: "QF", e: "Argentina", f: "ar", p: 27.0 }].map((x) => (
              <div key={x.r} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: "1px solid #f0f0f0" }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: "#888", width: 28 }}>{x.r}</span>
                <Flag code={x.f} className="w-6 h-4 rounded" alt={x.e} />
                <span style={{ flex: 1, fontSize: 11, color: "#444" }}>{x.e}</span>
                <span style={{ fontSize: 12, fontWeight: 900, color: MX_RED }}>{x.p}%</span>
              </div>
            ))}
          </div>

          {/* tabla top/bottom */}
          <div className="card">
            <div className="chart-label">
              Rivales con bandera
            </div>
            <div style={{ maxHeight: 300, overflowY: "auto" }}>
              {RIVALES.slice(0, 10).map((r, i) => (
                <div key={r.r} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 0", borderBottom: "1px solid #f0f0f0" }}>
                  <span style={{ fontSize: 10, color: "#aaa", width: 14 }}>{i+1}</span>
                  <Flag code={r.f} className="w-6 h-4 rounded" alt={r.r} />
                  <span style={{ flex: 1, fontSize: 11, color: "#111" }}>{r.r}</span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 9, fontWeight: 700, color: "var(--text-muted)", border: "1px solid var(--border-mid)", borderRadius: 2, padding: "1px 5px" }}>{r.ronda}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: bc(r.p) }}>{r.p}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
</SectionWrapper>
  );
}
