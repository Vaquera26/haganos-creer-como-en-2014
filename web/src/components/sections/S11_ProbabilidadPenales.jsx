import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceDot,
} from "recharts";
import SectionWrapper from "../ui/SectionWrapper.jsx";
import Flag from "../ui/Flag.jsx";
import { MX_GREEN, MX_MED, MX_RED, AXIS_CLR, GRID_CLR, TOOLTIP_STYLE } from "../../theme.js";

// ── Datos exactos del script Python ──────────────────────────────────────────
const RONDAS = [
  { r: "R32",   pET: 30.8, pPen: 19.1 },
  { r: "R16",   pET: 29.4, pPen: 18.3 },
  { r: "QF",    pET: 27.5, pPen: 17.0 },
  { r: "SF",    pET: 25.1, pPen: 15.6 },
  { r: "Final", pET: 24.0, pPen: 14.9 },
];

// Historial (Mundiales primero, luego CONCACAF)
const HIST = [
  { label: "Nations L 2021 vs EUA", result: "P", tipo: "CONCACAF" },
  { label: "Copa Oro 2021 vs Canadá", result: "P", tipo: "CONCACAF" },
  { label: "Copa Oro 2019 vs EUA",   result: "G", tipo: "CONCACAF" },
  { label: "1994 vs Bulgaria (1-3)", result: "P", tipo: "Mundial"  },
  { label: "1986 vs Alemania (3-4)", result: "P", tipo: "Mundial"  },
];

// Curva P(ET) = max(8, 33 * exp(-d/350))  |  P(pen) = P(ET)*0.62
// Precalculada de 0 a 580 en 30 pasos
const CURVE = Array.from({ length: 20 }, (_, i) => {
  const diff = i * 30;
  const pET  = Math.max(8, 33 * Math.exp(-diff / 350));
  const pPen = pET * 0.62;
  return { diff, pET: +pET.toFixed(1), pPen: +pPen.toFixed(1) };
});

// Marcadores de cada ronda en la curva (Elo diff estimado)
const MARKERS = [
  { ronda: "R32",   diff:  88, pET: 30.8, pPen: 19.1 },
  { ronda: "R16",   diff: 118, pET: 29.4, pPen: 18.3 },
  { ronda: "QF",    diff: 160, pET: 27.5, pPen: 17.0 },
  { ronda: "SF",    diff: 218, pET: 25.1, pPen: 15.6 },
  { ronda: "Final", diff: 262, pET: 24.0, pPen: 14.9 },
];

