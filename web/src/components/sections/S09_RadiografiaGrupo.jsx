import SectionWrapper from "../ui/SectionWrapper.jsx";
import Flag from "../ui/Flag.jsx";
import RadarChart from "../ui/RadarChart.jsx";
import { GRUPO_A } from "../../data/analisis.js";

const METRICAS = [
  { key: "rank",   label: "Ranking\n(inv.)", fn: (v) => (101 - v.rank) / 100 * 10,  max: 10 },
  { key: "xg",     label: "Ataque\n(xG)",   fn: (v) => Math.min(10, v.xg / 2 * 10), max: 10 },
  { key: "xga",    label: "Defensa\n(inv)", fn: (v) => Math.max(0, (2 - v.xga) / 1.5 * 10), max: 10 },
  { key: "forma",  label: "Forma\nreciente",fn: (v) => v.forma / 10,                 max: 10 },
  { key: "mundiales", label: "Experiencia\nWC", fn: (v) => Math.min(10, v.mundiales / 2), max: 10 },
];

const TEAM_COLORS = {
  "México": "#006847", "Corea del Sur": "#CE1126", "Chequia": "#58a6ff", "Sudáfrica": "#FFD700",
};

export default function S09_RadiografiaGrupo() {
  const datasets = GRUPO_A.map((eq) => ({
    values: METRICAS.map((m) => m.fn(eq)),
    color: TEAM_COLORS[eq.nombre],
    opacity: eq.nombre === "México" ? 0.30 : 0.08,
    strokeWidth: eq.nombre === "México" ? 2.5 : 1.2,
  }));

  return (
    <SectionWrapper
      id="s09"
      number={9}
      accent="green"
      title="Radiografía del Grupo A"
      subtitle="Cuatro selecciones. Un análisis comparativo de ataque, defensa, forma y experiencia. El grupo más accesible de México desde 1986."
      quote="Este grupo no es un regalo, pero tampoco es Argentina. Es el grupo que México necesitaba."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* radar */}
        <div className="bg-mx-card border border-mx-border rounded-2xl p-6 flex flex-col items-center">
          <RadarChart datasets={datasets} labels={METRICAS.map((m) => m.label)} size={280} max={10} />
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {GRUPO_A.map((eq) => (
              <div key={eq.nombre} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: TEAM_COLORS[eq.nombre] }} />
                <span className="text-xs text-gray-400">{eq.nombre}</span>
              </div>
            ))}
          </div>
        </div>

        {/* tabla comparativa */}
        <div className="bg-mx-card border border-mx-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-mx-border">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500">Equipo</th>
                  <th className="text-center py-3 px-3 text-xs font-semibold text-gray-500">FIFA</th>
                  <th className="text-center py-3 px-3 text-xs font-semibold text-gray-500">Elo</th>
                  <th className="text-center py-3 px-3 text-xs font-semibold text-gray-500">Forma</th>
                  <th className="text-center py-3 px-3 text-xs font-semibold text-gray-500">WC</th>
                </tr>
              </thead>
              <tbody>
                {GRUPO_A.map((eq, i) => {
                  const isMx = eq.nombre === "México";
                  return (
                    <tr key={eq.nombre}
                      className={`border-b border-mx-border/50 last:border-0 ${isMx ? "bg-mx-green/5" : ""}`}>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <Flag code={eq.flagCode} className="w-7 h-5 rounded shadow-sm" alt={eq.nombre} />
                          <div>
                            <p className={`text-sm font-bold ${isMx ? "text-mx-green" : "text-white"}`}>{eq.nombre}</p>
                            <p className="text-xs text-gray-600">{eq.mejor}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className={`text-sm font-black ${isMx ? "text-mx-green" : "text-gray-300"}`}>#{eq.rank}</span>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className="text-sm text-gray-400">{eq.elo}</span>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-sm font-bold ${eq.forma >= 70 ? "text-mx-green" : eq.forma >= 50 ? "text-mx-gold" : "text-gray-500"}`}>
                            {eq.forma}%
                          </span>
                          <div className="w-12 h-1 bg-zinc-800 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${eq.forma >= 70 ? "bg-mx-green" : eq.forma >= 50 ? "bg-mx-gold" : "bg-zinc-600"}`}
                              style={{ width: `${eq.forma}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className="text-sm text-gray-400">{eq.mundiales}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6 p-5 bg-mx-green/5 border border-mx-green/20 rounded-xl">
        <p className="text-sm text-gray-300 leading-relaxed">
          <span className="text-mx-green font-bold">La esperanza:</span> México domina en todas las métricas del Grupo A.
          Con 462 puntos de diferencia Elo sobre Sudáfrica, 288 sobre Chequia y 88 sobre Corea del Sur.
          En papel, es el grupo que México puede y debe ganar.
        </p>
      </div>
    </SectionWrapper>
  );
}
