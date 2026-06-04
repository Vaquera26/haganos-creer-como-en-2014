import SectionWrapper from "../ui/SectionWrapper.jsx";
import RadarChart from "../ui/RadarChart.jsx";
import { INDICE_RIESGO } from "../../data/analisis.js";

export default function S05_IndiceRiesgo() {
  const { dimensiones } = INDICE_RIESGO;

  const labels = dimensiones.map((d) => d.nombre);
  const datasets = [
    { values: dimensiones.map((d) => d.valorHist),  color: "#4b5563", opacity: 0.15, strokeWidth: 1.5 },
    { values: dimensiones.map((d) => d.valor2022),  color: "#CE1126", opacity: 0.12, strokeWidth: 1.5 },
    { values: dimensiones.map((d) => d.valor2026),  color: "#006847", opacity: 0.30, strokeWidth: 2.5 },
  ];

  const promedio2026 = (dimensiones.reduce((a, d) => a + d.valor2026, 0) / dimensiones.length).toFixed(1);
  const promedioHist = (dimensiones.reduce((a, d) => a + d.valorHist, 0) / dimensiones.length).toFixed(1);

  return (
    <SectionWrapper
      id="s05"
      number={5}
      accent="red"
      title="El Índice de Riesgo de México"
      subtitle="No todos los mundiales tienen el mismo nivel de riesgo. Este índice combina 6 variables para medir qué tan expuesto está México en 2026."
      quote="El mayor riesgo de México no son los rivales. Es la presión de 32 años sin un quinto partido."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* radar */}
        <div className="bg-mx-card border border-mx-border rounded-2xl p-6 flex flex-col items-center">
          <RadarChart datasets={datasets} labels={labels} size={280} max={10} />

          <div className="flex gap-5 mt-4">
            {[
              { color: "#006847", label: "México 2026" },
              { color: "#CE1126", label: "Qatar 2022"  },
              { color: "#4b5563", label: "Promedio histórico" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: l.color }} />
                <span className="text-xs text-gray-400">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* barras por dimensión */}
        <div className="bg-mx-card border border-mx-border rounded-2xl p-6">
          <div className="space-y-4">
            {dimensiones.map((d, i) => {
              const col = d.valor2026 > 7 ? "bg-mx-red" : d.valor2026 > 5 ? "bg-mx-gold" : "bg-mx-green";
              const textCol = d.valor2026 > 7 ? "text-mx-red" : d.valor2026 > 5 ? "text-mx-gold" : "text-mx-green";
              return (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-gray-400">{d.nombre.replace("\n", " ")}</span>
                    <span className={`text-sm font-black ${textCol}`}>{d.valor2026}/10</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${col}`} style={{ width: `${d.valor2026 * 10}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-5 border-t border-mx-border grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-black text-mx-green">{promedio2026}</p>
              <p className="text-xs text-gray-500">Riesgo 2026</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-zinc-500">{promedioHist}</p>
              <p className="text-xs text-gray-500">Promedio histórico</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-5 bg-mx-green/5 border border-mx-green/20 rounded-xl">
        <p className="text-sm text-gray-300 leading-relaxed">
          <span className="text-mx-green font-bold">La esperanza:</span> La única dimensión donde México 2026 baja el riesgo vs el promedio histórico
          es en forma reciente (Nations League + Gold Cup 2025) y dificultad del grupo. No somos favoritos al mundo,
          pero llegamos mejor preparados que nunca.
        </p>
      </div>
    </SectionWrapper>
  );
}
