import SectionWrapper from "../ui/SectionWrapper.jsx";
import { RUTA_QUINTO } from "../../data/analisis.js";

const colorMap = {
  red:   { bar: "bg-mx-red",   text: "text-mx-red"   },
  gray:  { bar: "bg-zinc-500", text: "text-zinc-400"  },
  gold:  { bar: "bg-mx-gold",  text: "text-mx-gold"   },
  green: { bar: "bg-mx-green", text: "text-mx-green"  },
};

export default function S01_RutaQuintoPartido() {
  return (
    <SectionWrapper
      id="s01"
      number={1}
      accent="gold"
      title="La Ruta del Quinto Partido"
      subtitle="7 octavos. 7 decepciones. El modelo corre 100,000 mundiales y te dice hasta dónde puede llegar México."
      quote="El día que Robben se tiró, México murió en el cuarto partido. La maldición lleva ya 32 años."
    >
      <div className="bg-mx-card border border-mx-border rounded-2xl p-6 sm:p-8">
        <div className="space-y-5">
          {RUTA_QUINTO.map((row, i) => {
            const c = colorMap[row.color] ?? colorMap.green;
            const isCurse = row.etapa.includes("maldición");
            return (
              <div key={i} className={`relative ${isCurse ? "py-2" : ""}`}>
                {isCurse && (
                  <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-mx-gold opacity-60" />
                )}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-3">
                    {row.juego && (
                      <span className="text-xs font-mono text-gray-600 w-12">J{row.juego}</span>
                    )}
                    <span className={`text-sm font-semibold ${isCurse ? "text-mx-gold" : "text-gray-300"}`}>
                      {row.etapa}
                    </span>
                    {isCurse && (
                      <span className="text-xs bg-mx-gold/10 text-mx-gold border border-mx-gold/30 rounded px-2 py-0.5 font-bold">
                        0 DE 7
                      </span>
                    )}
                  </div>
                  <span className={`text-lg font-black tabular-nums ${c.text}`}>
                    {row.pLlegar}%
                  </span>
                </div>
                <div className="h-3 bg-zinc-800/80 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${c.bar} ${isCurse ? "opacity-90" : "opacity-75"}`}
                    style={{ width: `${row.pLlegar}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {row.pElim}% de las simulaciones termina aquí
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-mx-border">
          <p className="text-sm text-gray-400 leading-relaxed">
            De 100,000 mundiales simulados, en <span className="text-mx-green font-bold">76,000</span> México pasa de grupos.
            En <span className="text-mx-gold font-bold">43,400</span> llega al quinto partido.
            En <span className="text-mx-green font-bold">25,100</span> llega a cuartos.
            Solo necesitamos que sea uno de esos.
          </p>
        </div>
      </div>

      <div className="mt-6 p-5 bg-mx-green/5 border border-mx-green/20 rounded-xl">
        <p className="text-sm text-gray-300 leading-relaxed">
          <span className="text-mx-green font-bold">La esperanza:</span> El Grupo A es el más accesible que México ha tenido desde 1986.
          Si no llegamos al quinto partido con este grupo y esta localía, cuando llegamos.
        </p>
      </div>
    </SectionWrapper>
  );
}
