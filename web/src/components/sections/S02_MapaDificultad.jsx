import SectionWrapper from "../ui/SectionWrapper.jsx";
import { DIFICULTAD_MAPA } from "../../data/analisis.js";

function difColor(dif) {
  if (dif < 0.50) return { bg: "bg-mx-green/20 border-mx-green/30 text-mx-green" };
  if (dif < 0.65) return { bg: "bg-mx-gold/20  border-mx-gold/30  text-mx-gold"  };
  return               { bg: "bg-mx-red/20   border-mx-red/30   text-mx-red"   };
}

function difLabel(dif) {
  if (dif < 0.50) return "Favorable";
  if (dif < 0.65) return "Equilibrado";
  return "Difícil";
}

export default function S02_MapaDificultad() {
  const { rondas, posiciones } = DIFICULTAD_MAPA;

  return (
    <SectionWrapper
      id="s02"
      number={2}
      accent="gold"
      title="Mapa de Dificultad del Camino"
      subtitle="Terminar primero no es solo orgullo. Es la diferencia entre Suiza en R32 o enfrentarte a un líder de grupo en el primer eliminatorio."
      quote="La llave de un mundial se gana antes de jugar. Terminar primero es la primera batalla."
    >
      {/* tabla */}
      <div className="bg-mx-card border border-mx-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-mx-border">
                <th className="text-left py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ronda</th>
                {Object.values(posiciones).map((pos) => (
                  <th key={pos.label} className="py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {pos.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rondas.map((ronda, ri) => (
                <tr key={ronda} className="border-b border-mx-border/50 last:border-0">
                  <td className="py-4 px-5 text-sm font-bold text-white">{ronda}</td>
                  {Object.values(posiciones).map((pos) => {
                    const dif = pos.difs[ri];
                    const c = difColor(dif);
                    return (
                      <td key={pos.label} className="py-4 px-5 text-center">
                        <div className={`inline-flex flex-col items-center gap-1 border rounded-lg px-3 py-2 ${c.bg}`}>
                          <span className={`text-lg font-black ${c.bg.split(" ").find(s => s.startsWith("text-"))}`}>
                            {(dif * 100).toFixed(0)}%
                          </span>
                          <span className="text-xs opacity-80">{difLabel(dif)}</span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-4 bg-zinc-900/50 border-t border-mx-border">
          <p className="text-xs text-gray-500">Porcentaje = probabilidad de que México pierda ese partido específico según rival esperado por posición.</p>
        </div>
      </div>

      {/* leyenda */}
      <div className="flex gap-4 mt-4 flex-wrap">
        {[
          { label: "Favorable",    bg: "bg-mx-green/20 border-mx-green/30 text-mx-green" },
          { label: "Equilibrado",  bg: "bg-mx-gold/20 border-mx-gold/30 text-mx-gold"   },
          { label: "Difícil",      bg: "bg-mx-red/20 border-mx-red/30 text-mx-red"      },
        ].map((l) => (
          <div key={l.label} className={`border rounded-lg px-3 py-1.5 text-xs font-semibold ${l.bg}`}>
            {l.label}
          </div>
        ))}
      </div>

      <div className="mt-6 p-5 bg-mx-green/5 border border-mx-green/20 rounded-xl">
        <p className="text-sm text-gray-300 leading-relaxed">
          <span className="text-mx-green font-bold">La esperanza:</span> Terminar primero del Grupo A es el factor que más cambia la ecuación.
          En R32 enfrentas al subcampeón del Grupo B — probablemente Bosnia o Qatar.
          Eso vale la pena de ganar los tres partidos.
        </p>
      </div>
    </SectionWrapper>
  );
}
