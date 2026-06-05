import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import SectionWrapper from "../ui/SectionWrapper.jsx";
import { MX_GREEN, MX_RED, MX_GOLD, AXIS_CLR, GRID_CLR, TOOLTIP_STYLE } from "../../theme.js";

const DIMS = [
  { dim: "Dif. Grupo",  v2026: 6.27, hist: 5.5, q22: 7.0 },
  { dim: "Ruta Elim.", v2026: 7.89, hist: 7.0, q22: 8.0 },
  { dim: "Forma(inv)", v2026: 2.33, hist: 5.0, q22: 6.0 },
  { dim: "Penales",    v2026: 7.50, hist: 7.5, q22: 7.5 },
  { dim: "Presión",    v2026: 8.50, hist: 6.0, q22: 8.0 },
  { dim: "Dep.Goles",  v2026: 7.25, hist: 5.0, q22: 7.0 },
];

const RADAR = DIMS.map((d) => ({ subject: d.dim, "México 2026": d.v2026, "Hist.prom.": d.hist, "Qatar 2022": d.q22 }));
const prom26 = (DIMS.reduce((a, d) => a + d.v2026, 0) / DIMS.length).toFixed(2);
export default function S05_IndiceRiesgo() {
  return (
    <SectionWrapper id="s05" number={5}
      title="Índice de Riesgo de México"
      subtitle="Después de Qatar 2022 nadie podía argumentar que el problema era mala suerte. México fue eliminado en grupos por primera vez en 44 años. Eso sacudió todo. Lo que vino después — Nations League, Gold Cup, amistosos ante Portugal y Bélgica — fue el mejor ciclo en años. Pero el riesgo real no está en el papel: está en si ese México que ganó en casa aparece cuando de verdad importa.">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div className="card">
          <div className="chart-label">
            Radar de riesgo · 10 = máximo riesgo
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={RADAR} margin={{ top: 10, right: 40, bottom: 10, left: 40 }}>
              <PolarGrid stroke={GRID_CLR} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#555", fontSize: 10 }} />
              <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: AXIS_CLR, fontSize: 8 }} />
              <Radar name="Hist.prom."  dataKey="Hist.prom."  stroke="#9ca3af" fill="#9ca3af" fillOpacity={0.10} strokeWidth={1.5} />
              <Radar name="Qatar 2022"  dataKey="Qatar 2022"  stroke={MX_RED}   fill={MX_RED}   fillOpacity={0.10} strokeWidth={1.5} />
              <Radar name="México 2026" dataKey="México 2026" stroke={MX_GREEN} fill={MX_GREEN} fillOpacity={0.25} strokeWidth={2.5} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#555" }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="chart-label">
            Comparación por dimensión
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={DIMS} layout="vertical" margin={{ top: 0, right: 30, left: 62, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke={GRID_CLR} strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 10]} tick={{ fill: AXIS_CLR, fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="dim" tick={{ fill: "#444", fontSize: 11 }} width={62} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [v.toFixed(2)]} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#555" }} />
              <Bar dataKey="hist"   name="Hist.prom." fill="#9ca3af" radius={[0,3,3,0]} opacity={0.7} />
              <Bar dataKey="q22"    name="Qatar 2022"  fill={MX_RED}   radius={[0,3,3,0]} opacity={0.7} />
              <Bar dataKey="v2026"  name="México 2026" fill={MX_GREEN} radius={[0,3,3,0]} opacity={0.9} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
            <div style={{ border: `1px solid ${MX_GREEN}30`, borderRadius: 3, padding: "8px 12px" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: MX_GREEN }}>{prom26}</div>
              <div style={{ fontSize: 10, color: "#888" }}>Riesgo 2026 / 10</div>
            </div>
            <div style={{ border: "1px solid #e0e0e0", borderRadius: 3, padding: "8px 12px" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: MX_GREEN }}>2.33</div>
              <div style={{ fontSize: 10, color: "#888" }}>Forma (más bajo = mejor)</div>
            </div>
          </div>
        </div>
      </div>
</SectionWrapper>
  );
}
