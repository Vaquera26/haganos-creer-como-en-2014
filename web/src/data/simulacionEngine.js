/**
 * Motor de simulación del Mundial 2026 — portado de Python a JS.
 * Mismo modelo: Elo + Poisson + forma reciente ESPN + altitud.
 * Corre 100% en el browser, sin backend, sin guardar nada.
 */

// ── Datos de los 12 grupos (ranking FIFA real) ────────────────────────────────
const GRUPOS = {
  A: { "México": 15, "Corea del Sur": 25, "Chequia": 41, "Sudáfrica": 60 },
  B: { "Canadá": 22, "Suiza": 14, "Bosnia-Herzegovina": 62, "Qatar": 71 },
  C: { "Brasil": 4, "Marruecos": 13, "Escocia": 28, "Haití": 90 },
  D: { "EUA": 16, "Turquía": 23, "Paraguay": 30, "Australia": 31 },
  E: { "Alemania": 7, "Ecuador": 21, "Costa de Marfil": 24, "Curazao": 108 },
  F: { "Países Bajos": 8, "Japón": 19, "Suecia": 26, "Túnez": 34 },
  G: { "Bélgica": 9, "Irán": 29, "Egipto": 32, "Nueva Zelanda": 95 },
  H: { "España": 3, "Uruguay": 11, "Arabia Saudita": 33, "Cabo Verde": 39 },
  I: { "Francia": 2, "Senegal": 17, "Noruega": 20, "Irak": 68 },
  J: { "Argentina": 1, "Austria": 18, "Argelia": 27, "Jordania": 100 },
  K: { "Portugal": 6, "Colombia": 12, "Congo RD": 64, "Uzbekistán": 76 },
  L: { "Inglaterra": 5, "Croacia": 10, "Ghana": 44, "Panamá": 78 },
};

// ── Forma reciente (ESPN API, desde 2024) ──────────────────────────────────────
const FORMA = {
  "Alemania": 15, "Arabia Saudita": -4, "Argelia": 15, "Argentina": 13,
  "Australia": 14, "Austria": 15, "Bosnia-Herzegovina": 11, "Brasil": 8,
  "Bélgica": 15, "Cabo Verde": 14, "Canadá": 15, "Chequia": 11,
  "Colombia": -2, "Congo RD": 15, "Corea del Sur": 14, "Costa de Marfil": 15,
  "Croacia": 15, "Curazao": 4, "EUA": 5, "Ecuador": 10, "Egipto": 15,
  "Escocia": 7, "España": 15, "Francia": 15, "Ghana": 10, "Haití": 2,
  "Inglaterra": 15, "Irak": 6, "Irán": 14, "Japón": 15, "Jordania": 6,
  "Marruecos": 15, "México": 15, "Noruega": 15, "Nueva Zelanda": -10,
  "Panamá": 10, "Paraguay": 11, "Países Bajos": 15, "Portugal": 15,
  "Qatar": 0, "Senegal": 15, "Sudáfrica": 5, "Suecia": -9, "Suiza": 13,
  "Turquía": 0, "Túnez": 15, "Uruguay": 0, "Uzbekistán": 10,
};

// ── Altitud de los estadios de México en fase de grupos ───────────────────────
const ALT_GRUPOS = { "Sudáfrica": 25, "Corea del Sur": 17, "Chequia": 25 };
const ALT_ELIM   = 10;  // estimación conservadora en eliminatoria

// ── Bracket R32 oficial FIFA 2026 ─────────────────────────────────────────────
const BRACKET_R32 = [
  ["2A","2B"],  ["1E","T_E"], ["1F","2C"],  ["1C","2F"],
  ["1I","T_I"], ["2E","2I"], ["1A","T_A"],  ["1L","T_L"],
  ["1D","T_D"], ["1G","T_G"],["2K","2L"],  ["1H","2J"],
  ["1B","T_B"], ["1J","2H"], ["1K","T_K"], ["2D","2G"],
];

