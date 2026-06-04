import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
  LineChart, Line, Legend, ScatterChart, Scatter,
  ResponsiveContainer, ReferenceLine
} from "recharts";
import SectionWrapper from "../ui/SectionWrapper.jsx";
import { MX_GREEN, MX_RED, MX_GOLD, AXIS_CLR, GRID_CLR, LABEL_CLR, TOOLTIP_STYLE } from "../../theme.js";

// Datos exactos del output Python (columna rendimiento)
const HISTORIA = [
  { año: 1930, ronda: "Grupos",  rondaNum: 1, host: false, rendimiento: 33, gf: 4,  ga: 13 },
  { año: 1950, ronda: "Grupos",  rondaNum: 1, host: false, rendimiento: 0,  gf: 2,  ga: 10 },
  { año: 1954, ronda: "Grupos",  rondaNum: 1, host: false, rendimiento: 0,  gf: 2,  ga: 8  },
  { año: 1958, ronda: "Grupos",  rondaNum: 1, host: false, rendimiento: 11, gf: 1,  ga: 8  },
  { año: 1962, ronda: "Grupos",  rondaNum: 1, host: false, rendimiento: 33, gf: 3,  ga: 9  },
  { año: 1966, ronda: "Grupos",  rondaNum: 1, host: false, rendimiento: 11, gf: 1,  ga: 5  },
  { año: 1970, ronda: "Cuartos", rondaNum: 4, host: true,  rendimiento: 75, gf: 6,  ga: 4  },
  { año: 1978, ronda: "Grupos",  rondaNum: 1, host: false, rendimiento: 33, gf: 4,  ga: 8  },
  { año: 1986, ronda: "Cuartos", rondaNum: 4, host: true,  rendimiento: 67, gf: 7,  ga: 4  },
  { año: 1994, ronda: "Octavos", rondaNum: 3, host: false, rendimiento: 42, gf: 4,  ga: 4  },
  { año: 1998, ronda: "Octavos", rondaNum: 3, host: false, rendimiento: 58, gf: 10, ga: 5  },
  { año: 2002, ronda: "Octavos", rondaNum: 3, host: false, rendimiento: 58, gf: 7,  ga: 3  },
  { año: 2006, ronda: "Octavos", rondaNum: 3, host: false, rendimiento: 58, gf: 7,  ga: 5  },
  { año: 2010, ronda: "Octavos", rondaNum: 3, host: false, rendimiento: 67, gf: 8,  ga: 7  },
  { año: 2014, ronda: "Octavos", rondaNum: 3, host: false, rendimiento: 58, gf: 5,  ga: 5  },
  { año: 2018, ronda: "Octavos", rondaNum: 3, host: false, rendimiento: 50, gf: 4,  ga: 4  },
  { año: 2022, ronda: "Grupos",  rondaNum: 1, host: false, rendimiento: 44, gf: 2,  ga: 3  },
];

const colorBar = (d) => {
  if (d.host) return MX_GOLD;
  if (d.rondaNum >= 3 && !d.host) return "#3b82f6";
  if (d.año === 2022) return MX_RED;
  return "#374151";
};

export default function S07_MexicoVsHistoria() {
  return (
    <SectionWrapper
      id="s07" number={7} accent="gold"
      title="México contra su Historia"
      subtitle="17 mundiales. Solo dos veces cuartos de final. Las dos como sede. 2026 es la tercera oportunidad."
      quote="1970. 1986. Los dos mejores mundiales de México fueron en México. El Azteca sabe cómo se llega lejos."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ronda alcanzada por año */}
        <div className="bg-mx-card border border-mx-border rounded-2xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">
            Ronda alcanzada por Mundial (1=Grupos, 3=Octavos, 4=Cuartos)
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={HISTORIA} margin={{ top: 8, right: 8, left: -20, bottom: 20 }}>
              <CartesianGrid vertical={false} stroke={GRID_CLR} />
              <XAxis dataKey="año" tick={{ fill: AXIS_CLR, fontSize: 9 }} angle={-45} textAnchor="end" interval={0} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4]} tickFormatter={(v) => ["", "Grupos", "2da R.", "Octavos", "Cuartos"][v]}
                tick={{ fill: LABEL_CLR, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v, n, p) => [p.payload.ronda, "Ronda"]} />
              <ReferenceLine y={3} stroke={MX_RED} strokeDasharray="4 4" opacity={0.5} label={{ value: "techo histórico", fill: MX_RED, fontSize: 9, position: "right" }} />
              <Bar dataKey="rondaNum" radius={[3, 3, 0, 0]} maxBarSize={28}>
                {HISTORIA.map((d, i) => <Cell key={i} fill={colorBar(d)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-3 mt-2 flex-wrap">
            {[{ c: MX_GOLD, l: "Sede" }, { c: "#3b82f6", l: "Octavos/Cuartos" }, { c: MX_RED, l: "Qatar 2022" }, { c: "#374151", l: "Grupos" }].map((l) => (
              <div key={l.l} className="flex items-center gap-1.5 text-xs text-gray-500">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: l.c }} />
                {l.l}
              </div>
            ))}
          </div>
        </div>

        {/* rendimiento por año */}
        <div className="bg-mx-card border border-mx-border rounded-2xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">
            Rendimiento general (% puntos posibles) + GF/GA
          </p>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={HISTORIA} margin={{ top: 8, right: 16, left: -20, bottom: 20 }}>
              <CartesianGrid stroke={GRID_CLR} vertical={false} />
              <XAxis dataKey="año" tick={{ fill: AXIS_CLR, fontSize: 9 }} angle={-45} textAnchor="end" interval={0} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: LABEL_CLR, fontSize: 10 }} unit="%" axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v, n) => [`${v}%`, n]} />
              <Legend wrapperStyle={{ color: LABEL_CLR, fontSize: 11 }} />
              <ReferenceLine x={1993} stroke={AXIS_CLR} strokeDasharray="4 4" opacity={0.3} />
              <Line dataKey="rendimiento" name="Rendimiento %" stroke={MX_GREEN} strokeWidth={2}
                dot={(p) => <circle key={p.key} cx={p.cx} cy={p.cy} r={p.payload.host ? 5 : 3}
                  fill={p.payload.host ? MX_GOLD : MX_GREEN} stroke="none" />}
                type="monotone" />
            </LineChart>
          </ResponsiveContainer>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="border border-mx-gold/30 rounded-lg p-3 text-center">
              <p className="text-2xl font-black text-mx-gold">4.20</p>
              <p className="text-xs text-gray-500">ronda prom. como sede</p>
            </div>
            <div className="border border-zinc-700 rounded-lg p-3 text-center">
              <p className="text-2xl font-black text-zinc-400">2.75</p>
              <p className="text-xs text-gray-500">ronda prom. fuera (1994-2018)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-5 bg-mx-green/5 border border-mx-green/20 rounded-xl">
        <p className="text-sm text-gray-300 leading-relaxed">
          <span className="text-mx-green font-bold">La esperanza:</span> Las dos veces que México llegó a cuartos jugó en casa.
          El patrón no miente: con el Azteca a favor, el techo histórico sube. 2026 es la tercera oportunidad de probarlo.
        </p>
      </div>
    </SectionWrapper>
  );
}
