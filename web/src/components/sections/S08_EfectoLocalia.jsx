import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell,
  LineChart, Line, ReferenceLine, ResponsiveContainer
} from "recharts";
import SectionWrapper from "../ui/SectionWrapper.jsx";
import Flag from "../ui/Flag.jsx";
import { MX_GREEN, MX_RED, MX_GOLD, MX_BLUE, AXIS_CLR, GRID_CLR, LABEL_CLR, TOOLTIP_STYLE } from "../../theme.js";

// Python output: casa 85V 22E 13D de 120 | fuera 48V 22E 28D de 98
const COMPARACION = [
  { metrica: "Victorias", casa: 70.8, fuera: 49.0 },
  { metrica: "Empates",   casa: 18.3, fuera: 22.4 },
  { metrica: "Derrotas",  casa: 10.8, fuera: 28.6 },
];

const SEDES_WC = [
  { año: "1930", pais: "Uruguay",    ronda: 7 }, { año: "1934", pais: "Italia",     ronda: 7 },
  { año: "1950", pais: "Brasil",     ronda: 6 }, { año: "1954", pais: "Suiza",      ronda: 4 },
  { año: "1958", pais: "Suecia",     ronda: 6 }, { año: "1962", pais: "Chile",      ronda: 5 },
  { año: "1966", pais: "Inglaterra", ronda: 7 }, { año: "1970", pais: "México",     ronda: 4, mx: true },
  { año: "1974", pais: "Alemania",   ronda: 7 }, { año: "1978", pais: "Argentina",  ronda: 7 },
  { año: "1982", pais: "España",     ronda: 2 }, { año: "1986", pais: "México",     ronda: 4, mx: true },
  { año: "1990", pais: "Italia",     ronda: 5 }, { año: "1994", pais: "EUA",        ronda: 3 },
  { año: "1998", pais: "Francia",    ronda: 7 }, { año: "2002", pais: "Corea",      ronda: 5 },
  { año: "2006", pais: "Alemania",   ronda: 5 }, { año: "2010", pais: "Sudáfrica",  ronda: 1 },
  { año: "2014", pais: "Brasil",     ronda: 5 }, { año: "2018", pais: "Rusia",      ronda: 4 },
  { año: "2022", pais: "Qatar",      ronda: 1 },
];

// altitud: bonus en prob ganar
const ALTITUD_DATA = [
  { altitud: 0,    bonus: 0   },
  { altitud: 500,  bonus: 1.2 },
  { altitud: 1000, bonus: 2.4 },
  { altitud: 1554, bonus: 3.2, label: "Guadalajara" },
  { altitud: 2000, bonus: 4.8 },
  { altitud: 2240, bonus: 5.6, label: "Azteca" },
  { altitud: 2500, bonus: 6.5 },
  { altitud: 3000, bonus: 8.5 },
];