export default function S11_ProbabilidadPenales() {
  return (
    <SectionWrapper id="s11" number={11}
      title="La Maldición de los Penales"
      subtitle="La única vez que México ganó en penales en un Mundial fue en 1986 ante Alemania Occidental — el partido más cercano a la gloria en toda su historia. Desde entonces, perdió con Bulgaria en 1994 en tanda de penales y contra Países Bajos en 2014 con un penal cobrado en el 94 que abrió la herida de otra manera. No son exactamente los penales el problema — es que el partido siempre termina en el peor momento posible.">

      <div className="g-3">

        {/* ── 1. HISTORIAL BARRAS HORIZONTALES ── */}
        <div className="card">
          <div className="chart-label">
            Historial México en tandas de penales · P(ganar): 13%
          </div>

          {HIST.map((h, i) => {
            const isGana = h.result === "G";
            const bg     = isGana ? MX_GREEN : MX_RED;
            const isDiv  = i === 2; // línea divisoria Mundiales/CONCACAF
            return (
              <div key={i}>
                {isDiv && (
                  <div style={{
                    borderTop: "1px dashed var(--border-mid)",
                    margin: "6px 0 4px",
                    fontFamily: "var(--mono)", fontSize: 8,
                    color: "var(--text-muted)", textAlign: "center",
                  }}>
                    CONCACAF ↑ · Mundiales ↓
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  {/* barra de color */}
                  <div style={{
                    flex: 1, height: 34, borderRadius: 4,
                    background: bg, opacity: 0.85,
                    display: "flex", alignItems: "center", paddingLeft: 10,
                  }}>
                    <span style={{
                      fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700,
                      color: "#fff", whiteSpace: "nowrap",
                    }}>
                      {h.label}
                    </span>
                  </div>
                  {/* etiqueta */}
                  <div style={{ textAlign: "right", minWidth: 70 }}>
                    <div style={{
                      fontFamily: "var(--mono)", fontSize: 11, fontWeight: 900,
                      color: isGana ? MX_GREEN : MX_RED,
                    }}>
                      {isGana ? "GANA ✓" : "PIERDE ✗"}
                    </div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text-muted)" }}>
                      {h.tipo}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 10 }}>
            {[
              ["0",     "victorias",    MX_RED    ],
              ["5",     "tandas totales","#374151" ],
              ["13.3%", "P(ganar)",     MX_RED    ],
            ].map(([v, l, c]) => (
              <div key={l} style={{ border: "1px solid var(--border-mid)", borderRadius: 6, padding: "8px 6px", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 18, fontWeight: 900, color: c }}>{v}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text-muted)", marginTop: 1 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 2. BARRAS P(ET) Y P(PENALES) POR RONDA ── */}
        <div className="card">
          <div className="chart-label">P(ET) y P(penales) por ronda según rival esperado</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={RONDAS} margin={{ top: 0, right: 10, left: -10, bottom: 0 }} barCategoryGap="30%">
              <CartesianGrid vertical={false} stroke={GRID_CLR} strokeDasharray="3 3" />
              <XAxis dataKey="r" tick={{ fill: "#444", fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: AXIS_CLR, fontSize: 10 }} unit="%" axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`${v}%`]} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="pET"  name="P(tiempo extra)" fill={MX_MED} radius={[3,3,0,0]} opacity={0.85} />
              <Bar dataKey="pPen" name="P(penales)"       fill={MX_RED} radius={[3,3,0,0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>

          <div style={{
            marginTop: 10, padding: "10px 12px",
            border: "1px solid var(--border-mid)",
            borderRadius: 4, fontSize: 11,
            fontFamily: "var(--serif)", color: "var(--text-sec)", lineHeight: 1.55,
          }}>
            Si México llega a penales en R32 (P=19.1%), la probabilidad de pasar con el historial actual es{" "}
            <strong style={{ color: MX_RED }}>~13.3%</strong>. La solución más simple: ganar en tiempo regular.
          </div>
        </div>

        {/* ── 3. CURVA P(ET/PENALES) VS ELO DIFF ── */}
        <div className="card">
          <div className="chart-label">P(ET/penales) según equilibrio del partido</div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={CURVE} margin={{ top: 8, right: 16, left: -10, bottom: 8 }}>
              <CartesianGrid stroke={GRID_CLR} strokeDasharray="3 3" />
              <XAxis dataKey="diff" tick={{ fill: AXIS_CLR, fontSize: 9 }} axisLine={false} tickLine={false}
                label={{ value: "Diferencia Elo →", position: "insideBottomRight", offset: 0, fill: AXIS_CLR, fontSize: 9 }} />
              <YAxis tick={{ fill: AXIS_CLR, fontSize: 10 }} unit="%" axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v, n) => [`${v}%`, n]}
                labelFormatter={(v) => `Elo diff: ${v}`} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Line dataKey="pET"  name="P(tiempo extra)" stroke={MX_MED} strokeWidth={2.5} dot={false} type="monotone" />
              <Line dataKey="pPen" name="P(penales)"       stroke={MX_RED} strokeWidth={2.5} dot={false} type="monotone" />
              {/* Marcadores por ronda */}
              {MARKERS.map((m) => (
                <ReferenceDot key={m.ronda} x={m.diff} y={m.pET}
                  r={5} fill={MX_MED} stroke="#fff" strokeWidth={1.5}
                  label={{ value: m.ronda, position: "top", fontSize: 8, fill: "var(--text-muted)", fontFamily: "ui-monospace,monospace" }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
          <p style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text-muted)", marginTop: 6 }}>
            Elo diff = 0 → partidos muy parejos (más probable ET) · diff ↑ → rival dominante (menos ET)
          </p>
        </div>

      </div>
    </SectionWrapper>
  );
}
