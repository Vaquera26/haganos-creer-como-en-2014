import SectionWrapper from "../ui/SectionWrapper.jsx";

// ── Data exacta del script Python 06_arbol_caminos.py ─────────────────────────
const NODES = [
  { id:"start",    lines:["México","Rank 15"],              p:1.000, pg:null, lvl:0, y: 1.0  },
  { id:"grupos_G", lines:["Clasifica","1ro · 60%"],         p:0.850, pg:0.85, lvl:1, y: 1.5  },
  { id:"grupos_2", lines:["Clasifica","2do · 25%"],         p:0.850, pg:0.25, lvl:1, y: 0.5  },
  { id:"grupos_3", lines:["3ro","criterios"],               p:0.100, pg:null, lvl:1, y:-0.3  },
  { id:"r32_A",    lines:["R32 vs","Suiza/Canadá","Rk~18"], p:0.600, pg:0.62, lvl:2, y: 1.5  },
  { id:"r32_B",    lines:["R32 vs","Canadá/Suiza","Rk~22"], p:0.250, pg:0.59, lvl:2, y: 0.5  },
  { id:"r32_C",    lines:["R32","líder Rk~6"],              p:0.060, pg:0.32, lvl:2, y:-0.3  },
  { id:"r16_A",    lines:["R16 vs","Brasil/EUA","Rk~10"],   p:0.372, pg:0.45, lvl:3, y: 1.8  },
  { id:"r16_B",    lines:["R16 vs","Marruec/EUA","Rk~13"],  p:0.148, pg:0.48, lvl:3, y: 0.8  },
  { id:"r16_C",    lines:["R16","top Rk~4"],                p:0.019, pg:0.31, lvl:3, y:-0.3  },
  { id:"qf_A",     lines:["QF vs","Alem/NL","Rk~7"],        p:0.165, pg:0.39, lvl:4, y: 1.8  },
  { id:"qf_B",     lines:["QF vs","Ingl/Bélg","Rk~7"],      p:0.071, pg:0.39, lvl:4, y: 0.8  },
  { id:"sf",       lines:["SF vs","España/Fran","Rk~3"],     p:0.093, pg:0.32, lvl:5, y: 1.3  },
  { id:"final",    lines:["Final vs","Arg/Fran","Rk~1"],     p:0.030, pg:0.25, lvl:6, y: 1.3  },
  { id:"campeon",  lines:["CAMPEÓN"],                        p:0.007, pg:1.00, lvl:7, y: 1.3, special:true },
];

const EDGES = [
  ["start","grupos_G"],["start","grupos_2"],["start","grupos_3"],
  ["grupos_G","r32_A"],["grupos_2","r32_B"],["grupos_3","r32_C"],
  ["r32_A","r16_A"],["r32_B","r16_B"],["r32_C","r16_C"],
  ["r16_A","qf_A"],["r16_B","qf_B"],["r16_C","qf_B"],
  ["qf_A","sf"],["qf_B","sf"],
  ["sf","final"],["final","campeon"],
];

const STAGES = ["Inicio","Grupos","R32","R16","QF","SF","Final","Campeón"];

// ── Layout ─────────────────────────────────────────────────────────────────────
const W = 980, H = 460;
const lx = (lvl) => 60 + lvl * 120;   // 8 niveles en ~900px
const ly = (y)   => 28 + (1.8 - y) / 2.1 * 390;
const rn = (p)   => Math.max(9, Math.round(Math.sqrt(p) * 48));

