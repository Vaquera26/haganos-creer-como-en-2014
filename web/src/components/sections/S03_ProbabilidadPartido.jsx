import SectionWrapper from "../ui/SectionWrapper.jsx";
import Flag from "../ui/Flag.jsx";
import { PARTIDOS_GRUPO } from "../../data/analisis.js";

function MatchCard({ partido }) {
  const { rival, flagCode, rank, fecha, sede, pGana, pEmpata, pPierde, marcadores, narrativa } = partido;

  return (
    <div className="bg-mx-card border border-mx-border rounded-2xl overflow-hidden">
      {/* header */}
      <div className="flex items-center justify-between p-5 border-b border-mx-border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Flag code="mx" className="w-9 h-6 rounded shadow" alt="México" />
            <span className="text-lg font-black text-white">MX</span>
          </div>
          <span className="text-gray-600 font-bold">vs</span>
          <div className="flex items-center gap-3">
            <span className="text-lg font-black text-gray-400">{rival.split(" ")[0]}</span>
            <Flag code={flagCode} className="w-9 h-6 rounded shadow" alt={rival} />
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500">{fecha}</p>
          <p className="text-xs text-gray-600">{sede}</p>
          <p className="text-xs text-mx-green font-semibold">FIFA #{rank}</p>
        </div>
      </div>

      {/* barras de probabilidad */}
      <div className="p-5">
        <div className="space-y-3 mb-5">
          {[
            { label: "México gana", value: pGana,   color: "bg-mx-green" },
            { label: "Empate",      value: pEmpata,  color: "bg-mx-gold"  },
            { label: "Pierde",      value: pPierde,  color: "bg-mx-red"   },
          ].map((row) => (
            <div key={row.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">{row.label}</span>
                <span className="font-bold text-white">{row.value}%</span>
              </div>
              <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${row.color}`} style={{ width: `${row.value}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* marcadores probables */}
        <div className="border-t border-mx-border pt-4">
          <p className="text-xs text-gray-600 uppercase tracking-wider mb-2 font-semibold">Marcadores más probables</p>
          <div className="flex gap-3 flex-wrap">
            {marcadores.map((m) => (
              <div key={m.m} className="bg-zinc-800/60 rounded-lg px-3 py-2 text-center">
                <p className="text-sm font-black text-white">{m.m}</p>
                <p className="text-xs text-gray-500">{m.p}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* narrativa */}
      <div className="px-5 pb-5">
        <p className="text-xs text-gray-500 italic leading-relaxed">{narrativa}</p>
      </div>
    </div>
  );
}

export default function S03_ProbabilidadPartido() {
  return (
    <SectionWrapper
      id="s03"
      number={3}
      accent="green"
      title="Probabilidad por Partido"
      subtitle="Tres rivales. Tres destinos. El modelo calcula las probabilidades de cada resultado usando rankings FIFA, Elo y ventaja de altitud."
      quote="El partido vs Corea del Sur es el partido del grupo. El que define si llegamos primeros o segundos."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {PARTIDOS_GRUPO.map((p) => <MatchCard key={p.rival} partido={p} />)}
      </div>

      <div className="mt-6 p-5 bg-mx-green/5 border border-mx-green/20 rounded-xl">
        <p className="text-sm text-gray-300 leading-relaxed">
          <span className="text-mx-green font-bold">La esperanza:</span> México tiene más del 70% de ganar dos de los tres partidos.
          Con Sudáfrica favorables al 80%, hay que arrancar fuerte desde el primer minuto en el Azteca.
          El arranque lo es todo.
        </p>
      </div>
    </SectionWrapper>
  );
}
