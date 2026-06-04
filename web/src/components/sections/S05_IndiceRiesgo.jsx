import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell,
  ResponsiveContainer
} from "recharts";
import SectionWrapper from "../ui/SectionWrapper.jsx";
import { MX_GREEN, MX_RED, MX_GOLD, MX_BLUE, AXIS_CLR, GRID_CLR, LABEL_CLR, TOOLTIP_STYLE } from "../../theme.js";

const DATOS = [
  { dim: "Dif. Grupo",  val2026: 6.27, hist: 5.5, qatar22: 7.0 },
  { dim: "Ruta Elim.",  val2026: 7.89, hist: 7.0, qatar22: 8.0 },
  { dim: "Forma (inv)", val2026: 2.33, hist: 5.0, qatar22: 6.0 },
  { dim: "Penales",     val2026: 7.50, hist: 7.5, qatar22: 7.5 },
  { dim: "Presión",     val2026: 8.50, hist: 6.0, qatar22: 8.0 },
  { dim: "Dep. Goles",  val2026: 7.25, hist: 5.0, qatar22: 7.0 },
];

// radar necesita formato distinto
const RADAR_DATA = DATOS.map((d) => ({
  subject: d.dim,
  "México 2026": d.val2026,
  "Hist. prom.": d.hist,
  "Qatar 2022":  d.qatar22,
}));

const prom2026 = (DATOS.reduce((a, d) => a + d.val2026, 0) / DATOS.length).toFixed(2);

export default function S05_IndiceRiesgo() {
  return (
    <SectionWrapper
      id="s05" number={5} accent="red"
      title="El Índice de Riesgo de México"
      subtitle="6 dimensiones de riesgo combinadas. El promedio 2026 es 6.62/10 vs 6.00 del histórico. La forma reciente compensa."
      quote="El mayor riesgo no son los rivales. Es la presión de 32 años sin pasar de octavos."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* radar */}
        <div className="bg-mx-card border border-mx-border rounded-2xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2">
            Perfil de riesgo (10 = máximo riesgo)
          </p>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={RADAR_DATA} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
              <PolarGrid stroke={GRID_CLR} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: LABEL_CLR, fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: AXIS_CLR, fontSize: 9 }} />
              <Radar name="Hist. prom."  dataKey="Hist. prom." stroke="#4b5563" fill="#4b5563" fillOpacity={0.12} strokeWidth={1.5} />
              <Radar name="Qatar 2022"   dataKey="Qatar 2022"  stroke={MX_RED}   fill={MX_RED}   fillOpacity={0.12} strokeWidth={1.5} />
              <Radar name="México 2026"  dataKey="México 2026" stroke={MX_GREEN} fill={MX_GREEN} fillOpacity={0.30} strokeWidth={2.5} />
              <Tooltip {...TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ color: LABEL_CLR, fontSize: 11 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* barras agrupadas */}
        <div className="bg-mx-card border border-mx-border rounded-2xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2">
            Comparación por dimensión
          </p>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={DATOS} layout="vertical" margin={{ top: 0, right: 30, left: 60, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke={GRID_CLR} />
              <XAxis type="number" domain={[0, 10]} tick={{ fill: AXIS_CLR, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="dim" tick={{ fill: LABEL_CLR, fontSize: 11 }} width={60} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [v.toFixed(2), ""]} />
              <Legend wrapperStyle={{ color: LABEL_CLR, fontSize: 11 }} />
              <Bar dataKey="hist"     name="Hist. prom." fill="#4b5563" opacity={0.7} radius={[0,3,3,0]} />
              <Bar dataKey="qatar22"  name="Qatar 2022"  fill={MX_RED}   opacity={0.7} radius={[0,3,3,0]} />
              <Bar dataKey="val2026"  name="México 2026" fill={MX_GREEN} opacity={0.9} radius={[0,3,3,0]} />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="text-center border border-mx-green/30 rounded-lg py-2">
              <p className="text-2xl font-black text-mx-green">{prom2026}</p>
              <p className="text-xs text-gray-500">Riesgo 2026 / 10</p>
            </div>
            <div className="text-center border border-zinc-700 rounded-lg py-2">
              <p className="text-2xl font-black text-zinc-400">2.33</p>
              <p className="text-xs text-gray-500">Forma (más baja = mejor)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-5 bg-mx-green/5 border border-mx-green/20 rounded-xl">
        <p className="text-sm text-gray-300 leading-relaxed">
          <span className="text-mx-green font-bold">La esperanza:</span> La dimensión de "Forma reciente" (2.33) es la más baja en la historia moderna de México —
          Nations League 2025 y Gold Cup 2025 ganados. Llegamos en el mejor momento de forma de los últimos 20 años.
          Si hay un año para reducir el riesgo, es este.
        </p>
      </div>
    </SectionWrapper>
  );
}
