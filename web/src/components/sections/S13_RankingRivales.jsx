import SectionWrapper from "../ui/SectionWrapper.jsx";
import Flag from "../ui/Flag.jsx";
import { RIVALES_RANKING } from "../../data/analisis.js";

const rondaColor = {
  R32: "text-mx-green bg-mx-green/10 border-mx-green/30",
  R16: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  QF:  "text-mx-gold bg-mx-gold/10 border-mx-gold/30",
  SF:  "text-orange-400 bg-orange-400/10 border-orange-400/30",
};

export default function S13_RankingRivales() {
  return (
    <SectionWrapper
      id="s13"
      number={13}
      accent="gold"
      title="Ranking de Rivales Más Peligrosos"
      subtitle="De los 26 posibles rivales en la eliminatoria, ¿cuáles convienen y cuáles hay que evitar? El modelo lo responde."
      quote="El peor escenario es Argentina en cuartos. El mejor, Qatar en R32. Que la llave decida con quién de los dos nos toca."
    >
      <div className="bg-mx-card border border-mx-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-mx-border">
          <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <span className="col-span-5">Rival</span>
            <span className="col-span-2 text-center">Ronda</span>
            <span className="col-span-5">P(México gana)</span>
          </div>
        </div>

        <div className="divide-y divide-mx-border/40 max-h-[640px] overflow-y-auto">
          {RIVALES_RANKING.map((r, i) => {
            const pct = r.pMxGana;
            const barColor = pct >= 55 ? "bg-mx-green" : pct >= 40 ? "bg-mx-gold" : "bg-mx-red";
            const textColor = pct >= 55 ? "text-mx-green" : pct >= 40 ? "text-mx-gold" : "text-mx-red";
            const rc = rondaColor[r.ronda] ?? rondaColor.R32;
            const isWorst = r.rival === "Argentina" || r.rival === "Francia";
            const isBest  = r.rival === "Qatar" || r.rival === "Haití";

            return (
              <div key={r.rival}
                className={`grid grid-cols-12 gap-2 items-center px-4 py-3
                  ${isWorst ? "bg-mx-red/3" : ""}
                  ${isBest ? "bg-mx-green/3" : ""}`}>
                {/* rival */}
                <div className="col-span-5 flex items-center gap-3">
                  <span className="text-xs text-gray-700 w-4 tabular-nums">{i + 1}</span>
                  <Flag code={r.flagCode} className="w-8 h-5 rounded shadow-sm flex-shrink-0" alt={r.rival} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{r.rival}</p>
                    <p className="text-xs text-gray-600">FIFA #{r.rank}</p>
                  </div>
                  {isBest  && <span className="text-xs text-mx-green font-bold ml-auto hidden sm:block">ideal</span>}
                  {isWorst && <span className="text-xs text-mx-red font-bold ml-auto hidden sm:block">evitar</span>}
                </div>

                {/* ronda */}
                <div className="col-span-2 flex justify-center">
                  <span className={`text-xs font-bold border rounded px-2 py-0.5 ${rc}`}>{r.ronda}</span>
                </div>

                {/* barra */}
                <div className="col-span-5 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className={`text-sm font-black tabular-nums w-10 text-right ${textColor}`}>
                    {pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-mx-card border border-mx-green/30 rounded-xl p-4">
          <p className="text-xs text-mx-green font-bold uppercase tracking-wider mb-2">Escenario ideal</p>
          <p className="text-sm text-gray-300">Qatar (R32) → Haití (R16) → Escocia (QF)</p>
          <p className="text-xs text-gray-600 mt-1">P(México gana cada partido): ~83%, ~86%, ~60%</p>
        </div>
        <div className="bg-mx-card border border-mx-red/30 rounded-xl p-4">
          <p className="text-xs text-mx-red font-bold uppercase tracking-wider mb-2">Pesadilla</p>
          <p className="text-sm text-gray-300">Suiza (R32) → Brasil (R16) → Argentina (QF)</p>
          <p className="text-xs text-gray-600 mt-1">P(México gana cada partido): ~46%, ~36%, ~27%</p>
        </div>
      </div>

      <div className="mt-6 p-5 bg-mx-green/5 border border-mx-green/20 rounded-xl">
        <p className="text-sm text-gray-300 leading-relaxed">
          <span className="text-mx-green font-bold">La esperanza:</span> La llave del mundial se sortea, no se elige.
          Pero el modelo muestra que hay caminos viables. Terminar primero del grupo es el primer paso para alejarse
          de Argentina, Francia y Brasil en el bracket. Ese es el partido del grupo que más importa: el primero.
        </p>
      </div>
    </SectionWrapper>
  );
}
