import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, LineChart, Line, ReferenceLine, ResponsiveContainer } from "recharts";
import SectionWrapper from "../ui/SectionWrapper.jsx";
import Flag from "../ui/Flag.jsx";
import { MX_GREEN, MX_RED, MX_GOLD, AXIS_CLR, GRID_CLR, TOOLTIP_STYLE } from "../../theme.js";
import imgAzteca from "../../mundiales/984331.jpg_1902800913.webp";

const COMP = [
  { m: "Victorias", casa: 70.8, fuera: 49.0 },
  { m: "Empates",   casa: 18.3, fuera: 22.4 },
  { m: "Derrotas",  casa: 10.8, fuera: 28.6 },
];
const ALT = [
  { a: 0, b: 0 }, { a: 500, b: 1.2 }, { a: 1000, b: 2.4 },
  { a: 1554, b: 3.2 }, { a: 2000, b: 4.8 }, { a: 2240, b: 5.6 },
  { a: 2500, b: 6.5 }, { a: 3000, b: 8.5 },
];
const SEDES = [
  { a: "1970", r: 4, mx: true }, { a: "1974", r: 7 }, { a: "1978", r: 7 }, { a: "1982", r: 2 },
  { a: "1986", r: 4, mx: true }, { a: "1990", r: 5 }, { a: "1994", r: 3 }, { a: "1998", r: 7 },
  { a: "2002", r: 5 }, { a: "2006", r: 5 }, { a: "2010", r: 1 }, { a: "2014", r: 5 },
  { a: "2018", r: 4 }, { a: "2022", r: 1 },
];
export default function S08_EfectoLocalia() {
  return (
    <SectionWrapper id="s08" number={8}
      title="El Efecto de Localía"
      subtitle="El Azteca está a 2,240 metros sobre el nivel del mar y abre el torneo el 11 de junio — se convierte en el primer estadio de la historia en inaugurar tres Mundiales distintos. La ventaja es real, pero tiene fecha de vencimiento: de cuartos de final en adelante, todos los partidos se juegan en Estados Unidos. México tiene en casa los grupos y posiblemente la ronda de 32 y octavos. Es una ventaja enorme, pero solo si avanza lo suficiente para aprovecharse de ella."
      image={imgAzteca} imageLeft={true}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div className="card">
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <Flag code="mx" className="w-7 h-5 rounded" alt="México" />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: "#555" }}>
              Casa vs De Visita — Histórico
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={COMP} margin={{ top: 0, right: 12, left: -10, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={GRID_CLR} strokeDasharray="3 3" />
              <XAxis dataKey="m" tick={{ fill: "#444", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: AXIS_CLR, fontSize: 10 }} unit="%" axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`${v}%`]} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#555" }} />
              <Bar dataKey="casa"  name="En casa"    fill={MX_GREEN} radius={[3,3,0,0]} opacity={0.85} />
              <Bar dataKey="fuera" name="De visita"  fill="#9ca3af"  radius={[3,3,0,0]} opacity={0.75} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
            {[["70.8%", "victorias en casa", MX_GREEN], ["49%", "victorias de visita", "#9ca3af"]].map(([v, l, c]) => (
              <div key={l} style={{ border: `1px solid ${c}40`, borderRadius: 3, padding: "6px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: c }}>{v}</div>
                <div style={{ fontSize: 10, color: "#888" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="chart-label">
            Bonus en P(ganar) según altitud del estadio
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={ALT} margin={{ top: 8, right: 12, left: -10, bottom: 0 }}>
              <CartesianGrid stroke={GRID_CLR} vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="a" tick={{ fill: AXIS_CLR, fontSize: 9 }} unit="m" axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#555", fontSize: 9 }} unit=" pp" axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`+${v} pp`, "Bonus P(ganar)"]} />
              <ReferenceLine x={2240} stroke={MX_GOLD} strokeDasharray="4 2"
                label={{ value: "Azteca +5.6pp", fill: MX_GOLD, fontSize: 9 }} />
              <ReferenceLine x={1554} stroke={MX_GREEN} strokeDasharray="4 2"
                label={{ value: "Gdl +3.2pp", fill: MX_GREEN, fontSize: 9, position: "insideTopLeft" }} />
              <Line dataKey="b" stroke={MX_GREEN} strokeWidth={2}
                dot={(p) => [2240, 1554].includes(p.payload.a) ? <circle key={p.key} cx={p.cx} cy={p.cy} r={5} fill={MX_GOLD} stroke="#fff" strokeWidth={1.5} /> : null}
                type="monotone" />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
            {[["+5.6 pp", "Azteca (2,240m)", MX_GOLD], ["+3.2 pp", "Guadalajara (1,554m)", MX_GREEN]].map(([v, l, c]) => (
              <div key={l} style={{ border: `1px solid ${c}40`, borderRadius: 3, padding: "6px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: c }}>{v}</div>
                <div style={{ fontSize: 10, color: "#888" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="chart-label">
          Ronda alcanzada por sedes mundialistas 1970+ · Promedio: 4.20
        </div>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={SEDES} margin={{ top: 0, right: 8, left: -20, bottom: 16 }}>
            <CartesianGrid vertical={false} stroke={GRID_CLR} strokeDasharray="3 3" />
            <XAxis dataKey="a" tick={{ fill: AXIS_CLR, fontSize: 9 }} angle={-45} textAnchor="end" interval={0} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 7]} tick={{ fill: "#555", fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip {...TOOLTIP_STYLE} />
            <ReferenceLine y={4.2} stroke={MX_GREEN} strokeDasharray="4 2" opacity={0.6}
              label={{ value: "prom 4.20", fill: MX_GREEN, fontSize: 9 }} />
            <Bar dataKey="r" radius={[2,2,0,0]} maxBarSize={24}>
              {SEDES.map((d, i) => <Cell key={i} fill={d.mx ? MX_GOLD : "#6b7280"} opacity={d.mx ? 1 : 0.55} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
</SectionWrapper>
  );
}
