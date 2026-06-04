import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, PieChart, Pie, Legend, ResponsiveContainer } from "recharts";
import SectionWrapper from "../ui/SectionWrapper.jsx";
import { MX_GREEN, MX_RED, MX_GOLD, AXIS_CLR, GRID_CLR, LABEL_CLR, TOOLTIP_STYLE } from "../../theme.js";

const DATA = [
  { etapa: "Grupos",   pLlegar: 100.0, pElim: 24.0,  fill: MX_RED   },
  { etapa: "R32 (J4)", pLlegar: 76.0,  pElim: 32.6,  fill: "#6b7280"  },
  { etapa: "R16 (J5)", pLlegar: 43.4,  pElim: 18.3,  fill: MX_GOLD  },
  { etapa: "QF (J6)",  pLlegar: 25.1,  pElim: 14.8,  fill: MX_GOLD  },
  { etapa: "SF (J7)",  pLlegar: 10.3,  pElim: 6.4,   fill: MX_GREEN },
  { etapa: "Final(J8)",pLlegar: 3.9,   pElim: 2.5,   fill: MX_GREEN },
  { etapa: "Campeón",  pLlegar: 1.4,   pElim: 1.4,   fill: MX_GREEN },
];

const PIE_DATA = DATA.map((d) => ({ name: d.etapa, value: d.pElim }));

const CustomLabel = ({ viewBox, value }) => {
  const { x, y, width, height } = viewBox;
  return (
    <text x={x + width + 6} y={y + height / 2 + 5} fill="#c9d1d9" fontSize={11} fontWeight={700}>
      {value}%
    </text>
  );
};

export default function S01_RutaQuintoPartido() {
  return (
    <SectionWrapper
      id="s01" number={1} accent="gold"
      title="La Ruta del Quinto Partido"
      subtitle="100,000 torneos simulados. En cuántos llega México a cada ronda."
      quote="7 octavos. 7 decepciones. El penal de Robben fue el último. Esta vez tiene que ser distinto."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* bar chart principal */}
        <div className="lg:col-span-2 bg-mx-card border border-mx-border rounded-2xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">
            % de 100,000 simulaciones que llegan a cada ronda
          </p>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={DATA} layout="vertical" margin={{ top: 0, right: 60, left: 10, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke={GRID_CLR} />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: AXIS_CLR, fontSize: 11 }} tickLine={false} axisLine={false} unit="%" />
              <YAxis type="category" dataKey="etapa" tick={{ fill: LABEL_CLR, fontSize: 12, fontWeight: 600 }} width={80} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`${v}%`, "P(llegar)"]} />
              <Bar dataKey="pLlegar" radius={[0, 4, 4, 0]} label={{ position: "right", formatter: (v) => `${v}%`, fill: "#c9d1d9", fontSize: 11, fontWeight: 700 }}>
                {DATA.map((d, i) => (
                  <Cell key={i} fill={d.fill} opacity={d.etapa.includes("R16") ? 1 : 0.75} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 flex items-center gap-2 px-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: MX_GOLD }} />
            <span className="text-xs text-gray-500">← La maldición: R16 (Juego 5). 0 de 7 mundiales superado.</span>
          </div>
        </div>

        {/* pie distribución eliminaciones */}
        <div className="bg-mx-card border border-mx-border rounded-2xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">
            Dónde termina México
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={95}
                dataKey="value" nameKey="name" paddingAngle={2}>
                {PIE_DATA.map((d, i) => (
                  <Cell key={i} fill={DATA[i].fill} opacity={0.85} />
                ))}
              </Pie>
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`${v}%`, "eliminados aquí"]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {DATA.map((d) => (
              <div key={d.etapa} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.fill }} />
                  <span className="text-gray-400">{d.etapa}</span>
                </div>
                <span className="text-gray-500">{d.pElim}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 p-5 bg-mx-green/5 border border-mx-green/20 rounded-xl">
        <p className="text-sm text-gray-300 leading-relaxed">
          <span className="text-mx-green font-bold">La esperanza:</span> En 43,400 de 100,000 simulaciones México llega al dichoso quinto partido.
          Y en 25,100 lo supera. El modelo dice que no es imposible. Solo necesitamos que esta sea una de esas simulaciones.
        </p>
      </div>
    </SectionWrapper>
  );
}
