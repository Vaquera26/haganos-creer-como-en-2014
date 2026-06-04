import SectionWrapper from "../ui/SectionWrapper.jsx";
import { HISTORIA_MX } from "../../data/analisis.js";

const rondaNum = { "Grupos": 1, "Octavos": 2, "Cuartos": 4 };
const rondaH = 8;

export default function S07_MexicoVsHistoria() {
  const max = 4;

  return (
    <SectionWrapper
      id="s07"
      number={7}
      accent="gold"
      title="México contra su Historia"
      subtitle="17 mundiales. Solo dos veces llegamos a cuartos. Las dos, jugando en casa. ¿Casualidad?"
      quote="1970. 1986. Los dos mejores mundiales de México fueron en México. 2026 es México. Saquen sus conclusiones."
    >
      <div className="bg-mx-card border border-mx-border rounded-2xl p-6 overflow-x-auto">
        <div className="flex items-end gap-2 min-w-max">
          {HISTORIA_MX.map((wc) => {
            const heightPct = (wc.rondaNum / max) * 100;
            const isHost = wc.host;
            const isBest = wc.rondaNum >= 4;
            const isCurse = wc.rondaNum === 3;
            const isFail  = wc.rondaNum === 1 && wc.año >= 2022;

            let barColor = "bg-zinc-700";
            if (isHost) barColor = "bg-mx-gold";
            else if (isBest) barColor = "bg-mx-green";
            else if (isCurse) barColor = "bg-blue-700";
            else if (isFail) barColor = "bg-mx-red";

            return (
              <div key={wc.año} className="flex flex-col items-center gap-1" style={{ width: 44 }}>
                <span className="text-xs font-bold text-gray-400">{wc.ronda === "Octavos" ? "R16" : wc.ronda.slice(0,3)}</span>
                <div className="w-8 flex flex-col justify-end" style={{ height: 120 }}>
                  <div
                    className={`w-full rounded-t ${barColor} ${isHost ? "glow-green" : ""} transition-all`}
                    style={{ height: `${heightPct}%`, minHeight: 4 }}
                  />
                </div>
                <span className={`text-[10px] font-bold ${isHost ? "text-mx-gold" : "text-gray-600"}`}>
                  {wc.año}
                </span>
                {isHost && (
                  <span className="text-[9px] text-mx-gold font-black">SEDE</span>
                )}
              </div>
            );
          })}
        </div>

        {/* leyenda */}
        <div className="flex gap-4 mt-4 flex-wrap">
          {[
            { color: "bg-mx-gold",  label: "Sede + mejor resultado" },
            { color: "bg-blue-700", label: "R16 (la maldición)"     },
            { color: "bg-zinc-700", label: "Fase de grupos"         },
            { color: "bg-mx-red",   label: "Qatar 2022 (fracaso)"   },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded ${l.color}`} />
              <span className="text-xs text-gray-500">{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* comparación de estadísticas sede vs fuera */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-mx-card border border-mx-gold/30 rounded-xl p-5">
          <p className="text-xs text-mx-gold font-bold uppercase tracking-wider mb-3">Como sede (1970 + 1986)</p>
          <p className="text-4xl font-black text-mx-gold">Cuartos</p>
          <p className="text-sm text-gray-400 mt-1">Ambas veces. Sin falla.</p>
          <p className="text-xs text-gray-600 mt-2">Ronda promedio: 4.0 / 7</p>
        </div>
        <div className="bg-mx-card border border-zinc-700 rounded-xl p-5">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-3">Fuera de casa (1994-2018)</p>
          <p className="text-4xl font-black text-gray-400">Octavos</p>
          <p className="text-sm text-gray-500 mt-1">Siempre el mismo techo.</p>
          <p className="text-xs text-gray-600 mt-2">Ronda promedio: 2.75 / 7</p>
        </div>
      </div>

      <div className="mt-6 p-5 bg-mx-green/5 border border-mx-green/20 rounded-xl">
        <p className="text-sm text-gray-300 leading-relaxed">
          <span className="text-mx-green font-bold">La esperanza:</span> Las dos únicas veces que México llegó a cuartos fue jugando en casa.
          2026 es México de local. La historia nos dice que el techo sube cuando el Azteca ruge.
          Esta es la tercera vez que tenemos esa oportunidad.
        </p>
      </div>
    </SectionWrapper>
  );
}
