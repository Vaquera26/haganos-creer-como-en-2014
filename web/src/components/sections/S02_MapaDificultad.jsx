import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import SectionWrapper from "../ui/SectionWrapper.jsx";
import { MX_GREEN, MX_MED, MX_RED, AXIS_CLR, GRID_CLR, TOOLTIP_STYLE } from "../../theme.js";

const HEATMAP = [
  { ronda: "R32",
    "1ro": { p: 52.1, rival: "Suiza o Canadá" },
    "2do": { p: 48.0, rival: "Canadá o Suiza" },
    "3ro": { p: 69.4, rival: "Líder grupo grande" },
  },
  { ronda: "R16",
    "1ro": { p: 66.5, rival: "Brasil o EUA" },
    "2do": { p: 64.4, rival: "Marruecos / EUA" },
    "3ro": { p: 70.8, rival: "Potencia top-8" },
  },
  { ronda: "QF",
    "1ro": { p: 68.7, rival: "Alemania / Países B" },
    "2do": { p: 68.7, rival: "Inglaterra / Bélg." },
    "3ro": { p: 71.6, rival: "Potencia top-5" },
  },
  { ronda: "SF",
    "1ro": { p: 72.3, rival: "España / Francia" },
    "2do": { p: 70.8, rival: "Brasil / Portugal" },
    "3ro": { p: 72.3, rival: "Top-3" },
  },
  { ronda: "Final",
    "1ro": { p: 73.0, rival: "Argentina / Francia" },
    "2do": { p: 73.0, rival: "Argentina / Francia" },
    "3ro": { p: 73.0, rival: "Final inevitable" },
  },
];

const LINE_DATA = HEATMAP.map(r => ({
  ronda: r.ronda,
  "1ro": r["1ro"].p,
  "2do": r["2do"].p,
  "3ro": r["3ro"].p,
}));

const POSITIONS = ["1ro", "2do", "3ro"];
const POS_LABELS = {
  "1ro": { title: "1ro del grupo", sub: "ruta fácil" },
  "2do": { title: "2do del grupo", sub: "ruta media" },
  "3ro": { title: "3ro del grupo", sub: "ruta imposible" },
};

// White (#fff) → México dark green (#166534) based on difficulty
// 40% = easiest (white) → 75% = hardest (dark green)
function cellColor(p) {
  const t = Math.max(0, Math.min(1, (p - 40) / 35));
  const r = Math.round(255 + (22  - 255) * t);
  const g = Math.round(255 + (101 - 255) * t);
  const b = Math.round(255 + (52  - 255) * t);
  return {
    bg:   `rgb(${r},${g},${b})`,
    text: t > 0.45 ? '#fff' : '#166534',
    sub:  t > 0.45 ? 'rgba(255,255,255,0.75)' : 'rgba(22,101,52,0.6)',
  };
}

export default function S02_MapaDificultad() {
  return (
    <SectionWrapper id="s02" number={2}
      title="Mapa de Dificultad del Camino"
      subtitle="En 2018 México ganó el grupo con siete puntos y le tocó Brasil en octavos. Perdió 2-0. Aquí el bracket importa doble: no solo determina los rivales sino también la sede. Grupos y posiblemente R32 y R16 pueden ser en México — con todo lo que eso implica en altitud y afición. Pero si México llega a cuartos, el partido ya es en Estados Unidos. Terminar primero del grupo no es lo mismo que terminar segundo, y en este formato esa diferencia puede ser enorme.">

      <div className="g-main">

        {/* ── HEATMAP ── */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>

          {/* Column headers */}
          <div style={{
            display: "grid", gridTemplateColumns: "56px 1fr 1fr 1fr",
            borderBottom: "2px solid var(--text)",
            background: "var(--bg-surface)",
          }}>
            <div />
            {POSITIONS.map(pos => (
              <div key={pos} style={{
                padding: "12px 8px", textAlign: "center",
                borderLeft: "1px solid var(--border-mid)",
              }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 700, color: "var(--text)" }}>
                  {POS_LABELS[pos].title}
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text-muted)", marginTop: 2, letterSpacing: "0.05em" }}>
                  {POS_LABELS[pos].sub}
                </div>
              </div>
            ))}
          </div>

          {/* Rows */}
          {HEATMAP.map((row) => (
            <div key={row.ronda} style={{ display: "grid", gridTemplateColumns: "56px 1fr 1fr 1fr" }}>
              {/* Row label */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700, color: "var(--text-muted)",
                borderBottom: "1px solid var(--border)", borderRight: "2px solid var(--text)",
                padding: "4px 0",
              }}>
                {row.ronda}
              </div>

              {/* Cells */}
              {POSITIONS.map(pos => {
                const cell  = row[pos];
                const clr   = cellColor(cell.p);
                return (
                  <div key={pos} style={{
                    background:  clr.bg,
                    borderBottom: "1px solid rgba(22,101,52,0.12)",
                    borderLeft:   "1px solid rgba(22,101,52,0.12)",
                    padding: "14px 10px",
                    textAlign: "center",
                    minHeight: 72,
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: 5,
                  }}>
                    <span style={{
                      fontFamily: "var(--mono)", fontSize: 24, fontWeight: 900,
                      color: clr.text, letterSpacing: "-0.02em",
                    }}>
                      {cell.p}%
                    </span>
                    <span style={{
                      fontFamily: "var(--mono)", fontSize: 9,
                      color: clr.sub, letterSpacing: "0.03em",
                    }}>
                      ~{cell.rival}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Color legend */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 14px", borderTop: "1px solid var(--border)",
            background: "var(--bg-surface)",
          }}>
            <div style={{
              flex: 1, height: 8, borderRadius: 4,
              background: `linear-gradient(to right, ${cellColor(40).bg}, ${cellColor(57).bg}, ${cellColor(75).bg})`,
            }} />
            <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
              favorable → difícil
            </span>
          </div>
        </div>

        {/* ── LINE CHART ── */}
        <div className="card">
          <div className="chart-label">Dificultad acumulada por ronda</div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={LINE_DATA} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
              <CartesianGrid stroke={GRID_CLR} vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="ronda" tick={{ fill: "#444", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: AXIS_CLR, fontSize: 10 }} unit="%" domain={[40, 80]} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`${v}%`, "P(pierde)"]} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line dataKey="1ro" name="Terminar 1ro" stroke={MX_GREEN} strokeWidth={2.5}
                dot={{ r: 4, fill: MX_GREEN, stroke: "#fff", strokeWidth: 1.5 }} type="monotone" />
              <Line dataKey="2do" name="Terminar 2do" stroke={MX_MED} strokeWidth={2}
                dot={{ r: 4, fill: MX_MED, stroke: "#fff", strokeWidth: 1.5 }} type="monotone" />
              <Line dataKey="3ro" name="Terminar 3ro" stroke={MX_RED} strokeWidth={2}
                dot={{ r: 4, fill: MX_RED, stroke: "#fff", strokeWidth: 1.5 }} type="monotone" strokeDasharray="5 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </SectionWrapper>
  );
}
