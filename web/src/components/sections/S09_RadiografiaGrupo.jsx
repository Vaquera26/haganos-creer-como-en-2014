import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import SectionWrapper from "../ui/SectionWrapper.jsx";
import Flag from "../ui/Flag.jsx";
import { MX_GREEN, MX_RED, MX_GOLD, MX_BLUE, AXIS_CLR, GRID_CLR, TOOLTIP_STYLE } from "../../theme.js";
import imgGrupo from "../../mundiales/100619121129_mundial_mexico_blanco_body_226x170_afp.jpg.webp";

const EQ = [
  { n: "México",        f: "mx", rank: 15, elo: 1688, forma: 77, xg: 1.65, xga: 0.72, wc: 18, c: MX_GREEN },
  { n: "Corea del Sur", f: "kr", rank: 25, elo: 1600, forma: 58, xg: 1.35, xga: 0.98, wc: 11, c: MX_RED   },
  { n: "Chequia",       f: "cz", rank: 41, elo: 1488, forma: 47, xg: 1.15, xga: 1.12, wc: 10, c: MX_BLUE  },
  { n: "Sudáfrica",     f: "za", rank: 60, elo: 1352, forma: 38, xg: 0.98, xga: 1.35, wc: 4,  c: MX_GOLD  },
];

const fn = (e) => ({
  Ranking:     (101 - e.rank) / 100 * 10,
  Ataque:      Math.min(10, e.xg / 2 * 10),
  Defensa:     Math.max(0, (2 - e.xga) / 1.5 * 10),
  Forma:       e.forma / 10,
  Experiencia: Math.min(10, e.wc / 2),
});

const RADAR = ["Ranking", "Ataque", "Defensa", "Forma", "Experiencia"].map((s) => ({
  subject: s, ...Object.fromEntries(EQ.map((e) => [e.n, fn(e)[s]])),
}));

const CRUCES = [
  { p: "MX vs SUD", g: 80.1, e: 13.8, d: 6.2  },
  { p: "KOR vs MX", g: 47.4, e: 22.8, d: 29.9 },
  { p: "CZE vs MX", g: 62.7, e: 18.3, d: 18.9 },
];

export default function S09_RadiografiaGrupo() {
  return (
    <SectionWrapper id="s09" number={9}
      title="Radiografía del Grupo A"
      subtitle="En Qatar 2022 le tocó Argentina, Polonia y Arabia Saudita. Antes, en Brasil 2014, Camerún, Croacia y Brasil. Ahora: Corea del Sur, Chequia y Sudáfrica. El 11 de junio México abre el torneo contra Sudáfrica en el Azteca — el primer partido del Mundial, en el estadio que por primera vez en la historia inaugura tres Copas del Mundo distintas. El grupo no es una sentencia de muerte. Pero el partido inaugural del torneo con toda la presión encima tampoco es un trámite."
      image={imgGrupo} imageLeft={true}>
      <div className="g-2">
        <div className="card">
          <div className="chart-label">
            Perfil comparativo Grupo A (0-10)
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={RADAR} margin={{ top: 10, right: 40, bottom: 10, left: 40 }}>
              <PolarGrid stroke={GRID_CLR} />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#555", fontSize: 10 }} />
              <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: AXIS_CLR, fontSize: 8 }} />
              {EQ.map((e) => (
                <Radar key={e.n} name={e.n} dataKey={e.n} stroke={e.c} fill={e.c}
                  fillOpacity={e.n === "México" ? 0.25 : 0.07}
                  strokeWidth={e.n === "México" ? 2.5 : 1.2} />
              ))}
              <Tooltip {...TOOLTIP_STYLE} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#555" }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="card">
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <th style={{ textAlign: "left", padding: "5px 8px", fontSize: 10, fontWeight: 600, color: "#444", textTransform: "uppercase" }}>Equipo</th>
                  <th style={{ textAlign: "center", padding: "5px 8px", fontSize: 10, fontWeight: 600, color: "#444" }}>FIFA</th>
                  <th style={{ textAlign: "center", padding: "5px 8px", fontSize: 10, fontWeight: 600, color: "#444" }}>Elo</th>
                  <th style={{ textAlign: "center", padding: "5px 8px", fontSize: 10, fontWeight: 600, color: "#444" }}>Forma</th>
                  <th style={{ textAlign: "center", padding: "5px 8px", fontSize: 10, fontWeight: 600, color: "#444" }}>WC</th>
                </tr>
              </thead>
              <tbody>
                {EQ.map((e, i) => (
                  <tr key={e.n} style={{ background: i % 2 === 0 ? "#fff" : "#f9f9f9", borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: "6px 8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Flag code={e.f} className="w-7 h-5 rounded" alt={e.n} />
                        <span style={{ fontWeight: e.n === "México" ? 700 : 400, color: e.n === "México" ? MX_GREEN : "#111" }}>{e.n}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: "center", padding: "6px 8px", fontWeight: 700, color: e.n === "México" ? MX_GREEN : "#111" }}>#{e.rank}</td>
                    <td style={{ textAlign: "center", padding: "6px 8px", color: "#555" }}>{e.elo}</td>
                    <td style={{ textAlign: "center", padding: "6px 8px", fontWeight: 700, color: e.forma >= 70 ? MX_GREEN : e.forma >= 50 ? MX_GOLD : "#9ca3af" }}>{e.forma}%</td>
                    <td style={{ textAlign: "center", padding: "6px 8px", color: "#888" }}>{e.wc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card">
            <div className="chart-label">
              P(México gana) en cruces del grupo
            </div>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={CRUCES} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid horizontal={false} stroke={GRID_CLR} strokeDasharray="3 3" />
                <XAxis dataKey="p" tick={{ fill: "#444", fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: AXIS_CLR, fontSize: 9 }} unit="%" axisLine={false} tickLine={false} />
                <Tooltip {...TOOLTIP_STYLE} />
                <Bar dataKey="g" name="MX gana"    fill={MX_GREEN} stackId="a" />
                <Bar dataKey="e" name="Empate"     fill={MX_GOLD}  stackId="a" />
                <Bar dataKey="d" name="Rival gana" fill={MX_RED}   stackId="a" radius={[2,2,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
</SectionWrapper>
  );
}
