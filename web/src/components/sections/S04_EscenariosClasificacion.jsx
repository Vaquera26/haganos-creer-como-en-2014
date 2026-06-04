import SectionWrapper from "../ui/SectionWrapper.jsx";
import { ESCENARIOS } from "../../data/analisis.js";

const resultColor = {
  G: { bg: "bg-mx-green", text: "text-white",  label: "G" },
  E: { bg: "bg-mx-gold",  text: "text-black",  label: "E" },
  P: { bg: "bg-mx-red",   text: "text-white",  label: "P" },
};

function clasifColor(p) {
  if (p >= 80) return "text-mx-green border-mx-green bg-mx-green/10";
  if (p >= 40) return "text-mx-gold  border-mx-gold  bg-mx-gold/10";
  return              "text-mx-red   border-mx-red   bg-mx-red/10";
}

export default function S04_EscenariosClasificacion() {
  return (
    <SectionWrapper
      id="s04"
      number={4}
      accent="green"
      title="Escenarios de Clasificación"
      subtitle="Hay 27 combinaciones posibles de resultados en los tres partidos. Aquí están los que más importan: los primeros dos juegos definen casi todo."
      quote="Ganar los dos primeros partidos y el tercero se convierte en fiesta. Perder los dos primeros y se convierte en tragedia nacional."
    >
      <div className="bg-mx-card border border-mx-border rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-mx-border">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
            P(clasificar) después de los primeros 2 partidos
          </p>
          <p className="text-xs text-gray-600 mt-1">G = gana · E = empata · P = pierde</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
          {ESCENARIOS.map((esc, i) => {
            const r1 = resultColor[esc.j1];
            const r2 = resultColor[esc.j2];
            const cc = clasifColor(esc.pClasif);
            return (
              <div key={i} className="flex items-center gap-4 p-4 border-b border-mx-border/50 last:border-0 sm:last:border-b sm:[&:nth-child(3n)]:border-r-0 sm:border-r border-mx-border/30">
                {/* resultado indicadores */}
                <div className="flex gap-1.5 flex-shrink-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${r1.bg} ${r1.text}`}>
                    {esc.j1}
                  </div>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${r2.bg} ${r2.text}`}>
                    {esc.j2}
                  </div>
                </div>

                {/* info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 truncate">{esc.label}</p>
                  <p className="text-xs text-gray-600">{esc.pts} pts mínimo</p>
                </div>

                {/* probabilidad */}
                <div className={`border rounded-lg px-2.5 py-1 text-center flex-shrink-0 ${cc}`}>
                  <p className="text-base font-black">{esc.pClasif}%</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* resumen clave */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[
          { pts: "6+ pts", pct: "99%", label: "prácticamente clasificado", color: "border-mx-green text-mx-green" },
          { pts: "4+ pts", pct: "72%", label: "dependiendo del tercer partido", color: "border-mx-gold text-mx-gold" },
          { pts: "3 pts",  pct: "40%", label: "a rezar y esperar", color: "border-mx-red text-mx-red" },
        ].map((s) => (
          <div key={s.pts} className={`bg-mx-card border rounded-xl p-4 text-center ${s.color}`}>
            <p className="text-2xl font-black">{s.pct}</p>
            <p className="text-xs font-bold mt-0.5">{s.pts}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-5 bg-mx-green/5 border border-mx-green/20 rounded-xl">
        <p className="text-sm text-gray-300 leading-relaxed">
          <span className="text-mx-green font-bold">La esperanza:</span> Con ganar los dos primeros partidos el equipo llega al Azteca
          el 24 de junio contra Chequia con la clasificación ya en el bolsillo. Eso es lo que necesita la afición:
          entrar al último partido sin necesidad de hacer cuentas.
        </p>
      </div>
    </SectionWrapper>
  );
}
