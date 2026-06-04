import SectionWrapper from "../ui/SectionWrapper.jsx";
import { PUNTOS_CLASIF } from "../../data/analisis.js";

function ptColor(pClasif) {
  if (pClasif >= 90) return { bar: "bg-mx-green", text: "text-mx-green", badge: "bg-mx-green/10 border-mx-green text-mx-green" };
  if (pClasif >= 50) return { bar: "bg-mx-gold",  text: "text-mx-gold",  badge: "bg-mx-gold/10  border-mx-gold  text-mx-gold"  };
  return                    { bar: "bg-mx-red",   text: "text-mx-red",   badge: "bg-mx-red/10   border-mx-red   text-mx-red"   };
}

export default function S10_PuntosNecesarios() {
  return (
    <SectionWrapper
      id="s10"
      number={10}
      accent="gold"
      title="Puntos Necesarios para Avanzar"
      subtitle="100,000 simulaciones del Grupo A. Con cuántos puntos clasifica México en la práctica."
      quote="Con 6 puntos clasificamos casi siempre. Con 4 puntos, temblamos. Con 3, rezamos al Tata Martino de que no repase por la mente de nadie."
    >
      <div className="bg-mx-card border border-mx-border rounded-2xl p-6">
        <div className="space-y-4">
          {PUNTOS_CLASIF.map((row) => {
            const c = ptColor(row.pClasif);
            return (
              <div key={row.pts} className="grid grid-cols-12 items-center gap-3">
                {/* puntos */}
                <div className="col-span-1 text-center">
                  <span className="text-lg font-black text-white">{row.pts}</span>
                  <p className="text-xs text-gray-600">pts</p>
                </div>

                {/* barra principal P(clasif) */}
                <div className="col-span-6">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">P(clasificar)</span>
                  </div>
                  <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${c.bar}`} style={{ width: `${row.pClasif}%` }} />
                  </div>
                </div>

                {/* badge pClasif */}
                <div className="col-span-2 text-right">
                  <div className={`inline-block border rounded px-2 py-0.5 text-xs font-black ${c.badge}`}>
                    {row.pClasif}%
                  </div>
                </div>

                {/* probabilidad de esa puntuación */}
                <div className="col-span-3 text-right">
                  <span className="text-xs text-gray-600">ocurre {row.pObtener}%</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-5 border-t border-mx-border grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-black text-mx-green">62.5%</p>
            <p className="text-xs text-gray-500 mt-1">P(clasificar directo<br/>como 1ro o 2do)</p>
          </div>
          <div>
            <p className="text-3xl font-black text-mx-gold">74.2%</p>
            <p className="text-xs text-gray-500 mt-1">P(clasificar incluyendo<br/>chance como 3ro)</p>
          </div>
          <div>
            <p className="text-3xl font-black text-gray-500">20.6%</p>
            <p className="text-xs text-gray-500 mt-1">P(terminar con<br/>exactamente 4 pts)</p>
          </div>
        </div>
      </div>

      {/* mensaje clave */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { pts: "9 pts",  icon: "★", msg: "Clasificados y en modo fiesta", border: "border-mx-green", text: "text-mx-green" },
          { pts: "6 pts",  icon: "✓", msg: "Clasificados, sin depender de nadie", border: "border-mx-green", text: "text-mx-green" },
          { pts: "3 pts",  icon: "⚠", msg: "Dependemos de otros resultados", border: "border-mx-red", text: "text-mx-red" },
        ].map((s) => (
          <div key={s.pts} className={`bg-mx-card border ${s.border} rounded-xl p-4 flex items-start gap-3`}>
            <span className={`text-xl ${s.text}`}>{s.icon}</span>
            <div>
              <p className={`text-base font-black ${s.text}`}>{s.pts}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.msg}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-5 bg-mx-green/5 border border-mx-green/20 rounded-xl">
        <p className="text-sm text-gray-300 leading-relaxed">
          <span className="text-mx-green font-bold">La esperanza:</span> El escenario más probable (20.6%) es que México
          termine con 4 puntos. Con esos 4 puntos hay un 72% de chance de clasificar directo. No es seguro, pero es viable.
          Y con 7+ puntos, es fiesta garantizada.
        </p>
      </div>
    </SectionWrapper>
  );
}
