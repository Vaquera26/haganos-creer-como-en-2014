import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import SectionWrapper from "../ui/SectionWrapper.jsx";
import { MX_GREEN, MX_RED, AXIS_CLR, GRID_CLR, TOOLTIP_STYLE } from "../../theme.js";

// ── Datos ──────────────────────────────────────────────────────────────────────
// Filas = J1 vs Sudáfrica · Columnas = J2 vs Corea del Sur
const HEATMAP = [
  { j1: "J1: Gana",   cells: [{ p: 99, label: "G·G" }, { p: 81, label: "G·E" }, { p: 56, label: "G·P" }] },
  { j1: "J1: Empata", cells: [{ p: 81, label: "E·G" }, { p: 28, label: "E·E" }, { p:  8, label: "E·P" }] },
  { j1: "J1: Pierde", cells: [{ p: 56, label: "P·G" }, { p:  8, label: "P·E" }, { p:  2, label: "P·P" }] },
];
const COL_LABELS = [
  { title: "J2: Gana",   sub: "vs Corea del Sur" },
  { title: "J2: Empata", sub: "vs Corea del Sur" },
  { title: "J2: Pierde", sub: "vs Corea del Sur" },
];

// Distribución de puntos
const PTS_DATA = [
  { pts: "0", pOb: 2.5,  pCl: 0    }, { pts: "1", pOb: 7.0,  pCl: 0    },
  { pts: "2", pOb: 6.5,  pCl: 1.5  }, { pts: "3", pOb: 13.3, pCl: 6.8  },
  { pts: "4", pOb: 20.6, pCl: 57.3 }, { pts: "5", pOb: 9.6,  pCl: 98.9 },
  { pts: "6", pOb: 16.8, pCl: 97.6 }, { pts: "7", pOb: 15.5, pCl: 100  },
  { pts: "9", pOb: 8.3,  pCl: 100  },
];
const barFill = (pCl) => pCl >= 90 ? MX_GREEN : pCl >= 40 ? "#2d6a4f" : MX_RED;

// ── Color: blanco → verde México según P(clasificar) ──────────────────────────
// p=0% → blanco, p=100% → #166534
function cellColor(p) {
  const t = Math.max(0, Math.min(1, p / 100));
  const r = Math.round(255 + (22  - 255) * t);
  const g = Math.round(255 + (101 - 255) * t);
  const b = Math.round(255 + (52  - 255) * t);
  return {
    bg:   `rgb(${r},${g},${b})`,
    text: t > 0.45 ? "#fff" : "#166534",
    sub:  t > 0.45 ? "rgba(255,255,255,0.7)" : "rgba(22,101,52,0.55)",
  };
}