// ── Colors ─────────────────────────────────────────────────────────────────────
function nodeColor({ pg, special }) {
  if (special)     return "#166534";
  if (pg === null) return "#6b7280";
  if (pg >= 0.70)  return "#166534";
  if (pg >= 0.45)  return "#2d6a4f";
  if (pg >= 0.25)  return "#991b1b";
  return "#6b0f0f";
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function Edge({ x1, y1, x2, y2 }) {
  const dx  = x2 - x1;
  const dy  = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const deg = Math.atan2(dy, dx) * (180 / Math.PI);
  return (
    <div style={{
      position: "absolute",
      left: x1,
      top:  y1,
      width: len,
      height: 1.5,
      background: "rgba(0,0,0,0.14)",
      transformOrigin: "left center",
      transform: `rotate(${deg}deg)`,
      pointerEvents: "none",
    }} />
  );
}

function Node({ cx, cy, r, fill, lines, p }) {
  const showText = r >= 22;
  const fs = r >= 38 ? 9 : 7.5;

  return (
    <>
      {/* Circle */}
      <div title={lines.join(" ") + (p < 1 ? ` · P=${Math.round(p*100)}%` : "")} style={{
        position: "absolute",
        left: cx - r,
        top:  cy - r,
        width:  r * 2,
        height: r * 2,
        borderRadius: "50%",
        background: fill,
        opacity: 0.9,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        zIndex: 2,
      }}>
        {showText && lines.map((line, i) => (
          <span key={i} style={{
            fontFamily: "ui-monospace,'Courier New',monospace",
            fontSize: fs,
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1.25,
            textAlign: "center",
            padding: "0 3px",
            whiteSpace: "nowrap",
          }}>
            {line}
          </span>
        ))}
      </div>

      {/* Label outside small circles — solo si hay suficiente espacio vertical */}
      {!showText && r >= 14 && (
        <div style={{
          position: "absolute",
          left: cx - 36,
          top:  cy - r - 16,
          width: 72,
          textAlign: "center",
          fontFamily: "ui-monospace,monospace",
          fontSize: 7.5,
          color: "#555",
          lineHeight: 1.3,
          zIndex: 3,
          pointerEvents: "none",
        }}>
          {lines[0]}
        </div>
      )}

      {/* P(llegar) below — solo si el nodo tiene tamaño suficiente */}
      {p < 1.0 && p >= 0.02 && (
        <div style={{
          position: "absolute",
          left: cx - 30,
          top:  cy + r + 4,
          width: 60,
          textAlign: "center",
          fontFamily: "ui-monospace,monospace",
          fontSize: 8,
          color: "#7a7a8a",
          zIndex: 3,
          pointerEvents: "none",
        }}>
          P={Math.round(p * 1000) / 10}%
        </div>
      )}
    </>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function S06_ArbolCaminos() {
  const nm = {};
  NODES.forEach(n => {
    nm[n.id] = { ...n, cx: lx(n.lvl), cy: ly(n.y), r: rn(n.p), fill: nodeColor(n) };
  });

  const LEGEND = [
    ["#166534", "P(ganar) ≥ 70%"],
    ["#2d6a4f", "45–69%"],
    ["#991b1b", "25–44%"],
    ["#6b0f0f", "< 25%"],
    ["#6b7280", "clasificación"],
  ];

  return (
    <SectionWrapper id="s06" number={6}
      title="Árbol de Caminos Posibles"
      subtitle="Hay versiones de este torneo donde el camino de México a cuartos no pasa por ningún top cinco del mundo. También hay versiones donde se cruza con Francia en el quinto partido. El bracket es fijo — no hay redraw — y eso significa que la ruta entera se puede trazar desde ahora. Todo depende de quién gana qué en los grupos.">

      <div className="card" style={{ padding: 16, overflowX: "auto" }}>
        {/* Container */}
        <div style={{ position: "relative", width: W, height: H, minWidth: W }}>

          {/* Edges (renderizar primero = detrás de los nodos) */}
          {EDGES.map(([src, dst]) => {
            const s = nm[src], d = nm[dst];
            return <Edge key={`${src}-${dst}`} x1={s.cx} y1={s.cy} x2={d.cx} y2={d.cy} />;
          })}

          {/* Nodos */}
          {NODES.map(n => {
            const node = nm[n.id];
            return <Node key={n.id} {...node} />;
          })}

          {/* Stage labels */}
          {STAGES.map((s, i) => (
            <div key={s} style={{
              position: "absolute",
              left: lx(i) - 40,
              top: H - 22,
              width: 80,
              textAlign: "center",
              fontFamily: "ui-monospace,monospace",
              fontSize: 10,
              color: "#7a7a8a",
              fontStyle: "italic",
            }}>
              {s}
            </div>
          ))}

          {/* Stage axis line */}
          <div style={{
            position: "absolute",
            left: lx(0), top: H - 28,
            width: lx(7) - lx(0),
            height: 1,
            background: "rgba(0,0,0,0.07)",
          }} />

        </div>

        {/* Leyenda abajo — fuera del canvas para no solaparse */}
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
          {LEGEND.map(([col, label]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: col, opacity: 0.9, flexShrink: 0 }} />
              <span style={{ fontFamily: "ui-monospace,monospace", fontSize: 9, color: "#555" }}>{label}</span>
            </div>
          ))}
          <span style={{ fontFamily: "ui-monospace,monospace", fontSize: 9, color: "var(--text-muted)", marginLeft: "auto" }}>
            Tamaño ∝ P(llegar) · Color = dificultad del partido
          </span>
        </div>
      </div>
    </SectionWrapper>
  );
}
