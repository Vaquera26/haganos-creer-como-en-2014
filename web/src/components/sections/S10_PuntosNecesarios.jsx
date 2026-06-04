import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from "recharts";
import SectionWrapper from "../ui/SectionWrapper.jsx";
import { MX_GREEN, MX_RED, MX_GOLD, MX_BLUE, AXIS_CLR, GRID_CLR, LABEL_CLR, TOOLTIP_STYLE } from "../../theme.js";

// Datos exactos output Python script 10
const DATA = [
  { pts: "0",  pObtener: 2.5,  pClasif: 0,    posProm: 4.00 },
  { pts: "1",  pObtener: 7.0,  pClasif: 0,    posProm: 3.92 },
  { pts: "2",  pObtener: 6.5,  pClasif: 1.5,  posProm: 3.49 },
  { pts: "3",  pObtener: 13.3, pClasif: 6.8,  posProm: 3.22 },
  { pts: "4",  pObtener: 20.6, pClasif: 57.3, posProm: 2.41 },
  { pts: "5",  pObtener: 9.6,  pClasif: 98.9, posProm: 1.57 },
  { pts: "6",  pObtener: 16.8, pClasif: 97.6, posProm: 1.55 },
  { pts: "7",  pObtener: 15.5, pClasif: 100,  posProm: 1.06 },
  { pts: "9",  pObtener: 8.3,  pClasif: 100,  posProm: 1.00 },
];

const colorBar = (entry) => {
  const p = entry.pClasif;
  if (p >= 90) return MX_GREEN;
  if (p >= 40) return MX_GOLD;
  return MX_RED;
};

export default function S10_PuntosNecesarios() {
  return (
    <SectionWrapper
      id="s10" number={10} accent="gold"
      title="Puntos Necesarios para Clasificar"
      subtitle="100,000 simulaciones del Grupo A. Distribución de puntos y su asociación con clasificar de manera directa."
      quote="Con 6 puntos clasificamos sin ver el marcador de los otros. Con 3 puntos, necesitamos calcular y rezar."
    >
      <div className="bg-mx-card border border-mx-border rounded-2xl p-5 mb-4">
        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">
          Distribución de puntos (barras) vs P(clasificar directo) (línea)
        </p>
        <ResponsiveContainer width="100%" height={340}>
          <ComposedChart data={DATA} margin={{ top: 8, right: 60, left: 0, bottom: 16 }}>
            <CartesianGrid stroke={GRID_CLR} vertical={false} />
            <XAxis dataKey="pts"
              label={{ value: "Puntos obtenidos en grupos", position: "insideBottom", offset: -8, fill: AXIS_CLR, fontSize: 11 }}
              tick={{ fill: LABEL_CLR, fontSize: 13, fontWeight: 700 }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left"  tick={{ fill: AXIS_CLR, fontSize: 11 }} unit="%" domain={[0, 115]} axisLine={false} tickLine={false}
              label={{ value: "% simulaciones", angle: -90, position: "insideLeft", fill: AXIS_CLR, fontSize: 10 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: MX_GREEN, fontSize: 11 }} unit="%" domain={[0, 110]}
              axisLine={false} tickLine={false}
              label={{ value: "P(clasificar)", angle: 90, position: "insideRight", fill: MX_GREEN, fontSize: 10 }} />
            <Tooltip {...TOOLTIP_STYLE} formatter={(v, n) => [`${v}%`, n]} />
            <Legend wrapperStyle={{ color: LABEL_CLR, fontSize: 11 }} />
            <Bar yAxisId="left" dataKey="pObtener" name="P(obtener X puntos)" maxBarSize={55} radius={[4,4,0,0]}>
              {DATA.map((d, i) => <Cell key={i} fill={colorBar(d)} opacity={0.75} />)}
            </Bar>
            <Line yAxisId="right" dataKey="pClasif" name="P(clasificar directo)" stroke={MX_GREEN}
              strokeWidth={2.5} dot={{ r: 5, fill: MX_GREEN, stroke: "#0f1610", strokeWidth: 2 }} type="monotone" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* tarjetas resumen */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { pts: "9 pts",   pct: "100%", desc: "campeón de grupo",          border: "border-mx-green", text: "text-mx-green" },
          { pts: "6 pts",   pct: "97.6%", desc: "clasificación prácticamente asegurada", border: "border-mx-green", text: "text-mx-green" },
          { pts: "4 pts",   pct: "57.3%", desc: "en zona de riesgo",         border: "border-mx-gold",  text: "text-mx-gold"  },
          { pts: "3 pts",   pct: "6.8%",  desc: "casi descartado",           border: "border-mx-red",   text: "text-mx-red"   },
        ].map((s) => (
          <div key={s.pts} className={`bg-mx-card border ${s.border} rounded-xl p-4 text-center`}>
            <p className={`text-2xl font-black ${s.text}`}>{s.pct}</p>
            <p className="text-sm font-bold text-white mt-0.5">{s.pts}</p>
            <p className="text-xs text-gray-500 mt-1">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-5 bg-mx-green/5 border border-mx-green/20 rounded-xl">
        <p className="text-sm text-gray-300 leading-relaxed">
          <span className="text-mx-green font-bold">La esperanza:</span> El escenario más probable es 4 puntos (20.6%).
          Con esos 4 puntos hay 57% de clasificar directamente. Para la afición: los 9 puntos están ahí.
          Solo hay que ir a por ellos desde el primer minuto del primer partido.
        </p>
      </div>
    </SectionWrapper>
  );
}