const TERCEROS_ELEGIBLES = {
  E: new Set(["A","B","C","D","F"]),
  I: new Set(["C","D","F","G","H"]),
  A: new Set(["C","E","F","H","I"]),
  L: new Set(["E","H","I","J","K"]),
  D: new Set(["B","E","F","I","J"]),
  G: new Set(["A","E","H","I","J"]),
  B: new Set(["E","F","G","I","J"]),
  K: new Set(["D","E","I","J","L"]),
};
const SLOT_ORDER = ["E","I","A","L","D","G","B","K"];

// ── Flag codes ────────────────────────────────────────────────────────────────
const FLAG = {
  "México":"mx","Corea del Sur":"kr","Chequia":"cz","Sudáfrica":"za",
  "Canadá":"ca","Suiza":"ch","Bosnia-Herzegovina":"ba","Qatar":"qa",
  "Brasil":"br","Marruecos":"ma","Escocia":"gb-sct","Haití":"ht",
  "EUA":"us","Turquía":"tr","Paraguay":"py","Australia":"au",
  "Alemania":"de","Ecuador":"ec","Costa de Marfil":"ci","Curazao":"cw",
  "Países Bajos":"nl","Japón":"jp","Suecia":"se","Túnez":"tn",
  "Bélgica":"be","Irán":"ir","Egipto":"eg","Nueva Zelanda":"nz",
  "España":"es","Uruguay":"uy","Arabia Saudita":"sa","Cabo Verde":"cv",
  "Francia":"fr","Senegal":"sn","Noruega":"no","Irak":"iq",
  "Argentina":"ar","Austria":"at","Argelia":"dz","Jordania":"jo",
  "Portugal":"pt","Colombia":"co","Congo RD":"cd","Uzbekistán":"uz",
  "Inglaterra":"gb-eng","Croacia":"hr","Ghana":"gh","Panamá":"pa",
  "?":"un",
};
export { FLAG };

// ── Poisson RVS ───────────────────────────────────────────────────────────────
function poisson(lambda) {
  const lam = Math.max(0.3, lambda);
  const L = Math.exp(-lam);
  let k = 0, p = 1;
  do { k++; p *= Math.random(); } while (p > L);
  return k - 1;
}

// ── Elo desde ranking ─────────────────────────────────────────────────────────
function elo(rank) { return Math.max(1008, 1800 - (rank - 1) * 8); }

// ── Simular marcador ──────────────────────────────────────────────────────────
function simularMarcador(rankA, rankB, ventajaLocal = false, altBonus = 0, formaA = 0, formaB = 0) {
  const baseBonus = (ventajaLocal ? 60 : 0) + altBonus;
  const eloA = elo(rankA) + baseBonus + formaA;
  const eloB = elo(rankB) + formaB;

  const pBase = 1 / (1 + Math.pow(10, (eloB - eloA) / 400));
  const deseq = Math.abs(pBase - 0.5) * 2;
  const pEmp  = 0.26 * (1 - deseq * 0.55);
  const pW    = pBase * (1 - pEmp);

  const ratio = eloA / eloB;
  const xgA   = 1.2 * Math.pow(ratio, 0.65);
  const xgB   = 1.2 * Math.pow(1 / ratio, 0.65);

  return { ga: poisson(xgA), gb: poisson(xgB), pW, pEmp, xgA, xgB };
}

// ── Simular partido de fase de grupos ────────────────────────────────────────
function partidoGrupo(nombreA, nombreB, rankA, rankB, esMxLocal, rival) {
  const alt = esMxLocal ? (ALT_GRUPOS[rival] || 0) : 0;
  const formaA = FORMA[nombreA] || 0;
  const formaB = FORMA[nombreB] || 0;
  const { ga, gb } = simularMarcador(rankA, rankB, esMxLocal, alt, formaA, formaB);
  return { ga, gb };
}

