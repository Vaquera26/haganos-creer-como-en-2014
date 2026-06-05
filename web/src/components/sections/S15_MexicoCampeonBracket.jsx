import { useState, useCallback, useMemo } from "react";
import SectionWrapper from "../ui/SectionWrapper.jsx";
import BRACKET_INICIAL from "../../data/bracket_simulado.json";
import { simularHastaGanar } from "../../data/simulacionEngine.js";

// ── Colores ───────────────────────────────────────────────────────────────────
const C = {
  mx:     "#166534",   mxT: "#ffffff",
  win:    "#ffffff",   winT: "#08080f",
  los:    "#ffffff",   losT: "#9ca3af",
  mxL:    "#166534",   normL: "#e5e7eb",
  gold:   "#166534",   border: "none",
};

// ── Layout ────────────────────────────────────────────────────────────────────
const W = 1600, H = 640;
const BW = 140, TH = 24, MH = 50;
const MS = 80;   // R32 vertical spacing
const RS = 175;  // horizontal round step
const FX = W / 2;

const COL = {
  r32L: FX - RS * 4, r16L: FX - RS * 3, qfL: FX - RS * 2, sfL: FX - RS,
  fin:  FX,
  sfR:  FX + RS,     qfR:  FX + RS * 2, r16R: FX + RS * 3, r32R: FX + RS * 4,
};

// Y helpers
const r32Y  = (i) => 15 + i * MS;
const r32CY = (i) => r32Y(i) + MH / 2;
const r16CY = (i) => (r32CY(i*2) + r32CY(i*2+1)) / 2;
const r16Y  = (i) => r16CY(i) - MH / 2;
const qfCY  = (i) => (r16CY(i*2) + r16CY(i*2+1)) / 2;
const qfY   = (i) => qfCY(i) - MH / 2;
const sfCY  = ()  => (qfCY(0) + qfCY(1)) / 2;
const sfY   = ()  => sfCY() - MH / 2;

// DATA se calcula dentro del componente usando el state BRACKET

// ── Helper: is this team México? ─────────────────────────────────────────────
const isMX = (name) => name === "México";

// ── Render: un partido (dos filas de equipo) ──────────────────────────────────
function Match({ cx, matchY, match }) {
  const { a, af, b, bf, s, w } = match;
  const bx = cx - BW / 2;
  const hasMx = isMX(a) || isMX(b);
  const borderClr = hasMx ? C.mx : "#e5e7eb";
  const bw = hasMx ? 2 : 1;

  const teams = [
    { name: a, flag: af, winner: w === 0, ty: matchY },
    { name: b, flag: bf, winner: w === 1, ty: matchY + TH },
  ];

  return (
    <g>
      {teams.map((t, i) => {
        const mx = isMX(t.name);
        const bg  = mx ? C.mx : t.winner ? C.win : C.los;
        const tc  = mx ? C.mxT : t.winner ? C.winT : C.losT;
        const sc  = t.winner ? s : "";
        return (
          <g key={i}>
            <rect x={bx+bw/2} y={t.ty+(i===0?bw/2:0)} width={BW-bw} height={TH-(i===0?bw/2:bw/2)} fill={bg} />
            <image href={`https://flagcdn.com/${t.flag}.svg`} x={bx+5} y={t.ty+5} width={20} height={14} />
            <text x={bx+29} y={t.ty+16} fontSize="9" fontFamily="ui-monospace,monospace"
              fontWeight={t.winner ? "700" : "400"} fill={tc}>
              {t.name.length > 11 ? t.name.slice(0,10)+"…" : t.name}
            </text>
            {sc && (
              <text x={bx+BW-5} y={t.ty+16} textAnchor="end" fontSize="8"
                fontFamily="ui-monospace,monospace" fontWeight="700"
                fill={mx ? "#86efac" : "#166534"}>{sc}</text>
            )}
          </g>
        );
      })}
      {/* separator */}
      <line x1={bx} y1={matchY+TH} x2={bx+BW} y2={matchY+TH} stroke={borderClr} strokeWidth={1} />
      {/* border */}
      <rect x={bx} y={matchY} width={BW} height={MH} fill="none"
        stroke={borderClr} strokeWidth={bw} rx={3} />
    </g>
  );
}

