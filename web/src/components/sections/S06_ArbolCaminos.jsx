import SectionWrapper from "../ui/SectionWrapper.jsx";
import { CAMINO_ARBOL } from "../../data/analisis.js";

function pColor(p) {
  if (p >= 55) return "text-mx-green border-mx-green bg-mx-green/10";
  if (p >= 40) return "text-mx-gold  border-mx-gold  bg-mx-gold/10";
  return              "text-mx-red   border-mx-red   bg-mx-red/10";
}

export default function S06_ArbolCaminos() {
  const probPasar = [76, 43.4, 25.1, 10.3, 3.9];

  return (
    <SectionWrapper
      id="s06"
      number={6}
      accent="green"
      title="Árbol de Caminos Posibles"
      subtitle="Cada ronda tiene dos variantes dependiendo de cómo termine México en grupos. El camino de 1ro siempre es más fácil."
      quote="Los caminos existen. Son pocos, pero existen. Y cuando los ves en el papel, ya no suenan tan imposibles."
    >
      {/* probabilidades acumuladas */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {["Grupos", "R32", "R16", "QF", "SF", "Final"].map((e, i) => (
          <div key={e} className="flex-shrink-0 flex items-center">
            <div className="bg-mx-card border border-mx-border rounded-xl px-4 py-3 text-center">
              <p className="text-lg font-black text-white">{i === 0 ? "100" : probPasar[i-1]}%</p>
              <p className="text-xs text-gray-500">{e}</p>
            </div>
            {i < 5 && (
              <svg className="w-4 h-4 text-mx-muted mx-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* árbol de rutas */}
      <div className="space-y-4">
        {CAMINO_ARBOL.map((ronda, i) => (
          <div key={ronda.ronda} className="bg-mx-card border border-mx-border rounded-2xl overflow-hidden">
            <div className="px-5 py-3 border-b border-mx-border">
              <span className="text-xs font-bold text-mx-green uppercase tracking-widest">{ronda.ronda}</span>
            </div>
            <div className="grid grid-cols-2 divide-x divide-mx-border">
              {/* si termina 1ro */}
              <div className="p-4">
                <p className="text-xs text-gray-600 mb-2 font-semibold uppercase tracking-wider">Si termina 1ro</p>
                <p className="text-sm font-bold text-gray-300 mb-1">vs {ronda.rival1ro}</p>
                <p className="text-xs text-gray-500 mb-3">FIFA ~#{ronda.rank1ro}</p>
                <div className={`inline-flex border rounded-lg px-2 py-1 text-xs font-black ${pColor(ronda.pGana1ro)}`}>
                  {ronda.pGana1ro}% México gana
                </div>
              </div>
              {/* si termina 2do */}
              <div className="p-4">
                <p className="text-xs text-gray-600 mb-2 font-semibold uppercase tracking-wider">Si termina 2do</p>
                <p className="text-sm font-bold text-gray-300 mb-1">vs {ronda.rival2do}</p>
                <p className="text-xs text-gray-500 mb-3">FIFA ~#{ronda.rank2do}</p>
                <div className={`inline-flex border rounded-lg px-2 py-1 text-xs font-black ${pColor(ronda.pGana2do)}`}>
                  {ronda.pGana2do}% México gana
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-5 bg-mx-green/5 border border-mx-green/20 rounded-xl">
        <p className="text-sm text-gray-300 leading-relaxed">
          <span className="text-mx-green font-bold">La esperanza:</span> En el camino más favorable — Qatar en R32,
          Haití en R16, Escocia en QF — México llega a semifinales con posibilidades reales.
          Ese camino existe en la simulación. Solo necesita materializarse.
        </p>
      </div>
    </SectionWrapper>
  );
}