// ── Simular grupo ─────────────────────────────────────────────────────────────
function simularGrupo(label, equiposRanks) {
  const equipos = Object.keys(equiposRanks);
  const pts = {}; const gd = {}; const gf = {};
  equipos.forEach(e => { pts[e] = 0; gd[e] = 0; gf[e] = 0; });
  const partidos = [];

  for (let i = 0; i < equipos.length; i++) {
    for (let j = i + 1; j < equipos.length; j++) {
      const a = equipos[i], b = equipos[j];
      const esMxLocal = label === "A" && a === "México";
      const { ga, gb } = partidoGrupo(a, b, equiposRanks[a], equiposRanks[b], esMxLocal, b);
      gf[a] += ga; gf[b] += gb;
      gd[a] += ga - gb; gd[b] += gb - ga;
      if      (ga > gb) { pts[a] += 3; }
      else if (ga < gb) { pts[b] += 3; }
      else              { pts[a] += 1; pts[b] += 1; }
      partidos.push({ a, af: FLAG[a]||"un", b, bf: FLAG[b]||"un", ga, gb });
    }
  }

  const tabla = [...equipos].sort((x, y) =>
    (pts[y] - pts[x]) || (gd[y] - gd[x]) || (gf[y] - gf[x])
  );

  return {
    primero: tabla[0], segundo: tabla[1], tercero: tabla[2],
    pts, gd, gf,
    tabla: tabla.map(e => ({
      equipo: e, flag: FLAG[e]||"un",
      rank: equiposRanks[e], pts: pts[e], gd: gd[e], gf: gf[e],
    })),
    partidos,
  };
}

// ── Asignar 3ros (respetando elegibles FIFA) ──────────────────────────────────
function asignarTerceros(terceros) {
  const disponibles = [...terceros];
  const asign = {};
  for (const slot of SLOT_ORDER) {
    const elegibles = TERCEROS_ELEGIBLES[slot];
    const idx = disponibles.findIndex(t => elegibles.has(t.grupo));
    if (idx !== -1) {
      asign[`T_${slot}`] = disponibles.splice(idx, 1)[0].equipo;
    } else if (disponibles.length) {
      asign[`T_${slot}`] = disponibles.shift().equipo;
    }
  }
  return asign;
}

// ── Simular partido eliminatorio ──────────────────────────────────────────────
function simularElim(nombreA, nombreB, rankA, rankB, ronda) {
  if (nombreA === "?" || nombreB === "?") {
    return { ganador: nombreA === "?" ? nombreB : nombreA, score: [0,0], penales: false };
  }
  const local = nombreA === "México" && ["R32","R16"].includes(ronda);
  const alt   = local ? ALT_ELIM : 0;
  const formaA = FORMA[nombreA] || 0;
  const formaB = FORMA[nombreB] || 0;
  const { ga, gb, pW, pEmp, xgA, xgB } = simularMarcador(rankA, rankB, local, alt, formaA, formaB);
  const r = Math.random();

  if (r < pW) {
    return { ganador: nombreA, score: [ga <= gb ? gb + 1 : ga, gb], penales: false };
  } else if (r < pW + pEmp) {
    const empate = poisson((xgA + xgB) / 2);
    const esMx = nombreA === "México" || nombreB === "México";
    const ganador = esMx
      ? (Math.random() < 0.30 ? "México" : (nombreA === "México" ? nombreB : nombreA))
      : (Math.random() < 0.50 ? nombreA : nombreB);
    return { ganador, score: [empate, empate], penales: true };
  } else {
    return { ganador: nombreB, score: [ga, gb <= ga ? ga + 1 : gb], penales: false };
  }
}

