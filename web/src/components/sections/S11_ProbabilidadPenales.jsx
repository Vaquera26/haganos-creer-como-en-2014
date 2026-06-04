import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer, ReferenceLine } from "recharts";
import SectionWrapper from "../ui/SectionWrapper.jsx";
import Flag from "../ui/Flag.jsx";
import { MX_GREEN, MX_RED, MX_GOLD, MX_BLUE, AXIS_CLR, GRID_CLR, LABEL_CLR, TOOLTIP_STYLE } from "../../theme.js";

// Datos exactos output Python script 11
const PENALES_RONDA = [
  { ronda: "R32",   pET: 30.8, pPen: 19.1, pMxGana: 2.5  },
  { ronda: "R16",   pET: 29.4, pPen: 18.3, pMxGana: 2.4  },
  { ronda: "QF",    pET: 27.5, pPen: 17.0, pMxGana: 2.3  },
  { ronda: "SF",    pET: 25.1, pPen: 15.6, pMxGana: 2.1  },
  { ronda: "Final", pET: 24.0, pPen: 14.9, pMxGana: 2.0  },
];

const HISTORIAL = [
  { rival: "Alemania Occ.", flagCode: "de", año: 1986, ronda: "Cuartos", marcador: "1-1", penales: "3-4", ganó: false },
  { rival: "Bulgaria",      flagCode: "bg", año: 1994, ronda: "Octavos", marcador: "1-1", penales: "1-3", ganó: false },
];

export default function S11_ProbabilidadPenales() {
  return (
    <SectionWrapper
      id="s11" number={11} accent="red"
      title="La Maldición de los Penales"
      subtitle="0 de 2 en tandas mundialistas. P(ganar penales) estimada: 13.3%. La estadística más oscura de la selección."
      quote="1986: Schumacher. 1994: Mikhailov. Dos porteros, dos noches eternas. Pero algún día esa racha se rompe."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* historial */}
        <div className="bg-mx-card border border-mx-border rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-mx-border">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
              Historial México en penales mundialistas
            </p>
          </div>
          {HISTORIAL.map((h) => (
            <div key={h.año} className="flex items-center gap-4 p-5 border-b border-mx-border/50 last:border-0">
              <div className="flex items-center gap-2">
                <Flag code="mx" className="w-8 h-6 rounded shadow" alt="México" />
                <span className="text-xs text-gray-500">vs</span>
                <Flag code={h.flagCode} className="w-8 h-6 rounded shadow" alt={h.rival} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-white">{h.rival} — {h.año}</p>
                <p className="text-xs text-gray-500">{h.ronda} · {h.marcador} al 90' · Penales {h.penales}</p>
              </div>
              <span className="text-xs font-black px-3 py-1.5 rounded-full bg-mx-red/10 text-mx-red border border-mx-red/30">
                ELIMINADOS
              </span>
            </div>
          ))}
          <div className="p-4 bg-zinc-900/50">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-2xl font-black text-mx-red">0</p>
                <p className="text-xs text-gray-500">victorias</p>
              </div>
              <div>
                <p className="text-2xl font-black text-gray-400">2</p>
                <p className="text-xs text-gray-500">tandas totales</p>
              </div>
              <div>
                <p className="text-2xl font-black text-mx-red">13.3%</p>
                <p className="text-xs text-gray-500">P(ganar) estimada</p>
              </div>
            </div>
          </div>
        </div>

        {/* probabilidades por ronda */}
        <div className="bg-mx-card border border-mx-border rounded-2xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">
            P(ET) y P(penales) por ronda — rivales esperados
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={PENALES_RONDA} margin={{ top: 0, right: 16, left: -10, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={GRID_CLR} />
              <XAxis dataKey="ronda" tick={{ fill: LABEL_CLR, fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: AXIS_CLR, fontSize: 11 }} unit="%" axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`${v}%`]} />
              <Legend wrapperStyle={{ color: LABEL_CLR, fontSize: 11 }} />
              <Bar dataKey="pET"     name="P(tiempo extra)" fill={MX_GOLD}  radius={[0,0,0,0]} opacity={0.8} />
              <Bar dataKey="pPen"    name="P(penales)"       fill={MX_RED}   radius={[4,4,0,0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-4 p-3 bg-mx-red/5 border border-mx-red/20 rounded-lg">
            <p className="text-xs text-gray-400 leading-relaxed">
              Si México llega a penales en R32 (P=19.1%), la probabilidad de pasar con el historial actual es{" "}
              <span className="text-mx-red font-bold">~13.3%</span>.
              La solución más simple: ganar en tiempo regular.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 p-5 bg-mx-green/5 border border-mx-green/20 rounded-xl">
        <p className="text-sm text-gray-300 leading-relaxed">
          <span className="text-mx-green font-bold">La esperanza:</span> Toda racha se rompe.
          La solución no es mejorar los penales en dos semanas — es dominar los partidos para no llegar ahí.
          Como en 2010 vs Francia: un gol de Hernández en el 64' y a casa con tres puntos. Así de sencillo.
        </p>
      </div>
    </SectionWrapper>
  );
}
