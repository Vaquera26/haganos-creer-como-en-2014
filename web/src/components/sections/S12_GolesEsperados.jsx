import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer, ReferenceLine } from "recharts";
import SectionWrapper from "../ui/SectionWrapper.jsx";
import Flag from "../ui/Flag.jsx";
import { MX_GREEN, MX_RED, MX_GOLD, MX_BLUE, AXIS_CLR, GRID_CLR, LABEL_CLR, TOOLTIP_STYLE } from "../../theme.js";

// Datos exactos output Python script 12
const PARTIDOS = [
  {
    rival: "Sudáfrica", flagCode: "za", fecha: "11 Jun", xgMx: 1.45, xgRiv: 0.99,
    pGana: 47.5, pEmpata: 26.6, pPierde: 25.9,
    marcadores: [
      { m: "1-0", p: 12.7, tipo: "G" }, { m: "1-1", p: 12.6, tipo: "E" },
      { m: "2-0", p: 8.1,  tipo: "G" }, { m: "2-1", p: 9.0,  tipo: "G" },
      { m: "0-0", p: 5.4,  tipo: "E" }, { m: "0-1", p: 7.2,  tipo: "P" },
      { m: "1-2", p: 4.8,  tipo: "P" }, { m: "3-1", p: 4.3,  tipo: "G" },
    ],
  },
  {
    rival: "Corea del Sur", flagCode: "kr", fecha: "18 Jun", xgMx: 1.27, xgRiv: 1.13,
    pGana: 40.1, pEmpata: 27.2, pPierde: 32.7,
    marcadores: [
      { m: "1-1", p: 12.9, tipo: "E" }, { m: "1-0", p: 11.6, tipo: "G" },
      { m: "0-1", p: 10.2, tipo: "P" }, { m: "2-1", p: 8.4,  tipo: "G" },
      { m: "0-0", p: 6.1,  tipo: "E" }, { m: "1-2", p: 6.8,  tipo: "P" },
      { m: "2-2", p: 4.2,  tipo: "E" }, { m: "2-0", p: 5.8,  tipo: "G" },
    ],
  },
  {
    rival: "Chequia", flagCode: "cz", fecha: "24 Jun", xgMx: 1.35, xgRiv: 1.07,
    pGana: 43.4, pEmpata: 27.3, pPierde: 29.3,
    marcadores: [
      { m: "1-1", p: 12.9, tipo: "E" }, { m: "1-0", p: 11.8, tipo: "G" },
      { m: "0-1", p: 9.5,  tipo: "P" }, { m: "2-1", p: 9.3,  tipo: "G" },
      { m: "0-0", p: 5.8,  tipo: "E" }, { m: "1-2", p: 6.1,  tipo: "P" },
      { m: "2-0", p: 7.2,  tipo: "G" }, { m: "3-1", p: 4.1,  tipo: "G" },
    ],
  },
];

const markerColor = (tipo) => ({ G: MX_GREEN, E: MX_GOLD, P: MX_RED }[tipo] ?? "#6b7280");

export default function S12_GolesEsperados() {
  return (
    <SectionWrapper
      id="s12" number={12} accent="green"
      title="Modelo de Goles Esperados"
      subtitle="Distribución Poisson calibrada por Elo + altitud. Probabilidad de cada marcador posible en los 3 partidos."
      quote="El modelo ve 1-0 como el marcador más probable vs Sudáfrica. Un solo gol puede ser la diferencia entre soñar o volver."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {PARTIDOS.map((p) => (
          <div key={p.rival} className="bg-mx-card border border-mx-border rounded-2xl p-5">
            {/* header partido */}
            <div className="flex items-center gap-3 mb-4">
              <Flag code="mx" className="w-7 h-5 rounded shadow-sm" alt="México" />
              <span className="text-xs text-gray-500">vs</span>
              <Flag code={p.flagCode} className="w-7 h-5 rounded shadow-sm" alt={p.rival} />
              <div className="ml-1">
                <p className="text-sm font-bold text-white">{p.rival}</p>
                <p className="text-xs text-gray-500">{p.fecha} · xG {p.xgMx}—{p.xgRiv}</p>
              </div>
            </div>

            {/* barras de probabilidad por marcador */}
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={p.marcadores} layout="vertical"
                margin={{ top: 0, right: 32, left: 10, bottom: 0 }}>
                <CartesianGrid horizontal={false} stroke={GRID_CLR} />
                <XAxis type="number" tick={{ fill: AXIS_CLR, fontSize: 9 }} unit="%" axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="m" tick={{ fill: LABEL_CLR, fontSize: 11, fontWeight: 700 }}
                  width={30} axisLine={false} tickLine={false} />
                <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`${v}%`, "Probabilidad"]} />
                <Bar dataKey="p" radius={[0, 3, 3, 0]}
                  label={{ position: "right", formatter: (v) => `${v}%`, fill: "#9ca3af", fontSize: 10 }}>
                  {p.marcadores.map((m, i) => (
                    <Cell key={i} fill={markerColor(m.tipo)} opacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* resultado resumen */}
            <div className="grid grid-cols-3 gap-2 mt-4 text-center">
              {[
                { label: "Gana",   value: p.pGana,   color: "text-mx-green bg-mx-green/10" },
                { label: "Empata", value: p.pEmpata,  color: "text-mx-gold  bg-mx-gold/10"  },
                { label: "Pierde", value: p.pPierde,  color: "text-mx-red   bg-mx-red/10"   },
              ].map((r) => (
                <div key={r.label} className={`rounded-lg py-1.5 ${r.color.split(" ")[1]}`}>
                  <p className={`text-base font-black ${r.color.split(" ")[0]}`}>{r.value}%</p>
                  <p className="text-xs text-gray-500">{r.label}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-5 bg-mx-green/5 border border-mx-green/20 rounded-xl">
        <p className="text-sm text-gray-300 leading-relaxed">
          <span className="text-mx-green font-bold">La esperanza:</span> El modelo de Poisson muestra que contra Sudáfrica hay
          más del 20% de chance de ganar 2-0 o más. El margen de goles en la primera jornada puede ser el colchón
          que México necesita si las cosas se complican después.
        </p>
      </div>
    </SectionWrapper>
  );
}
