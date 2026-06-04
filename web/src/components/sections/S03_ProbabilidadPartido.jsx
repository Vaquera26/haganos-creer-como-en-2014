import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from "recharts";
import SectionWrapper from "../ui/SectionWrapper.jsx";
import Flag from "../ui/Flag.jsx";
import { MX_GREEN, MX_RED, MX_GOLD, AXIS_CLR, GRID_CLR, LABEL_CLR, TOOLTIP_STYLE } from "../../theme.js";

const PARTIDOS = [
  {
    rival: "Sudáfrica", flagCode: "za", rank: 60, fecha: "11 Jun", sede: "Azteca",
    xgMx: 1.45, xgRival: 0.99,
    gana: 47.5, empata: 26.6, pierde: 25.9,
    marcadores: [{ m: "1-0", p: 12.7 }, { m: "1-1", p: 12.6 }, { m: "2-1", p: 9.0 }, { m: "2-0", p: 8.1 }],
  },
  {
    rival: "Corea del Sur", flagCode: "kr", rank: 25, fecha: "18 Jun", sede: "Guadalajara",
    xgMx: 1.27, xgRival: 1.13,
    gana: 40.1, empata: 27.2, pierde: 32.7,
    marcadores: [{ m: "1-1", p: 12.9 }, { m: "1-0", p: 11.6 }, { m: "0-1", p: 10.2 }, { m: "2-1", p: 8.4 }],
  },
  {
    rival: "Chequia", flagCode: "cz", rank: 41, fecha: "24 Jun", sede: "Azteca",
    xgMx: 1.35, xgRival: 1.07,
    gana: 43.4, empata: 27.3, pierde: 29.3,
    marcadores: [{ m: "1-1", p: 12.9 }, { m: "1-0", p: 11.8 }, { m: "0-1", p: 9.5 }, { m: "2-1", p: 9.3 }],
  },
];

const CHART_DATA = PARTIDOS.map((p) => ({
  rival: p.rival,
  Gana: p.gana, Empata: p.empata, Pierde: p.pierde,
}));

export default function S03_ProbabilidadPartido() {
  return (
    <SectionWrapper
      id="s03" number={3} accent="green"
      title="Probabilidad por Partido"
      subtitle="Modelo Elo + ventaja local + altitud. Probabilidades de cada resultado en los 3 partidos de grupos."
      quote="El de Corea del Sur es el partido más importante. Define si México llega primero o segundo al eliminatorio."
    >
      {/* stacked bar chart */}
      <div className="bg-mx-card border border-mx-border rounded-2xl p-5 mb-4">
        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">
          Distribución de probabilidades por partido
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={CHART_DATA} margin={{ top: 8, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke={GRID_CLR} />
            <XAxis dataKey="rival" tick={{ fill: LABEL_CLR, fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: AXIS_CLR, fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
            <Tooltip {...TOOLTIP_STYLE} formatter={(v, n) => [`${v}%`, n]} />
            <Legend wrapperStyle={{ color: LABEL_CLR, fontSize: 12 }} />
            <ReferenceLine y={50} stroke={AXIS_CLR} strokeDasharray="4 4" opacity={0.4} />
            <Bar dataKey="Gana"   stackId="a" fill={MX_GREEN} radius={[0,0,0,0]} />
            <Bar dataKey="Empata" stackId="a" fill={MX_GOLD}  radius={[0,0,0,0]} />
            <Bar dataKey="Pierde" stackId="a" fill={MX_RED}   radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* cards individuales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {PARTIDOS.map((p) => (
          <div key={p.rival} className="bg-mx-card border border-mx-border rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <Flag code={p.flagCode} className="w-10 h-7 rounded shadow" alt={p.rival} />
              <div>
                <p className="text-sm font-bold text-white">vs {p.rival}</p>
                <p className="text-xs text-gray-500">{p.fecha} · {p.sede} · FIFA #{p.rank}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
              {[
                { label: "Gana", value: p.gana,   color: "text-mx-green", bg: "bg-mx-green/10" },
                { label: "Empata", value: p.empata, color: "text-mx-gold",  bg: "bg-mx-gold/10"  },
                { label: "Pierde", value: p.pierde, color: "text-mx-red",   bg: "bg-mx-red/10"   },
              ].map((r) => (
                <div key={r.label} className={`${r.bg} rounded-lg py-2`}>
                  <p className={`text-xl font-black ${r.color}`}>{r.value}%</p>
                  <p className="text-xs text-gray-500">{r.label}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-mx-border pt-3">
              <p className="text-xs text-gray-600 mb-2">xG: <span className="text-mx-green font-bold">{p.xgMx}</span> — <span className="text-gray-500">{p.xgRival}</span></p>
              <div className="flex gap-1.5 flex-wrap">
                {p.marcadores.map((m) => {
                  const [a, b] = m.m.split("-").map(Number);
                  const cl = a > b ? "border-mx-green/50 text-mx-green" : a === b ? "border-mx-gold/50 text-mx-gold" : "border-mx-red/50 text-mx-red";
                  return (
                    <span key={m.m} className={`border rounded px-2 py-0.5 text-xs font-bold ${cl}`}>
                      {m.m} <span className="opacity-60 font-normal">{m.p}%</span>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-5 bg-mx-green/5 border border-mx-green/20 rounded-xl">
        <p className="text-sm text-gray-300 leading-relaxed">
          <span className="text-mx-green font-bold">La esperanza:</span> Contra Sudáfrica somos favoritos con 80% de ganar (con altitud del Azteca).
          El marcador más probable: 1-0. Un gol diferencia entre empezar el mundial soñando o empezar sufriendo.
        </p>
      </div>
    </SectionWrapper>
  );
}
