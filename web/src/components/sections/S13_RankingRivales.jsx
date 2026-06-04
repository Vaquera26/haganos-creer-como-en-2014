import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ScatterChart, Scatter, ZAxis, ResponsiveContainer } from "recharts";
import SectionWrapper from "../ui/SectionWrapper.jsx";
import Flag from "../ui/Flag.jsx";
import { MX_GREEN, MX_RED, MX_GOLD, MX_BLUE, AXIS_CLR, GRID_CLR, LABEL_CLR, TOOLTIP_STYLE } from "../../theme.js";

// Datos exactos output Python script 13
const RIVALES = [
  { rival: "Haití",              flagCode: "ht", rank: 90,  ronda: "R16", pMx: 86.0 },
  { rival: "Qatar",              flagCode: "qa", rank: 71,  ronda: "R32", pMx: 83.0 },
  { rival: "Bosnia-Herzegovina", flagCode: "ba", rank: 62,  ronda: "R32", pMx: 80.5 },
  { rival: "Australia",          flagCode: "au", rank: 31,  ronda: "R16", pMx: 62.7 },
  { rival: "Paraguay",           flagCode: "py", rank: 30,  ronda: "R16", pMx: 61.9 },
  { rival: "Escocia",            flagCode: "gb-sct", rank: 28, ronda: "R16", pMx: 60.1 },
  { rival: "Turquía",            flagCode: "tr", rank: 23,  ronda: "R16", pMx: 55.4 },
  { rival: "Canadá",             flagCode: "ca", rank: 22,  ronda: "R32", pMx: 54.4 },
  { rival: "Ecuador",            flagCode: "ec", rank: 21,  ronda: "R16", pMx: 53.5 },
  { rival: "Japón",              flagCode: "jp", rank: 19,  ronda: "R16", pMx: 51.4 },
  { rival: "Senegal",            flagCode: "sn", rank: 17,  ronda: "R16", pMx: 49.4 },
  { rival: "EUA",                flagCode: "us", rank: 16,  ronda: "R16", pMx: 48.4 },
  { rival: "Suiza",              flagCode: "ch", rank: 14,  ronda: "R32", pMx: 46.3 },
  { rival: "Marruecos",          flagCode: "ma", rank: 13,  ronda: "R16", pMx: 45.3 },
  { rival: "Croacia",            flagCode: "hr", rank: 10,  ronda: "R16", pMx: 42.1 },
  { rival: "Brasil",             flagCode: "br", rank: 4,   ronda: "R16", pMx: 36.3 },
  { rival: "Colombia",           flagCode: "co", rank: 12,  ronda: "QF",  pMx: 34.9 },
  { rival: "Uruguay",            flagCode: "uy", rank: 11,  ronda: "QF",  pMx: 34.2 },
  { rival: "Bélgica",            flagCode: "be", rank: 9,   ronda: "QF",  pMx: 32.8 },
  { rival: "Países Bajos",       flagCode: "nl", rank: 8,   ronda: "QF",  pMx: 32.0 },
  { rival: "Alemania",           flagCode: "de", rank: 7,   ronda: "QF",  pMx: 31.3 },
  { rival: "Portugal",           flagCode: "pt", rank: 6,   ronda: "SF",  pMx: 30.6 },
  { rival: "Inglaterra",         flagCode: "gb-eng", rank: 5, ronda: "SF", pMx: 29.9 },
  { rival: "España",             flagCode: "es", rank: 3,   ronda: "SF",  pMx: 28.4 },
  { rival: "Francia",            flagCode: "fr", rank: 2,   ronda: "QF",  pMx: 27.7 },
  { rival: "Argentina",          flagCode: "ar", rank: 1,   ronda: "QF",  pMx: 27.0 },
];

const barColor = (p) => {
  if (p >= 65) return MX_GREEN;
  if (p >= 45) return MX_GOLD;
  if (p >= 33) return "#f97316";
  return MX_RED;
};

const rondaClr = { R32: MX_GREEN, R16: MX_BLUE, QF: MX_GOLD, SF: "#f97316" };

