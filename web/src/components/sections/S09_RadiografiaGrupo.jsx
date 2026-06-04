import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from "recharts";
import SectionWrapper from "../ui/SectionWrapper.jsx";
import Flag from "../ui/Flag.jsx";
import { MX_GREEN, MX_RED, MX_GOLD, MX_BLUE, AXIS_CLR, GRID_CLR, LABEL_CLR, TOOLTIP_STYLE } from "../../theme.js";

const EQUIPOS = [
  { nombre: "México",        flagCode: "mx", rank: 15, elo: 1688, forma: 77, xg: 1.65, xga: 0.72, mundiales: 18, color: MX_GREEN },
  { nombre: "Corea del Sur", flagCode: "kr", rank: 25, elo: 1600, forma: 58, xg: 1.35, xga: 0.98, mundiales: 11, color: MX_RED   },
  { nombre: "Chequia",       flagCode: "cz", rank: 41, elo: 1488, forma: 47, xg: 1.15, xga: 1.12, mundiales: 10, color: MX_BLUE  },
  { nombre: "Sudáfrica",     flagCode: "za", rank: 60, elo: 1352, forma: 38, xg: 0.98, xga: 1.35, mundiales: 4,  color: MX_GOLD  },
];

// radar: escala 0-10 por métrica
const radar = (eq) => ({
  subject: eq.nombre,
  Ranking: (101 - eq.rank) / 100 * 10,
  Ataque:  Math.min(10, eq.xg / 2 * 10),
  Defensa: Math.max(0, (2 - eq.xga) / 1.5 * 10),
  Forma:   eq.forma / 10,
  Experiencia: Math.min(10, eq.mundiales / 2),
});

const RADAR_DATA = [
  { subject: "Ranking",    ...Object.fromEntries(EQUIPOS.map((e) => [e.nombre, radar(e).Ranking]))    },
  { subject: "Ataque",     ...Object.fromEntries(EQUIPOS.map((e) => [e.nombre, radar(e).Ataque]))     },
  { subject: "Defensa",    ...Object.fromEntries(EQUIPOS.map((e) => [e.nombre, radar(e).Defensa]))    },
  { subject: "Forma",      ...Object.fromEntries(EQUIPOS.map((e) => [e.nombre, radar(e).Forma]))      },
  { subject: "Experiencia",...Object.fromEntries(EQUIPOS.map((e) => [e.nombre, radar(e).Experiencia]))},
];

// output Python: cruce de partidos
const CRUCES = [
  { partido: "MX vs SUD", gMx: 80.1, empate: 13.8, gRival: 6.2   },
  { partido: "KOR vs MX", gMx: 47.4, empate: 22.8, gRival: 29.9  },
  { partido: "CZE vs MX", gMx: 62.7, empate: 18.3, gRival: 18.9  },
];

export default function S09_RadiografiaGrupo() {
  return (
    <SectionWrapper
      id="s09" number={9} accent="green"
      title="Radiografía del Grupo A"
      subtitle="Comparativa completa de los 4 equipos. México domina todas las métricas. El grupo más accesible desde 1986."
      quote="Este grupo no es un regalo. Pero tampoco es Argentina, Francia y Brasil. Es el grupo que México necesitaba."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* radar de los 4 equipos */}
        <div className="bg-mx-card border border-mx-border rounded-2xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2">
            Perfil comparativo Grupo A (escala 0-10)
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={RADAR_DATA} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
              <PolarGrid stroke={GRID_CLR} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: LABEL_CLR, fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: AXIS_CLR, fontSize: 9 }} />
              {EQUIPOS.map((eq) => (
                <Radar key={eq.nombre} name={eq.nombre} dataKey={eq.nombre}
                  stroke={eq.color} fill={eq.color}
                  fillOpacity={eq.nombre === "México" ? 0.30 : 0.08}
                  strokeWidth={eq.nombre === "México" ? 2.5 : 1.2} />
              ))}
              <Tooltip {...TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ color: LABEL_CLR, fontSize: 11 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* tabla + probabilidades de cruces */}
        <div className="space-y-4">
          {/* tabla */}
          <div className="bg-mx-card border border-mx-border rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-mx-border">
                  <th className="text-left py-2.5 px-4 text-xs text-gray-500">Equipo</th>
                  <th className="text-center py-2.5 px-2 text-xs text-gray-500">FIFA</th>
                  <th className="text-center py-2.5 px-2 text-xs text-gray-500">Elo</th>
                  <th className="text-center py-2.5 px-2 text-xs text-gray-500">Forma</th>
                </tr>
              </thead>
              <tbody>
                {EQUIPOS.map((eq) => (
                  <tr key={eq.nombre} className="border-b border-mx-border/40 last:border-0">
                    <td className="py-2.5 px-4">
                      <div className="flex items-center gap-2">
                        <Flag code={eq.flagCode} className="w-7 h-5 rounded shadow-sm" alt={eq.nombre} />
                        <span className={`font-bold ${eq.nombre === "México" ? "text-mx-green" : "text-white"}`}>
                          {eq.nombre}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-2 text-center font-bold text-white">#{eq.rank}</td>
                    <td className="py-2.5 px-2 text-center text-gray-400">{eq.elo}</td>
                    <td className="py-2.5 px-2 text-center">
                      <span className={`font-bold ${eq.forma >= 70 ? "text-mx-green" : eq.forma >= 50 ? "text-mx-gold" : "text-gray-500"}`}>
                        {eq.forma}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* probabilidades de los cruces que involucran a México */}
          <div className="bg-mx-card border border-mx-border rounded-2xl p-5">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">
              P(México gana) en cada cruce del grupo
            </p>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={CRUCES} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid horizontal={false} stroke={GRID_CLR} />
                <XAxis dataKey="partido" tick={{ fill: LABEL_CLR, fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: AXIS_CLR, fontSize: 10 }} unit="%" axisLine={false} tickLine={false} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Bar dataKey="gMx"    name="México gana"  fill={MX_GREEN} stackId="a" radius={[0,0,0,0]} />
                <Bar dataKey="empate" name="Empate"        fill={MX_GOLD}  stackId="a" />
                <Bar dataKey="gRival" name="Rival gana"    fill={MX_RED}   stackId="a" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 p-5 bg-mx-green/5 border border-mx-green/20 rounded-xl">
        <p className="text-sm text-gray-300 leading-relaxed">
          <span className="text-mx-green font-bold">La esperanza:</span> México tiene ventaja en Ranking, Ataque, Defensa y Forma sobre los tres rivales.
          El único punto donde Corea del Sur se acerca es en Experiencia. Pero la experiencia se hace en el campo, no en el papel.
        </p>
      </div>
    </SectionWrapper>
  );
}
