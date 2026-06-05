import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, PieChart, Pie, Legend, ResponsiveContainer } from "recharts";
import SectionWrapper from "../ui/SectionWrapper.jsx";
import { MX_GREEN, MX_RED, MX_GOLD, AXIS_CLR, GRID_CLR, TOOLTIP_STYLE } from "../../theme.js";
import imgQuinto from "../../mundiales/I6TFQFYW7BCKBENZ5MRMCQPAR4.jpg";

const DATA = [
  { etapa: "Grupos",    pLlegar: 100.0, pElim: 24.0,  fill: MX_RED    },
  { etapa: "R32 (J4)",  pLlegar: 76.0,  pElim: 32.6,  fill: "#374151" },
  { etapa: "R16 (J5) ← maldición", pLlegar: 43.4, pElim: 18.3, fill: MX_GOLD },
  { etapa: "QF (J6)",   pLlegar: 25.1,  pElim: 14.8,  fill: MX_GOLD   },
  { etapa: "SF (J7)",   pLlegar: 10.3,  pElim: 6.4,   fill: MX_GREEN  },
  { etapa: "Final(J8)", pLlegar: 3.9,   pElim: 2.5,   fill: MX_GREEN  },
  { etapa: "Campeón",   pLlegar: 1.4,   pElim: 1.4,   fill: MX_GREEN  },
];

export default function S01_RutaQuintoPartido() {
  return (
    <SectionWrapper id="s01" number={1}
      title="La Ruta del Quinto Partido"
      subtitle="1994, 1998, 2002, 2006, 2010, 2014, 2018. Siete veces consecutivas al cuarto partido y no más. En 2022 ni eso. El quinto partido es el partido que ningún mexicano menor de cuarenta años ha visto en vivo en un Mundial. El modelo dice que en poco menos de la mitad de las simulaciones México llega ahí. El problema es que en la vida real solo se juega una vez."
      image={imgQuinto}>
      <div className="g-side">
        <div className="card">
          <div className="chart-label">
            % que llega a cada ronda · 100,000 simulaciones
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={DATA} layout="vertical" margin={{ top: 0, right: 55, left: 12, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke={GRID_CLR} strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: AXIS_CLR, fontSize: 9 }} tickLine={false} axisLine={false} unit="%" />
              <YAxis type="category" dataKey="etapa" tick={{ fill: "#444", fontSize: 11 }} width={120} axisLine={false} tickLine={false} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`${v}%`, "P(llegar)"]} />
              <Bar dataKey="pLlegar" radius={[0, 3, 3, 0]}
                label={{ position: "right", formatter: (v) => `${v}%`, fill: "#444", fontSize: 10, fontWeight: 700 }}>
                {DATA.map((d, i) => <Cell key={i} fill={d.fill} opacity={d.etapa.includes("maldición") ? 1 : 0.8} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="chart-label">
            Distribución de eliminaciones
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={DATA.map((d) => ({ name: d.etapa.replace(" ← maldición", ""), value: d.pElim }))}
                cx="50%" cy="50%" innerRadius={50} outerRadius={85}
                dataKey="value" paddingAngle={2}>
                {DATA.map((d, i) => <Cell key={i} fill={d.fill} opacity={0.8} />)}
              </Pie>
              <Tooltip {...TOOLTIP_STYLE} formatter={(v) => [`${v}%`, "eliminados aquí"]} />
            </PieChart>
          </ResponsiveContainer>
          {DATA.map((d) => (
            <div key={d.etapa} style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#888", marginTop: 4 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: d.fill, display: "inline-block" }} />
                {d.etapa.replace(" ← maldición", "")}
              </span>
              <span style={{ color: "#444", fontWeight: 700 }}>{d.pElim}%</span>
            </div>
          ))}
        </div>
      </div>
</SectionWrapper>
  );
}
