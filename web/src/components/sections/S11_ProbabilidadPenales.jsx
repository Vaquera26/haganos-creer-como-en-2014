import SectionWrapper from "../ui/SectionWrapper.jsx";
import Flag from "../ui/Flag.jsx";
import { PENALES } from "../../data/analisis.js";

export default function S11_ProbabilidadPenales() {
  return (
    <SectionWrapper
      id="s11"
      number={11}
      accent="red"
      title="La Maldición de los Penales"
      subtitle="0 de 2 en tandas mundialistas. La estadística más oscura de la historia de México."
      quote="Harald Schumacher en 1986. Borislav Mikhailov en 1994. Dos porteros, dos noches eternas. Algún día eso tiene que cambiar."
    >
      {/* historial penales */}
      <div className="bg-mx-card border border-mx-border rounded-2xl overflow-hidden mb-4">
        <div className="p-5 border-b border-mx-border">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Historial en tandas de penales — Mundiales</p>
        </div>
        <div className="divide-y divide-mx-border">
          {PENALES.mundiales.map((p) => (
            <div key={p.año} className="flex items-center gap-4 p-5">
              <div className="flex items-center gap-3 w-48">
                <Flag code="mx" className="w-8 h-6 rounded shadow" alt="México" />
                <span className="text-sm font-bold text-white">México</span>
                <span className="text-gray-600">vs</span>
                <Flag code={p.flagCode} className="w-8 h-6 rounded shadow" alt={p.rival} />
                <span className="text-sm text-gray-400">{p.rival}</span>
              </div>
              <div className="flex-1 flex items-center gap-4">
                <span className="text-xs text-gray-600">{p.año}</span>
                <span className="text-xs text-gray-500">{p.marcador} tras 90'</span>
                <span className="text-xs text-gray-500">Penales {p.conv}</span>
              </div>
              <span className="text-xs font-black px-3 py-1.5 rounded-full bg-mx-red/10 text-mx-red border border-mx-red/30">
                ELIMINADOS
              </span>
            </div>
          ))}
        </div>
        <div className="p-5 bg-zinc-900/50 border-t border-mx-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Récord en mundiales</span>
            <div className="flex gap-4">
              <span className="text-mx-red font-black">0 victorias</span>
              <span className="text-gray-600">/</span>
              <span className="text-gray-400">2 tandas</span>
            </div>
          </div>
        </div>
      </div>

      {/* probabilidad de penales por ronda */}
      <div className="bg-mx-card border border-mx-border rounded-2xl p-6">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-5">
          Probabilidad de que el partido vaya a penales (por ronda)
        </p>
        <div className="space-y-4">
          {PENALES.probPenalesPorRonda.map((r) => (
            <div key={r.ronda} className="flex items-center gap-4">
              <span className="text-sm font-bold text-gray-400 w-16">{r.ronda}</span>
              <div className="flex-1 h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-mx-red/70" style={{ width: `${r.prob * 3}%` }} />
              </div>
              <span className="text-sm font-black text-mx-red w-10 text-right">{r.prob}%</span>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-mx-red/5 border border-mx-red/20 rounded-xl">
          <p className="text-sm text-gray-300">
            Si México llega a penales, el modelo estima un{" "}
            <span className="text-mx-red font-bold">{PENALES.pGanarEstimada}% de probabilidad de ganar</span>.
            Es el número más duro de este análisis. Pero también el más mejorable.
          </p>
        </div>
      </div>

      <div className="mt-6 p-5 bg-mx-green/5 border border-mx-green/20 rounded-xl">
        <p className="text-sm text-gray-300 leading-relaxed">
          <span className="text-mx-green font-bold">La esperanza:</span> Toda racha se rompe. Perú tampoco ganaba sus penales,
          hasta que ganó. La solución más simple: no llegar a penales. Ganar en tiempo regular, como lo hizo México ante
          Sudáfrica en el Mundial de Sudáfrica 2010 con un golazo de Giovani. Así de sencillo.
        </p>
      </div>
    </SectionWrapper>
  );
}