// ── Render: conector L-shape ──────────────────────────────────────────────────
function Conn({ x1, y1, x2, y2, mx }) {
  const xm = (x1 + x2) / 2;
  return (
    <path d={`M${x1},${y1}H${xm}V${y2}H${x2}`} fill="none"
      stroke={mx ? C.mxL : C.normL} strokeWidth={mx ? 2 : 1} opacity={mx ? 1 : 0.7} />
  );
}

// ── Helper: winner name of a match ────────────────────────────────────────────
const winnerOf = (m) => m.w === 0 ? m.a : m.b;
const winnerFlag = (m) => m.w === 0 ? m.af : m.bf;

// ── Main component ────────────────────────────────────────────────────────────
export default function S15_MexicoCampeonBracket() {
  const [BRACKET, setBracket] = useState(BRACKET_INICIAL);
  const [simulando, setSimulando] = useState(false);
  const [tabGrupo, setTabGrupo] = useState("A");
  const GRUPOS_LABELS = ["A","B","C","D","E","F","G","H","I","J","K","L"];

  const resimular = useCallback(() => {
    setSimulando(true);
    // setTimeout para que React renderice el estado "simulando" antes de bloquear
    setTimeout(() => {
      try {
        const nuevo = simularHastaGanar();
        setBracket(nuevo);
      } catch(e) {
        console.error(e);
      } finally {
        setSimulando(false);
      }
    }, 30);
  }, []);

  const DATA = {
    r32L: BRACKET.r32.slice(0, 8),
    r32R: BRACKET.r32.slice(8, 16),
    r16L: BRACKET.r16.slice(0, 4),
    r16R: BRACKET.r16.slice(4, 8),
    qfL:  BRACKET.qf.slice(0, 2),
    qfR:  BRACKET.qf.slice(2, 4),
    sfL:  [BRACKET.sf[0]],
    sfR:  [BRACKET.sf[1]],
    fin:  BRACKET.final,
  };

  const champY = sfCY() + MH/2 + 20;
  const STAGE_LABELS = [
    [COL.r32L,"R32"],[COL.r16L,"OCTAVOS"],[COL.qfL,"CUARTOS"],
    [COL.sfL,"SEMIS"],[COL.fin,"FINAL"],[COL.sfR,"SEMIS"],
    [COL.qfR,"CUARTOS"],[COL.r16R,"OCTAVOS"],[COL.r32R,"R32"],
  ];

  return (
    <SectionWrapper id="s15" number={15}
      title="México Campeón del Mundo 2026"
      subtitle={`Simulación #${BRACKET.intentos} — El camino: ${BRACKET.log_mexico.map(l => `${l.ronda} vs ${l.rival} (${l.score}${l.penales?" pen":""})`).join(" · ")}.`}>

      {/* ── Botón resimular ── */}
      <div style={{ marginBottom: 16 }}>
        <button
          onClick={resimular}
          disabled={simulando}
          style={{
            padding: "8px 18px",
            background: simulando ? "var(--bg-surface)" : "var(--text)",
            color: simulando ? "var(--text-muted)" : "#ffffff",
            border: "1px solid var(--border-mid)",
            borderRadius: 6,
            fontFamily: "ui-monospace,monospace",
            fontSize: 11, fontWeight: 700,
            letterSpacing: "0.08em",
            cursor: simulando ? "wait" : "pointer",
            transition: "all 0.15s",
          }}
        >
          {simulando ? "SIMULANDO..." : "SIMULAR DE NUEVO"}
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflowX: "auto" }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", minWidth: 900, display: "block" }}>

          {/* ── Stage labels ── */}
          {STAGE_LABELS.map(([x, lbl]) => (
            <text key={lbl+x} x={x} y={8} textAnchor="middle" fontSize="9" fontWeight="700"
              fontFamily="ui-monospace,monospace" fill="#7a7a8a" letterSpacing="1">{lbl}</text>
          ))}

          {/* ── Connectors LEFT R32→R16 ── */}
          {[0,1,2,3].map(i => {
            const srcA = DATA.r32L[i*2],   mAY = r32Y(i*2),   sAw = DATA.r32L[i*2].w;
            const srcB = DATA.r32L[i*2+1], mBY = r32Y(i*2+1), sBw = DATA.r32L[i*2+1].w;
            const tgtY = r16Y(i);
            return (
              <g key={`r32l-conn-${i}`}>
                <Conn x1={COL.r32L+BW/2} y1={mAY+sAw*TH+TH/2} x2={COL.r16L-BW/2} y2={tgtY+TH/2}   mx={isMX(winnerOf(srcA))} />
                <Conn x1={COL.r32L+BW/2} y1={mBY+sBw*TH+TH/2} x2={COL.r16L-BW/2} y2={tgtY+TH+TH/2} mx={isMX(winnerOf(srcB))} />
              </g>
            );
          })}

          {/* ── Connectors LEFT R16→QF ── */}
          {[0,1].map(i => {
            const srcA = DATA.r16L[i*2],   mAY = r16Y(i*2),   sAw = DATA.r16L[i*2].w;
            const srcB = DATA.r16L[i*2+1], mBY = r16Y(i*2+1), sBw = DATA.r16L[i*2+1].w;
            const tgtY = qfY(i);
            return (
              <g key={`r16l-conn-${i}`}>
                <Conn x1={COL.r16L+BW/2} y1={mAY+sAw*TH+TH/2} x2={COL.qfL-BW/2} y2={tgtY+TH/2}    mx={isMX(winnerOf(srcA))} />
                <Conn x1={COL.r16L+BW/2} y1={mBY+sBw*TH+TH/2} x2={COL.qfL-BW/2} y2={tgtY+TH+TH/2} mx={isMX(winnerOf(srcB))} />
              </g>
            );
          })}

          {/* ── Connectors LEFT QF→SF ── */}
          {[0,1].map(i => {
            const src = DATA.qfL[i], mY = qfY(i), sw = DATA.qfL[i].w;
            const tgtY = sfY();
            return <Conn key={`qfl-conn-${i}`} x1={COL.qfL+BW/2} y1={mY+sw*TH+TH/2} x2={COL.sfL-BW/2} y2={tgtY+i*TH+TH/2} mx={isMX(winnerOf(src))} />;
          })}

          {/* ── Connector LEFT SF→Final ── */}
          <Conn x1={COL.sfL+BW/2} y1={sfY()+DATA.sfL[0].w*TH+TH/2} x2={COL.fin-BW/2} y2={sfY()+TH/2} mx={isMX(winnerOf(DATA.sfL[0]))} />

          {/* ── Connectors RIGHT R32→R16 ── */}
          {[0,1,2,3].map(i => {
            const srcA = DATA.r32R[i*2],   mAY = r32Y(i*2),   sAw = DATA.r32R[i*2].w;
            const srcB = DATA.r32R[i*2+1], mBY = r32Y(i*2+1), sBw = DATA.r32R[i*2+1].w;
            const tgtY = r16Y(i);
            return (
              <g key={`r32r-conn-${i}`}>
                <Conn x1={COL.r32R-BW/2} y1={mAY+sAw*TH+TH/2} x2={COL.r16R+BW/2} y2={tgtY+TH/2}    mx={false} />
                <Conn x1={COL.r32R-BW/2} y1={mBY+sBw*TH+TH/2} x2={COL.r16R+BW/2} y2={tgtY+TH+TH/2} mx={false} />
              </g>
            );
          })}

          {/* ── Connectors RIGHT R16→QF ── */}
          {[0,1].map(i => {
            const srcA = DATA.r16R[i*2],   mAY = r16Y(i*2),   sAw = DATA.r16R[i*2].w;
            const srcB = DATA.r16R[i*2+1], mBY = r16Y(i*2+1), sBw = DATA.r16R[i*2+1].w;
            const tgtY = qfY(i);
            return (
              <g key={`r16r-conn-${i}`}>
                <Conn x1={COL.r16R-BW/2} y1={mAY+sAw*TH+TH/2} x2={COL.qfR+BW/2} y2={tgtY+TH/2}    mx={false} />
                <Conn x1={COL.r16R-BW/2} y1={mBY+sBw*TH+TH/2} x2={COL.qfR+BW/2} y2={tgtY+TH+TH/2} mx={false} />
              </g>
            );
          })}

          {/* ── Connectors RIGHT QF→SF ── */}
          {[0,1].map(i => {
            const mY = qfY(i), sw = DATA.qfR[i].w;
            const tgtY = sfY();
            return <Conn key={`qfr-conn-${i}`} x1={COL.qfR-BW/2} y1={mY+sw*TH+TH/2} x2={COL.sfR+BW/2} y2={tgtY+i*TH+TH/2} mx={false} />;
          })}

          {/* ── Connector RIGHT SF→Final ── */}
          <Conn x1={COL.sfR-BW/2} y1={sfY()+DATA.sfR[0].w*TH+TH/2} x2={COL.fin+BW/2} y2={sfY()+TH+TH/2} mx={false} />

          {/* ── Connector Final→Champion ── */}
          <line x1={FX} y1={sfY()+MH} x2={FX} y2={champY} stroke={C.mx} strokeWidth={2} />

          {/* ── R32 Matches LEFT ── */}
          {DATA.r32L.map((m, i) => <Match key={`r32L-${i}`} cx={COL.r32L} matchY={r32Y(i)} match={m} />)}
          {/* ── R16 Matches LEFT ── */}
          {DATA.r16L.map((m, i) => <Match key={`r16L-${i}`} cx={COL.r16L} matchY={r16Y(i)} match={m} />)}
          {/* ── QF Matches LEFT ── */}
          {DATA.qfL.map((m, i) => <Match key={`qfL-${i}`} cx={COL.qfL} matchY={qfY(i)} match={m} />)}
          {/* ── SF Match LEFT ── */}
          <Match cx={COL.sfL} matchY={sfY()} match={DATA.sfL[0]} />

          {/* ── FINAL ── */}
          <Match cx={COL.fin} matchY={sfY()} match={DATA.fin} />

          {/* ── SF Match RIGHT ── */}
          <Match cx={COL.sfR} matchY={sfY()} match={DATA.sfR[0]} />
          {/* ── QF Matches RIGHT ── */}
          {DATA.qfR.map((m, i) => <Match key={`qfR-${i}`} cx={COL.qfR} matchY={qfY(i)} match={m} />)}
          {/* ── R16 Matches RIGHT ── */}
          {DATA.r16R.map((m, i) => <Match key={`r16R-${i}`} cx={COL.r16R} matchY={r16Y(i)} match={m} />)}
          {/* ── R32 Matches RIGHT ── */}
          {DATA.r32R.map((m, i) => <Match key={`r32R-${i}`} cx={COL.r32R} matchY={r32Y(i)} match={m} />)}

          {/* ── Champion box ── */}
          <rect x={FX-95} y={champY} width={190} height={64} fill={C.mx} rx={6} />
          <text x={FX} y={champY+16} textAnchor="middle" fontSize="9" fontWeight="700"
            fontFamily="ui-monospace,monospace" fill="rgba(255,255,255,0.7)" letterSpacing="1">
            CAMPEÓN DEL MUNDO
          </text>
          <image href="https://flagcdn.com/mx.svg" x={FX-50} y={champY+24} width={32} height={22} />
          <text x={FX-10} y={champY+42} fontSize="20" fontWeight="900" fill="#fff"
            fontFamily="system-ui,-apple-system,sans-serif" letterSpacing="-0.5">
            MÉXICO
          </text>
          <text x={FX} y={champY+58} textAnchor="middle" fontSize="8"
            fontFamily="ui-monospace,monospace" fill="rgba(255,255,255,0.6)">
            ~1.4% de probabilidad · 1 de cada 72 simulaciones
          </text>

          {/* ── Legend ── */}
          <g transform={`translate(${FX-200},${H-28})`}>
            <rect x={0} y={0} width={14} height={14} fill={C.mx} rx={2}/>
            <text x={18} y={11} fontSize="9" fontFamily="ui-monospace,monospace" fill="#555">México</text>
            <rect x={75} y={0} width={14} height={14} fill={C.win} rx={2}/>
            <text x={93} y={11} fontSize="9" fontFamily="ui-monospace,monospace" fill="#555">Ganador</text>
            <rect x={168} y={0} width={14} height={14} fill={C.los} rx={2} stroke={C.border} strokeWidth={1}/>
            <text x={186} y={11} fontSize="9" fontFamily="ui-monospace,monospace" fill="#555">Eliminado</text>
            <line x1={285} y1={7} x2={315} y2={7} stroke={C.mxL} strokeWidth={2}/>
            <text x={319} y={11} fontSize="9" fontFamily="ui-monospace,monospace" fill="#555">Camino México</text>
          </g>
        </svg>
      </div>

      {/* ── FASE DE GRUPOS CON TABS ── */}
      <div style={{ marginTop: 12 }}>

        {/* Tabs A–L */}
        <div style={{ display: "flex", gap: 2, marginBottom: 0, overflowX: "auto" }}>
          {GRUPOS_LABELS.map(lbl => (
            <button key={lbl} onClick={() => setTabGrupo(lbl)} style={{
              padding: "7px 16px",
              fontFamily: "ui-monospace,monospace", fontSize: 11, fontWeight: 700,
              letterSpacing: "0.08em",
              background: tabGrupo === lbl ? "var(--text)" : "var(--bg-surface)",
              color: tabGrupo === lbl ? "#fff" : "var(--text-muted)",
              border: "1px solid var(--border-mid)",
              borderBottom: tabGrupo === lbl ? "1px solid var(--text)" : "1px solid var(--border-mid)",
              borderRadius: "4px 4px 0 0",
              cursor: "pointer",
              transition: "all 0.1s",
              flexShrink: 0,
            }}>
              {lbl}
            </button>
          ))}
        </div>

        {/* Contenido del tab seleccionado */}
        {(() => {
          const gdata = BRACKET.grupos?.[tabGrupo];
          if (!gdata) return null;
          const partidos = gdata.partidos ?? [];
          const tabla    = gdata.tabla ?? [];
          const esMxGrupo = tabGrupo === "A";

          return (
            <div style={{
              border: "1px solid var(--border-mid)", borderTop: "none",
              background: "var(--bg)", padding: 16,
            }}>
              <div className="g-2">

                {/* Partidos */}
                <div className="card" style={{ padding: 16 }}>
                  <div className="chart-label">
                    Grupo {tabGrupo} · {esMxGrupo ? "Partidos de México" : "Partidos"}
                  </div>
                  {(esMxGrupo
                    ? partidos.filter(p => p.a === "México" || p.b === "México")
                    : partidos
                  ).map((p, i) => {
                    const esHome  = esMxGrupo ? p.a === "México" : true;
                    const teamA   = p.a;  const flagA = p.af;
                    const teamB   = p.b;  const flagB = p.bf;
                    const isMxP   = teamA === "México" || teamB === "México";
                    const resA    = p.ga > p.gb ? "G" : p.ga === p.gb ? "E" : "P";
                    const resB    = p.ga < p.gb ? "G" : p.ga === p.gb ? "E" : "P";
                    const cA = resA === "G" ? "var(--on-color)" : resA === "E" ? "var(--text-muted)" : "var(--red-color)";
                    const cB = resB === "G" ? "var(--on-color)" : resB === "E" ? "var(--text-muted)" : "var(--red-color)";
                    return (
                      <div key={i} style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "9px 0",
                        borderBottom: i < partidos.length - 1 ? "1px solid var(--border)" : "none",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5, flex: 1 }}>
                          <img src={`https://flagcdn.com/${flagA}.svg`} alt={teamA}
                            style={{ width: 20, height: 13, objectFit: "cover", borderRadius: 1 }} />
                          <span style={{ fontFamily: "var(--sans)", fontSize: 11,
                            fontWeight: teamA === "México" ? 700 : 400,
                            color: teamA === "México" ? "var(--on-color)" : "var(--text)" }}>
                            {teamA.length > 12 ? teamA.slice(0,11)+"…" : teamA}
                          </span>
                        </div>
                        <div style={{ textAlign: "center", minWidth: 56 }}>
                          <span style={{ fontFamily: "var(--mono)", fontSize: 15, fontWeight: 900,
                            letterSpacing: "-0.02em", color: "var(--text)" }}>
                            {p.ga} – {p.gb}
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 5, flex: 1, justifyContent: "flex-end" }}>
                          <span style={{ fontFamily: "var(--sans)", fontSize: 11,
                            fontWeight: teamB === "México" ? 700 : 400,
                            color: teamB === "México" ? "var(--on-color)" : "var(--text)" }}>
                            {teamB.length > 12 ? teamB.slice(0,11)+"…" : teamB}
                          </span>
                          <img src={`https://flagcdn.com/${flagB}.svg`} alt={teamB}
                            style={{ width: 20, height: 13, objectFit: "cover", borderRadius: 1 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Tabla */}
                <div className="card" style={{ padding: 16 }}>
                  <div className="chart-label">Grupo {tabGrupo} · Tabla final</div>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid var(--text)" }}>
                        {["#","Equipo","PTS","GD","GF"].map(h => (
                          <th key={h} style={{
                            textAlign: h === "Equipo" ? "left" : "center",
                            padding: "4px 8px",
                            fontFamily: "var(--mono)", fontSize: 9, fontWeight: 700,
                            color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em",
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tabla.map((t, i) => {
                        const isMx = t.equipo === "México";
                        const clasifica = i < 2;
                        return (
                          <tr key={t.equipo} style={{
                            borderBottom: i < tabla.length - 1 ? "1px solid var(--border)" : "none",
                            background: isMx ? "rgba(22,101,52,0.06)" : "transparent",
                          }}>
                            <td style={{ padding: "7px 8px", textAlign: "center",
                              fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700,
                              color: clasifica ? "var(--on-color)" : "var(--text-muted)" }}>{i + 1}</td>
                            <td style={{ padding: "7px 8px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <img src={`https://flagcdn.com/${t.flag}.svg`} alt={t.equipo}
                                  style={{ width: 20, height: 13, objectFit: "cover", borderRadius: 1 }} />
                                <span style={{ fontFamily: "var(--sans)", fontSize: 12,
                                  fontWeight: isMx ? 700 : 400,
                                  color: isMx ? "var(--on-color)" : "var(--text)" }}>
                                  {t.equipo}
                                </span>
                                {clasifica && (
                                  <span style={{ fontFamily: "var(--mono)", fontSize: 7,
                                    color: "var(--on-color)", border: "1px solid var(--on-color)",
                                    borderRadius: 2, padding: "1px 3px" }}>CLASIFICA</span>
                                )}
                              </div>
                            </td>
                            <td style={{ padding: "7px 8px", textAlign: "center",
                              fontFamily: "var(--mono)", fontSize: 13, fontWeight: 900,
                              color: isMx ? "var(--on-color)" : "var(--text)" }}>{t.pts}</td>
                            <td style={{ padding: "7px 8px", textAlign: "center",
                              fontFamily: "var(--mono)", fontSize: 12,
                              color: t.gd >= 0 ? "var(--on-color)" : "var(--red-color)" }}>
                              {t.gd > 0 ? `+${t.gd}` : t.gd}
                            </td>
                            <td style={{ padding: "7px 8px", textAlign: "center",
                              fontFamily: "var(--mono)", fontSize: 12,
                              color: "var(--text-sec)" }}>{t.gf}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <p style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--text-muted)", marginTop: 8 }}>
                    Top 2 clasifican · 3ro puede ser mejor tercero
                  </p>
                </div>

              </div>
            </div>
          );
        })()}
      </div>
    </SectionWrapper>
  );
}