export default function S08_EfectoLocalia() {
  return (
    <SectionWrapper
      id="s08" number={8} accent="green"
      title="El Efecto de Localía"
      subtitle="El Azteca a 2,240m. En casa México gana el 70.8% de partidos. De visita, solo 49%. Los rivales llegan sin aire."
      quote="No es solo el estadio. Es la altitud, el ruido, el chile en el ambiente. El Azteca es la undécima jugadora."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* comparación casa vs fuera */}
        <div className="bg-mx-card border border-mx-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Flag code="mx" className="w-7 h-5 rounded" alt="México" />
            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Casa vs De Visita — Histórico</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={COMPARACION} margin={{ top: 0, right: 16, left: -10, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={GRID_CLR} />
              <XAxis dataKey="metrica" tick={{ fill: LABEL_CLR, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: AXIS_CLR, fontSize: 11 }} unit="%" axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`${v}%`]} />
              <Legend wrapperStyle={{ color: LABEL_CLR, fontSize: 11 }} />
              <Bar dataKey="casa"  name="En casa"    fill={MX_GREEN} radius={[4,4,0,0]} opacity={0.9} />
              <Bar dataKey="fuera" name="De visita"  fill="#4b5563"  radius={[4,4,0,0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="border border-mx-green/30 rounded-lg p-3 text-center">
              <p className="text-2xl font-black text-mx-green">70.8%</p>
              <p className="text-xs text-gray-500">victorias en casa</p>
            </div>
            <div className="border border-zinc-700 rounded-lg p-3 text-center">
              <p className="text-2xl font-black text-zinc-400">49%</p>
              <p className="text-xs text-gray-500">victorias de visita</p>
            </div>
          </div>
        </div>

        {/* bonus altitud */}
        <div className="bg-mx-card border border-mx-border rounded-2xl p-5">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">
            Bonus de altitud en P(México gana) — rivales sin aclimatación
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={ALTITUD_DATA} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
              <CartesianGrid stroke={GRID_CLR} vertical={false} />
              <XAxis dataKey="altitud" tick={{ fill: AXIS_CLR, fontSize: 10 }} unit="m" axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: LABEL_CLR, fontSize: 11 }} unit=" pp" axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`+${v} pp`, "Bonus P(ganar)"]} />
              <ReferenceLine x={2240} stroke={MX_GOLD} strokeDasharray="4 4" label={{ value: "Azteca +5.6pp", fill: MX_GOLD, fontSize: 10 }} />
              <ReferenceLine x={1554} stroke={MX_BLUE} strokeDasharray="4 4" label={{ value: "Gdl +3.2pp", fill: MX_BLUE, fontSize: 9, position: "insideTopLeft" }} />
              <Line dataKey="bonus" stroke={MX_GREEN} strokeWidth={2.5}
                dot={(p) => p.payload.label ? <circle key={p.key} cx={p.cx} cy={p.cy} r={5} fill={MX_GOLD} /> : null}
                type="monotone" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-3 text-center">
            <div className="border border-mx-gold/30 rounded-lg py-2">
              <p className="text-xl font-black text-mx-gold">+5.6 pp</p>
              <p className="text-xs text-gray-500">bonus Azteca (2,240m)</p>
            </div>
            <div className="border border-blue-700/30 rounded-lg py-2">
              <p className="text-xl font-black text-blue-400">+3.2 pp</p>
              <p className="text-xs text-gray-500">bonus Guadalajara (1,554m)</p>
            </div>
          </div>
        </div>
      </div>

      {/* sedes WC históricas */}
      <div className="mt-4 bg-mx-card border border-mx-border rounded-2xl p-5">
        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">
          Ronda alcanzada por selecciones anfitrionas en cada Mundial (1=Grupos, 7=Campeón)
        </p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={SEDES_WC} margin={{ top: 0, right: 8, left: -20, bottom: 20 }}>
            <CartesianGrid vertical={false} stroke={GRID_CLR} />
            <XAxis dataKey="año" tick={{ fill: AXIS_CLR, fontSize: 9 }} angle={-45} textAnchor="end" interval={0} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 7]} ticks={[1,3,4,5,6,7]} tick={{ fill: LABEL_CLR, fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip {...TOOLTIP_STYLE} formatter={(v, n, p) => [p.payload.pais, "Sede"]} />
            <ReferenceLine y={4.2} stroke={MX_GREEN} strokeDasharray="4 4" opacity={0.5}
              label={{ value: "prom. 4.20", fill: MX_GREEN, fontSize: 9 }} />
            <Bar dataKey="ronda" radius={[3,3,0,0]} maxBarSize={22}>
              {SEDES_WC.map((d, i) => <Cell key={i} fill={d.mx ? MX_GOLD : "#3b82f6"} opacity={d.mx ? 1 : 0.6} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 p-5 bg-mx-green/5 border border-mx-green/20 rounded-xl">
        <p className="text-sm text-gray-300 leading-relaxed">
          <span className="text-mx-green font-bold">La esperanza:</span> La ronda promedio de los países sede es 4.20 — equivalente a cuartos de final.
          2 de los 3 partidos de México son en el Azteca a 2,240 metros.
          Eso no es ventaja, eso es superioridad física garantizada.
        </p>
      </div>
    </SectionWrapper>
  );
}
