import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import SectionWrapper from "../ui/SectionWrapper.jsx";
import { MX_GREEN, MX_RED, MX_GOLD, MX_BLUE, AXIS_CLR, GRID_CLR, LABEL_CLR, TOOLTIP_STYLE } from "../../theme.js";

// Datos exactos del output Python
const PUNTOS_DATA = [
  { pts: "0", pObtener: 2.5,  pClasif: 0,    posPromedio: 4.00 },
  { pts: "1", pObtener: 7.0,  pClasif: 0,    posPromedio: 3.92 },
  { pts: "2", pObtener: 6.5,  pClasif: 1.5,  posPromedio: 3.49 },
  { pts: "3", pObtener: 13.3, pClasif: 6.8,  posPromedio: 3.22 },
  { pts: "4", pObtener: 20.6, pClasif: 57.3, posPromedio: 2.41 },
  { pts: "5", pObtener: 9.6,  pClasif: 98.9, posPromedio: 1.57 },
  { pts: "6", pObtener: 16.8, pClasif: 97.6, posPromedio: 1.55 },
  { pts: "7", pObtener: 15.5, pClasif: 100,  posPromedio: 1.06 },
  { pts: "9", pObtener: 8.3,  pClasif: 100,  posPromedio: 1.00 },
];

// Escenarios J1 × J2
const ESCENARIOS = [
  { j1: "G", j2: "G", pClasif: 99 }, { j1: "G", j2: "E", pClasif: 81 }, { j1: "G", j2: "P", pClasif: 56 },
  { j1: "E", j2: "G", pClasif: 81 }, { j1: "E", j2: "E", pClasif: 28 }, { j1: "E", j2: "P", pClasif: 8  },
  { j1: "P", j2: "G", pClasif: 56 }, { j1: "P", j2: "E", pClasif: 8  }, { j1: "P", j2: "P", pClasif: 2  },
];

const colorPts = (p) => {
  if (p >= 80) return MX_GREEN;
  if (p >= 40) return MX_GOLD;
  return MX_RED;
};

const RJ = { G: { bg: "bg-mx-green", txt: "text-white" }, E: { bg: "bg-mx-gold", txt: "text-black" }, P: { bg: "bg-mx-red", txt: "text-white" } };

export default function S04_EscenariosClasificacion() {
  return (
    <SectionWrapper
      id="s04" number={4} accent="green"
      title="Escenarios de Clasificación"
      subtitle="Distribución de puntos (100k sims) y P(clasificar) por puntuación. Con 4 pts hay 57% de chance directo."
      quote="Con 6 puntos clasificamos sin ver el marcador de los otros. Con 3 puntos, necesitamos mirar la pantalla del estadio."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ComposedChart: barras pObtener + línea pClasif */}
        <div className="bg-mx-card border border-mx-border rounded-2xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">
            Distribución de puntos y P(clasificar directo)
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={PUNTOS_DATA} margin={{ top: 8, right: 40, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={GRID_CLR} vertical={false} />
              <XAxis dataKey="pts" label={{ value: "Puntos", position: "insideBottom", offset: -4, fill: AXIS_CLR, fontSize: 11 }}
                tick={{ fill: LABEL_CLR, fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fill: AXIS_CLR, fontSize: 11 }} axisLine={false} tickLine={false} unit="%" domain={[0, 110]} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: MX_GREEN, fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v, n) => [`${v}%`, n]} />
              <Legend wrapperStyle={{ color: LABEL_CLR, fontSize: 11 }} />
              <Bar yAxisId="left" dataKey="pObtener" name="P(obtener X pts)" radius={[4, 4, 0, 0]} fill={MX_BLUE} opacity={0.7} />
              <Line yAxisId="right" dataKey="pClasif" name="P(clasificar)" stroke={MX_GREEN} strokeWidth={2.5}
                dot={{ r: 4, fill: MX_GREEN }} type="monotone" />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-3 grid grid-cols-3 gap-3 text-center">
            <div className="bg-mx-green/10 border border-mx-green/30 rounded-lg py-2">
              <p className="text-xl font-black text-mx-green">62.5%</p>
              <p className="text-xs text-gray-500">clasifica directo</p>
            </div>
            <div className="bg-mx-gold/10 border border-mx-gold/30 rounded-lg py-2">
              <p className="text-xl font-black text-mx-gold">74.2%</p>
              <p className="text-xs text-gray-500">total (incl. 3ro)</p>
            </div>
            <div className="bg-zinc-800 rounded-lg py-2">
              <p className="text-xl font-black text-gray-300">20.6%</p>
              <p className="text-xs text-gray-500">termina con 4pts</p>
            </div>
          </div>
        </div>

        {/* matriz J1 × J2 */}
        <div className="bg-mx-card border border-mx-border rounded-2xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2">
            P(clasificar) según resultado de los primeros 2 partidos
          </p>
          <div className="flex gap-2 mb-3 text-xs text-gray-600">
            <span>J1 = vs Sudáfrica · J2 = vs Corea</span>
          </div>

          {/* encabezados J2 */}
          <div className="grid grid-cols-4 gap-1 mb-1">
            <div />
            {["G", "E", "P"].map((r) => (
              <div key={r} className={`text-center text-xs font-black py-1 rounded ${RJ[r].bg} ${RJ[r].txt}`}>{r}</div>
            ))}
          </div>

          {/* filas J1 */}
          {["G", "E", "P"].map((r1) => (
            <div key={r1} className="grid grid-cols-4 gap-1 mb-1">
              <div className={`text-center text-xs font-black py-2 rounded ${RJ[r1].bg} ${RJ[r1].txt}`}>{r1}</div>
              {["G", "E", "P"].map((r2) => {
                const esc = ESCENARIOS.find((e) => e.j1 === r1 && e.j2 === r2);
                const p = esc?.pClasif ?? 0;
                const alpha = p / 100;
                const color = p >= 80 ? MX_GREEN : p >= 40 ? MX_GOLD : MX_RED;
                return (
                  <div key={r2} className="rounded-lg flex flex-col items-center justify-center py-3"
                    style={{ backgroundColor: `${color}${Math.round(alpha * 200).toString(16).padStart(2, "0")}` }}>
                    <span className="text-lg font-black text-white">{p}%</span>
                    <span className="text-xs text-white/60">{r1}-{r2}</span>
                  </div>
                );
              })}
            </div>
          ))}

          <p className="text-xs text-gray-600 mt-3">G=gana · E=empata · P=pierde</p>
        </div>
      </div>

      <div className="mt-6 p-5 bg-mx-green/5 border border-mx-green/20 rounded-xl">
        <p className="text-sm text-gray-300 leading-relaxed">
          <span className="text-mx-green font-bold">La esperanza:</span> El escenario más probable es terminar con 4 puntos (20.6% de las sims).
          Con 4 puntos hay 57% de clasificar directo. No es seguro, pero es el escenario más realista.
          La respuesta: ganar los dos primeros partidos y al tercero entrar a festejar.
        </p>
      </div>
    </SectionWrapper>
  );
}