export default function S13_RankingRivales() {
  return (
    <SectionWrapper
      id="s13" number={13} accent="gold"
      title="Ranking de Rivales Más Peligrosos"
      subtitle="26 posibles rivales en eliminatoria. P(México gana) ajustada por ronda y ventaja local. Datos exactos del modelo Python."
      quote="El peor escenario: Argentina en cuartos con el 27%. El mejor: Qatar en R32 con el 83%. La llave importa tanto como el talento."
    >
      {/* barras horizontales - top 15 */}
      <div className="bg-mx-card border border-mx-border rounded-2xl p-5 mb-4">
        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">
          P(México gana el partido) — todos los posibles rivales
        </p>
        <ResponsiveContainer width="100%" height={520}>
          <BarChart data={[...RIVALES].reverse()} layout="vertical"
            margin={{ top: 0, right: 60, left: 130, bottom: 0 }}>
            <CartesianGrid horizontal={false} stroke={GRID_CLR} />
            <XAxis type="number" domain={[0, 100]} tick={{ fill: AXIS_CLR, fontSize: 11 }} unit="%" axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="rival" tick={{ fill: LABEL_CLR, fontSize: 11, fontWeight: 600 }}
              width={130} axisLine={false} tickLine={false} />
            <Tooltip {...TOOLTIP_STYLE} formatter={(v, n, p) => [`${v}%`, `P(México gana) — ${p.payload.ronda}`]} />
            <Bar dataKey="pMx" radius={[0, 4, 4, 0]}
              label={{ position: "right", formatter: (v) => `${v}%`, fill: "#9ca3af", fontSize: 10, fontWeight: 700 }}>
              {[...RIVALES].reverse().map((r, i) => (
                <Cell key={i} fill={barColor(r.pMx)} opacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* leyenda colores */}
        <div className="flex gap-4 mt-3 flex-wrap">
          {[
            { color: MX_GREEN, label: "Favorable (≥65%)" },
            { color: MX_GOLD,  label: "Equilibrado (45-64%)" },
            { color: "#f97316", label: "Difícil (33-44%)" },
            { color: MX_RED,   label: "Muy difícil (<33%)" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: l.color }} />
              {l.label}
            </div>
          ))}
        </div>
      </div>

      {/* escenarios mejor/peor */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-mx-card border border-mx-green/30 rounded-xl p-5">
          <p className="text-xs text-mx-green font-bold uppercase tracking-widest mb-3">Ruta ideal (si termina 1ro)</p>
          <div className="space-y-2">
            {[{ r: "R32", e: "Qatar",   f: "qa", p: 83.0 }, { r: "R16", e: "Haití",  f: "ht", p: 86.0 }, { r: "QF",  e: "Escocia", f: "gb-sct", p: 60.1 }].map((x) => (
              <div key={x.r} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-600 w-8">{x.r}</span>
                <Flag code={x.f} className="w-6 h-4 rounded" alt={x.e} />
                <span className="text-sm text-gray-300 flex-1">{x.e}</span>
                <span className="text-sm font-black text-mx-green">{x.p}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-mx-card border border-mx-red/30 rounded-xl p-5">
          <p className="text-xs text-mx-red font-bold uppercase tracking-widest mb-3">Ruta pesadilla (si termina 2do)</p>
          <div className="space-y-2">
            {[{ r: "R32", e: "Suiza",   f: "ch", p: 46.3 }, { r: "R16", e: "Brasil",    f: "br", p: 36.3 }, { r: "QF",  e: "Argentina", f: "ar", p: 27.0 }].map((x) => (
              <div key={x.r} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-600 w-8">{x.r}</span>
                <Flag code={x.f} className="w-6 h-4 rounded" alt={x.e} />
                <span className="text-sm text-gray-300 flex-1">{x.e}</span>
                <span className="text-sm font-black text-mx-red">{x.p}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 p-5 bg-mx-green/5 border border-mx-green/20 rounded-xl">
        <p className="text-sm text-gray-300 leading-relaxed">
          <span className="text-mx-green font-bold">La esperanza:</span> Terminar primero del Grupo A aleja a México de Argentina, Francia y Brasil
          en el lado del bracket. En el escenario ideal — Qatar (R32), Haití (R16), Escocia (QF) — México tendría más del 70% en promedio
          de pasar cada ronda. Ese camino existe. Solo hay que construirlo desde el 11 de junio.
        </p>
      </div>
    </SectionWrapper>
  );
}
