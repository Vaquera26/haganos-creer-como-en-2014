import { ComposedChart, Bar, Line, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, LabelList, ResponsiveContainer } from "recharts";
import SectionWrapper from "../ui/SectionWrapper.jsx";
import { MX_GREEN, MX_MED, MX_RED, MX_GRAY, AXIS_CLR, GRID_CLR, TOOLTIP_STYLE } from "../../theme.js";

// Barras = P(clasificar directo) · Línea = P(obtener esos puntos)
const DATA = [
  { pts: 0, pCl:   0,   pOb:  2.5 },
  { pts: 1, pCl:   0,   pOb:  7.0 },
  { pts: 2, pCl:   1.5, pOb:  6.5 },
  { pts: 3, pCl:   6.8, pOb: 13.3 },
  { pts: 4, pCl:  57.3, pOb: 20.6 },
  { pts: 5, pCl:  98.9, pOb:  9.6 },
  { pts: 6, pCl:  97.6, pOb: 16.8 },
  { pts: 7, pCl: 100,   pOb: 15.5 },
  { pts: 9, pCl: 100,   pOb:  8.3 },
];

// Color de barra según P(clasificar)
const barColor = (pCl) => pCl >= 80 ? MX_GREEN : pCl >= 40 ? MX_MED : MX_RED;

// Distribución de posición final (100k simulaciones)
const POS_DATA = [
  { pos: "1ro",  pct: 35.6, color: MX_GREEN, desc: "clasif. directa" },
  { pos: "2do",  pct: 27.0, color: MX_MED,   desc: "clasif. directa" },
  { pos: "3ro",  pct: 21.3, color: MX_GRAY,  desc: "posible clasif." },
  { pos: "4to",  pct: 16.2, color: MX_RED,   desc: "eliminado"       },
];

// Label encima de barra (solo si pOb > 1%)
const BarLabel = ({ x, y, width, value, pOb }) => {
  if (pOb <= 1 || value < 1) return null;
  return (
    <text x={x + width / 2} y={y - 5}
      fill="#444" textAnchor="middle"
      fontFamily="ui-monospace,'Courier New',monospace"
      fontSize={10} fontWeight={700}>
      {Math.round(value)}%
    </text>
  );
};

export default function S10_PuntosNecesarios() {
  return (
    <SectionWrapper id="s10" number={10}
      title="Puntos Necesarios para Clasificar"
      subtitle="En Qatar 2022 México terminó con exactamente los mismos puntos que Polonia — y se fue a casa por diferencia de goles. Cuatro años antes, en Rusia, terminó invicto en grupos y eso no le evitó perder con Brasil en octavos. Los puntos no garantizan nada, pero no tenerlos garantiza todo lo malo. Con seis puntos México clasifica casi seguro. Con cuatro, empieza a rezar.">

      <div className="g-main">

        {/* ── Izquierda: barras P(clasif) + línea P(obtener pts) ── */}
        <div className="card">
          <div className="chart-label">Puntos vs probabilidad de clasificación directa</div>
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={DATA} margin={{ top: 24, right: 55, left: 0, bottom: 20 }}>
              <CartesianGrid stroke={GRID_CLR} vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="pts"
                tick={{ fill: "#444", fontSize: 13, fontWeight: 700 }}
                axisLine={false} tickLine={false}
                label={{ value: "Puntos obtenidos en grupos", position: "insideBottom", offset: -8, fill: AXIS_CLR, fontSize: 10 }} />
              {/* Eje izq: P(clasificar) */}
              <YAxis yAxisId="l" domain={[0, 105]} tick={{ fill: AXIS_CLR, fontSize: 10 }} unit="%" axisLine={false} tickLine={false}
                label={{ value: "P(clasificar directo) %", angle: -90, position: "insideLeft", offset: 10, fill: AXIS_CLR, fontSize: 9 }} />
              {/* Eje der: P(obtener pts) */}
              <YAxis yAxisId="r" orientation="right" domain={[0, 45]} tick={{ fill: MX_MED, fontSize: 10 }} unit="%" axisLine={false} tickLine={false}
                label={{ value: "P(obtener X pts) %", angle: 90, position: "insideRight", offset: -4, fill: MX_MED, fontSize: 9 }} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v, n) => [`${v}%`, n]} />
              <Legend wrapperStyle={{ fontSize: 10 }} />

              {/* Barras = P(clasificar) coloreadas */}
              <Bar yAxisId="l" dataKey="pCl" name="P(clasificar directo)" maxBarSize={56}>
                {DATA.map((d, i) => (
                  <Cell key={i} fill={barColor(d.pCl)} opacity={0.85} />
                ))}
                {/* Labels encima de barra */}
                <LabelList dataKey="pCl" content={(props) => {
                  const d = DATA[props.index];
                  if (!d || d.pOb <= 1 || d.pCl < 1) return null;
                  return (
                    <text x={props.x + props.width / 2} y={props.y - 5}
                      fill="#333" textAnchor="middle"
                      fontFamily="ui-monospace,monospace" fontSize={10} fontWeight={700}>
                      {Math.round(d.pCl)}%
                    </text>
                  );
                }} />
              </Bar>

              {/* Línea punteada = P(obtener pts) */}
              <Line yAxisId="r" dataKey="pOb" name="P(obtener esos pts)"
                stroke={MX_MED} strokeWidth={2} strokeDasharray="5 3"
                dot={{ r: 5, fill: MX_MED, stroke: "#fff", strokeWidth: 1.5 }}
                type="monotone" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* ── Derecha: distribución de posición final ── */}
        <div className="card">
          <div className="chart-label">Distribución de posición final · 100,000 simulaciones</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={POS_DATA} margin={{ top: 24, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke={GRID_CLR} vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="pos" tick={{ fill: "#444", fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: AXIS_CLR, fontSize: 10 }} unit="%" axisLine={false} tickLine={false} domain={[0, 40]} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`${v}%`]} labelFormatter={(l) => {
                const d = POS_DATA.find(x => x.pos === l);
                return `${l} lugar — ${d?.desc}`;
              }} />
              <Bar dataKey="pct" name="% simulaciones" radius={[4,4,0,0]} maxBarSize={70}>
                {POS_DATA.map((d, i) => <Cell key={i} fill={d.color} opacity={0.85} />)}
                <LabelList dataKey="pct" position="top" formatter={(v) => `${v}%`}
                  style={{ fontFamily: "ui-monospace,monospace", fontSize: 11, fontWeight: 700, fill: "#333" }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Etiquetas de posición */}
          <div className="g-2" style={{ marginTop: 12 }}>
            {POS_DATA.map((d) => (
              <div key={d.pos} style={{ border: "1px solid var(--border-mid)", borderRadius: 4, padding: "6px 10px" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: 16, fontWeight: 900, color: d.color }}>{d.pct}%</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text)", fontWeight: 700 }}>{d.pos} lugar</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--text-muted)" }}>{d.desc}</div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div style={{ marginTop: 10, padding: "8px 10px", background: "rgba(22,101,52,0.05)", border: "1px solid rgba(22,101,52,0.2)", borderRadius: 4 }}>
            <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text-muted)" }}>
              P(clasif. directa 1ro/2do):&nbsp;
            </span>
            <strong style={{ fontFamily: "var(--mono)", fontSize: 11, color: MX_GREEN }}>62.5%</strong>
            <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text-muted)", marginLeft: 10 }}>
              incl. 3ro mejor:&nbsp;
            </span>
            <strong style={{ fontFamily: "var(--mono)", fontSize: 11, color: MX_MED }}>74.2%</strong>
          </div>
        </div>

      </div>
    </SectionWrapper>
  );
}
