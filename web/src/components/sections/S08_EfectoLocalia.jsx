import SectionWrapper from "../ui/SectionWrapper.jsx";
import Flag from "../ui/Flag.jsx";
import { LOCALIA } from "../../data/analisis.js";

export default function S08_EfectoLocalia() {
  const { casaRecord, fueraRecord, altitudBonus } = LOCALIA;

  const casaPct  = (casaRecord.v  / casaRecord.total  * 100).toFixed(0);
  const fueraPct = (fueraRecord.v / fueraRecord.total * 100).toFixed(0);

  return (
    <SectionWrapper
      id="s08"
      number={8}
      accent="green"
      title="El Efecto de Localía"
      subtitle="El Azteca a 2,240 metros sobre el nivel del mar. Los rivales llegan sin aire. La afición pone el resto."
      quote="No es solo el estadio. Es la altitud, el ruido, el chile en el ambiente. El Azteca es la undécima jugadora."
    >
      {/* métricas de altitud */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Altitud Azteca",      value: "2,240m",  sub: "sobre el nivel del mar",    color: "text-mx-green" },
          { label: "Altitud Guadalajara", value: "1,554m",  sub: "Estadio Akron",             color: "text-mx-gold"  },
          { label: "Bonus vs Corea",      value: "+3.6 pp", sub: "en P(México gana)",         color: "text-mx-green" },
          { label: "Ronda prom. como sede", value: "4.0",   sub: "vs 2.75 fuera de casa",      color: "text-mx-gold"  },
          { label: "Capac. Azteca",       value: "87,000",  sub: "espectadores",               color: "text-white"    },
          { label: "Partidos en México",  value: "2 de 3",  sub: "fase de grupos en el Azteca", color: "text-mx-green" },
        ].map((s) => (
          <div key={s.label} className="bg-mx-card border border-mx-border rounded-xl p-4">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            <p className="text-xs text-gray-600">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* comparación casa vs fuera */}
      <div className="bg-mx-card border border-mx-border rounded-2xl p-6">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-5">
          México en casa vs de visita — todos los partidos históricos
        </h3>

        <div className="grid grid-cols-2 gap-6">
          {[
            { label: "En casa", record: casaRecord, pct: casaPct,  color: "mx-green", border: "border-mx-green" },
            { label: "De visita", record: fueraRecord, pct: fueraPct, color: "zinc-500", border: "border-zinc-600" },
          ].map((side) => (
            <div key={side.label}>
              <div className="flex items-center gap-2 mb-4">
                <Flag code="mx" className="w-6 h-4" alt="México" />
                <span className={`text-sm font-bold text-${side.color}`}>{side.label}</span>
              </div>
              <div className="space-y-3">
                {[
                  { lbl: "Victorias", val: side.record.v, total: side.record.total, col: "bg-mx-green" },
                  { lbl: "Empates",   val: side.record.e, total: side.record.total, col: "bg-mx-gold"  },
                  { lbl: "Derrotas",  val: side.record.d, total: side.record.total, col: "bg-mx-red"   },
                ].map((row) => (
                  <div key={row.lbl}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">{row.lbl}</span>
                      <span className="text-gray-300 font-bold">
                        {row.val} ({(row.val/row.total*100).toFixed(0)}%)
                      </span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${row.col}`}
                        style={{ width: `${(row.val/row.total)*100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className={`mt-3 text-center border ${side.border} rounded-lg py-2`}>
                <p className={`text-2xl font-black text-${side.color}`}>{side.pct}%</p>
                <p className="text-xs text-gray-500">victorias</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-5 bg-mx-green/5 border border-mx-green/20 rounded-xl">
        <p className="text-sm text-gray-300 leading-relaxed">
          <span className="text-mx-green font-bold">La esperanza:</span> El Azteca tiene su propio poder.
          Gana {casaPct}% de los partidos jugando ahí. Combinado con el oxígeno enrarecido a 2,240m,
          los rivales llegan literalmente en desventaja física. Dos de los tres partidos de grupos son en el Azteca.
        </p>
      </div>
    </SectionWrapper>
  );
}