// ── Torneo completo ───────────────────────────────────────────────────────────
function simularTorneo() {
  // Rankings de todos los equipos
  const ranks = {};
  Object.values(GRUPOS).forEach(g => Object.entries(g).forEach(([n, r]) => { ranks[n] = r; }));

  // Fase de grupos
  const clasificados = {};
  const tercerosLista = [];
  const gruposData = {};

  for (const [label, equipos] of Object.entries(GRUPOS)) {
    const res = simularGrupo(label, equipos);
    clasificados[`1${label}`] = res.primero;
    clasificados[`2${label}`] = res.segundo;
    gruposData[label] = { grupo: label, tabla: res.tabla, partidos: res.partidos };
    tercerosLista.push({
      equipo: res.tercero, grupo: label,
      pts: res.pts[res.tercero], gd: res.gd[res.tercero], gf: res.gf[res.tercero],
    });
  }

  const terceros8 = [...tercerosLista]
    .sort((a, b) => (b.pts - a.pts) || (b.gd - a.gd) || (b.gf - a.gf))
    .slice(0, 8);
  Object.assign(clasificados, asignarTerceros(terceros8));

  const logMexico = [];
  const getR = n => ranks[n] || 60;

  function jugar(eqA, eqB, ronda) {
    const res = simularElim(eqA, eqB, getR(eqA), getR(eqB), ronda);
    if (eqA === "México" || eqB === "México") {
      const esMxA = eqA === "México";
      const rival = esMxA ? eqB : eqA;
      const score = esMxA ? res.score : [res.score[1], res.score[0]];
      logMexico.push({ ronda, rival, score, gano: res.ganador === "México", penales: res.penales });
    }
    return {
      equipo_a: eqA, equipo_b: eqB,
      ganador: res.ganador, score: res.score, penales: res.penales,
    };
  }

  const r32 = BRACKET_R32.map(([a, b]) => jugar(clasificados[a]||"?", clasificados[b]||"?", "R32"));
  const r32g = r32.map(p => p.ganador);
  const r16  = Array.from({length:8}, (_,i) => jugar(r32g[i*2], r32g[i*2+1], "R16"));
  const r16g  = r16.map(p => p.ganador);
  const qf    = Array.from({length:4}, (_,i) => jugar(r16g[i*2], r16g[i*2+1], "QF"));
  const qfg   = qf.map(p => p.ganador);
  const sf    = Array.from({length:2}, (_,i) => jugar(qfg[i*2], qfg[i*2+1], "SF"));
  const sfg   = sf.map(p => p.ganador);
  const final = jugar(sfg[0], sfg[1], "Final");

  return { campeon: final.ganador, logMexico, grupos: gruposData, r32, r16, qf, sf, final };
}

// ── Convertir match a formato del componente ──────────────────────────────────
function toMatch(p) {
  const suf = p.penales ? " (p)" : "";
  return {
    a: p.equipo_a, af: FLAG[p.equipo_a]||"un",
    b: p.equipo_b, bf: FLAG[p.equipo_b]||"un",
    s: `${p.score[0]}-${p.score[1]}${suf}`,
    w: p.ganador === p.equipo_a ? 0 : 1,
  };
}

// ── Función principal: simula hasta que México gane ───────────────────────────
export function simularHastaGanar(maxIntentos = 500) {
  for (let i = 0; i < maxIntentos; i++) {
    const res = simularTorneo();
    if (res.campeon === "México") {
      return {
        campeon: "México",
        intentos: i + 1,
        log_mexico: res.logMexico.map(l => ({
          ronda: l.ronda, rival: l.rival,
          score: `${l.score[0]}-${l.score[1]}`,
          penales: l.penales, gano: l.gano,
        })),
        grupos: res.grupos,
        r32:   res.r32.map(toMatch),
        r16:   res.r16.map(toMatch),
        qf:    res.qf.map(toMatch),
        sf:    res.sf.map(toMatch),
        final: toMatch(res.final),
      };
    }
  }
  throw new Error(`México no ganó en ${maxIntentos} intentos`);
}