export default function S04_EscenariosClasificacion() {
  return (
    <SectionWrapper id="s04" number={4}
      title="Escenarios de Clasificación"
      subtitle="El escenario perfecto tiene un nombre: ganar los primeros dos y llegar al tercero sin presión. El peor escenario también tiene nombre: necesitar un resultado en el último partido mientras se ve la pantalla del estadio de al lado. México ya vivió eso en 2022 y fue un desastre. Lo que muestran estos números es cuánto margen hay y cuánto no.">

      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 16 }}>

        {/* ── HEATMAP ── */}
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>

          {/* Column headers */}
          <div style={{
            display: "grid", gridTemplateColumns: "90px 1fr 1fr 1fr",
            borderBottom: "2px solid var(--text)",
            background: "var(--bg-surface)",
          }}>
            <div style={{ padding: "10px 8px" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--text-muted)", letterSpacing: "0.1em" }}>
                P(CLASIFICAR)
              </div>
            </div>
            {COL_LABELS.map((col, i) => (
              <div key={i} style={{
                padding: "12px 8px", textAlign: "center",
                borderLeft: "1px solid var(--border-mid)",
              }}>
                <div style={{ fontFamily: "var(--sans)", fontSize: 12, fontWeight: 700, color: "var(--text)" }}>
                  {col.title}
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text-muted)", marginTop: 2 }}>
                  {col.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Rows */}
          {HEATMAP.map((row, ri) => (
            <div key={ri} style={{ display: "grid", gridTemplateColumns: "90px 1fr 1fr 1fr" }}>
              {/* Row label */}
              <div style={{
                display: "flex", flexDirection: "column", justifyContent: "center",
                padding: "8px 12px",
                fontFamily: "var(--sans)", fontSize: 12, fontWeight: 700, color: "var(--text-muted)",
                borderBottom: ri < 2 ? "1px solid var(--border)" : "none",
                borderRight: "2px solid var(--text)",
                lineHeight: 1.3,
              }}>
                {row.j1.split(": ").map((part, i) => (
                  <span key={i} style={{ fontSize: i === 0 ? 9 : 12, color: i === 0 ? "var(--text-muted)" : "var(--text)", fontWeight: i === 0 ? 400 : 700 }}>
                    {i === 0 ? part + ":" : part}
                  </span>
                ))}
              </div>

              {/* Cells */}
              {row.cells.map((cell, ci) => {
                const clr = cellColor(cell.p);
                return (
                  <div key={ci} style={{
                    background: clr.bg,
                    borderBottom: ri < 2 ? "1px solid rgba(22,101,52,0.12)" : "none",
                    borderLeft:  "1px solid rgba(22,101,52,0.12)",
                    padding: "16px 10px",
                    textAlign: "center",
                    minHeight: 76,
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: 5,
                  }}>
                    <span style={{
                      fontFamily: "var(--mono)", fontSize: 26, fontWeight: 900,
                      color: clr.text, letterSpacing: "-0.02em", lineHeight: 1,
                    }}>
                      {cell.p}%
                    </span>
                    <span style={{
                      fontFamily: "var(--mono)", fontSize: 9,
                      color: clr.sub, letterSpacing: "0.04em",
                    }}>
                      {cell.label}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Color legend bar */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 14px", borderTop: "1px solid var(--border)",
            background: "var(--bg-surface)",
          }}>
            <div style={{
              flex: 1, height: 8, borderRadius: 4,
              background: `linear-gradient(to right, ${cellColor(0).bg}, ${cellColor(50).bg}, ${cellColor(100).bg})`,
            }} />
            <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text-muted)", whiteSpace: "nowrap" }}>
              riesgo → seguro
            </span>
          </div>

          {/* Key note */}
          <div style={{ padding: "8px 14px", background: "var(--bg-surface)" }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text-muted)" }}>
              G=gana · E=empata · P=pierde · J1=vs Sudáfrica · J2=vs Corea del Sur
            </span>
          </div>
        </div>

        {/* ── BAR CHART ── */}
        <div className="card">
          <div className="chart-label">Distribución de puntos y P(clasificar directo)</div>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={PTS_DATA} margin={{ top: 8, right: 45, left: -10, bottom: 12 }}>
              <CartesianGrid stroke={GRID_CLR} vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="pts" tick={{ fill: "#444", fontSize: 11, fontWeight: 700 }}
                axisLine={false} tickLine={false}
                label={{ value: "Puntos", position: "insideBottom", offset: -6, fill: AXIS_CLR, fontSize: 10 }} />
              <YAxis yAxisId="l" tick={{ fill: AXIS_CLR, fontSize: 10 }} unit="%" axisLine={false} tickLine={false} />
              <YAxis yAxisId="r" orientation="right" tick={{ fill: MX_GREEN, fontSize: 9 }} unit="%" axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v, n) => [`${v}%`, n]} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar yAxisId="l" dataKey="pOb" name="P(obtener pts)" radius={[3,3,0,0]} maxBarSize={44}>
                {PTS_DATA.map((d, i) => <Cell key={i} fill={barFill(d.pCl)} opacity={0.8} />)}
              </Bar>
              <Line yAxisId="r" dataKey="pCl" name="P(clasificar)" stroke={MX_GREEN} strokeWidth={2.5}
                dot={{ r: 4, fill: MX_GREEN, stroke: "#fff", strokeWidth: 2 }} type="monotone" />
            </ComposedChart>
          </ResponsiveContainer>

          {/* Summary stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
            {[
              ["62.5%", "clasifica directo",      MX_GREEN],
              ["74.2%", "total incl. como 3ro",   "#2d6a4f"],
              ["20.6%", "prob. de 4 pts (típico)", "#374151"],
              ["57.3%", "clasificar con 4 pts",    "#2d6a4f"],
            ].map(([v, l, c]) => (
              <div key={l} style={{ border: "1px solid var(--border-mid)", borderRadius: 6, padding: "8px 10px" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 18, fontWeight: 900, color: c }}>{v}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text-muted)", marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </SectionWrapper>
  );
}
