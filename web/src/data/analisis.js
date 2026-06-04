// Resultados de los 100,000 simulaciones Monte Carlo + modelos Elo/Poisson
// Generados por los scripts Python del análisis

export const RUTA_QUINTO = [
  { etapa: "Fase de Grupos",       juego: null, pLlegar: 100.0, pElim: 24.0, color: "red"    },
  { etapa: "R32",                   juego: 4,    pLlegar: 76.0,  pElim: 32.6, color: "gray"   },
  { etapa: "R16 ← la maldición",   juego: 5,    pLlegar: 43.4,  pElim: 18.3, color: "gold"   },
  { etapa: "Cuartos de Final",      juego: 6,    pLlegar: 25.1,  pElim: 14.8, color: "gold"   },
  { etapa: "Semifinal",             juego: 7,    pLlegar: 10.3,  pElim: 6.4,  color: "green"  },
  { etapa: "Final",                 juego: 8,    pLlegar: 3.9,   pElim: 2.5,  color: "green"  },
  { etapa: "Campeón",               juego: null, pLlegar: 1.4,   pElim: 1.4,  color: "green"  },
];

export const PARTIDOS_GRUPO = [
  {
    rival: "Sudáfrica", flagCode: "za", rank: 60, fecha: "11 Jun", sede: "Azteca, CDMX",
    pGana: 80.3, pEmpata: 13.7, pPierde: 6.0,
    xgMx: 1.45, xgRival: 0.99,
    marcadores: [{ m: "1-0", p: 12.7 }, { m: "1-1", p: 12.6 }, { m: "2-0", p: 10.1 }, { m: "2-1", p: 9.0 }],
    narrativa: "El partido del arranque. El Azteca lleno. Frente a una Sudáfrica que nunca ha pasado de grupos cuando juega lejos de casa. No hay excusa.",
  },
  {
    rival: "Corea del Sur", flagCode: "kr", rank: 25, fecha: "18 Jun", sede: "Akron, Guadalajara",
    pGana: 56.7, pEmpata: 20.0, pPierde: 23.2,
    xgMx: 1.27, xgRival: 1.13,
    marcadores: [{ m: "1-1", p: 12.9 }, { m: "1-0", p: 11.6 }, { m: "0-1", p: 10.2 }, { m: "2-1", p: 8.4 }],
    narrativa: "El partido más complicado del grupo. Corea llegará motivada como en 2002. Aquí se define si México va de primero o de segundo.",
  },
  {
    rival: "Chequia", flagCode: "cz", rank: 41, fecha: "24 Jun", sede: "Azteca, CDMX",
    pGana: 71.1, pEmpata: 16.1, pPierde: 12.8,
    xgMx: 1.35, xgRival: 1.07,
    marcadores: [{ m: "1-1", p: 12.9 }, { m: "1-0", p: 11.8 }, { m: "2-1", p: 9.3 }, { m: "0-1", p: 9.5 }],
    narrativa: "El cierre de grupos en el Azteca. Si México llega con sus opciones abiertas a este partido, la afición lo va a empujar hasta donde sea necesario.",
  },
];

export const DIFICULTAD_MAPA = {
  rondas: ["R32", "R16", "QF", "SF", "Final"],
  posiciones: {
    "1ro":  { label: "Terminas 1ro", color: "green",  difs: [0.521, 0.665, 0.687, 0.723, 0.730] },
    "2do":  { label: "Terminas 2do", color: "yellow", difs: [0.480, 0.644, 0.687, 0.708, 0.730] },
    "3ro":  { label: "Terminas 3ro", color: "red",    difs: [0.694, 0.708, 0.716, 0.723, 0.730] },
  },
};

export const GRUPO_A = [
  { nombre: "México",        flagCode: "mx", rank: 15, elo: 1688, forma: 77, xg: 1.65, xga: 0.72, mundiales: 18, mejor: "Cuartos 1970/86" },
  { nombre: "Corea del Sur", flagCode: "kr", rank: 25, elo: 1600, forma: 58, xg: 1.35, xga: 0.98, mundiales: 11, mejor: "4to lugar 2002"  },
  { nombre: "Chequia",       flagCode: "cz", rank: 41, elo: 1488, forma: 47, xg: 1.15, xga: 1.12, mundiales: 10, mejor: "Final 1962"      },
  { nombre: "Sudáfrica",     flagCode: "za", rank: 60, elo: 1352, forma: 38, xg: 0.98, xga: 1.35, mundiales: 4,  mejor: "Grupos 2010"    },
];

export const PUNTOS_CLASIF = [
  { pts: 0, pClasif: 0,   pObtener: 2.5  },
  { pts: 1, pClasif: 4,   pObtener: 7.0  },
  { pts: 2, pClasif: 12,  pObtener: 6.5  },
  { pts: 3, pClasif: 40,  pObtener: 13.3 },
  { pts: 4, pClasif: 72,  pObtener: 20.6 },
  { pts: 5, pClasif: 95,  pObtener: 9.6  },
  { pts: 6, pClasif: 99,  pObtener: 16.8 },
  { pts: 7, pClasif: 100, pObtener: 15.5 },
  { pts: 9, pClasif: 100, pObtener: 8.3  },
];

export const INDICE_RIESGO = {
  dimensiones: [
    { nombre: "Dificultad\ndel grupo",   valor2026: 6.27, valorHist: 5.5, valor2022: 7.0 },
    { nombre: "Ruta\neliminatoria",      valor2026: 7.89, valorHist: 7.0, valor2022: 8.0 },
    { nombre: "Forma\nreciente (inv.)",  valor2026: 2.33, valorHist: 5.0, valor2022: 6.0 },
    { nombre: "Vulnerabilidad\npenales", valor2026: 7.50, valorHist: 7.5, valor2022: 7.5 },
    { nombre: "Presión\nhistórica",      valor2026: 8.50, valorHist: 6.0, valor2022: 8.0 },
    { nombre: "Dependencia\ngoles",      valor2026: 7.25, valorHist: 5.0, valor2022: 7.0 },
  ],
};

export const HISTORIA_MX = [
  { año: 1930, ronda: "Grupos",  rondaNum: 1, host: false, gf: 4,  ga: 13 },
  { año: 1950, ronda: "Grupos",  rondaNum: 1, host: false, gf: 2,  ga: 10 },
  { año: 1954, ronda: "Grupos",  rondaNum: 1, host: false, gf: 2,  ga: 8  },
  { año: 1958, ronda: "Grupos",  rondaNum: 1, host: false, gf: 1,  ga: 8  },
  { año: 1962, ronda: "Grupos",  rondaNum: 1, host: false, gf: 3,  ga: 9  },
  { año: 1966, ronda: "Grupos",  rondaNum: 1, host: false, gf: 1,  ga: 5  },
  { año: 1970, ronda: "Cuartos", rondaNum: 4, host: true,  gf: 6,  ga: 4  },
  { año: 1978, ronda: "Grupos",  rondaNum: 1, host: false, gf: 4,  ga: 8  },
  { año: 1986, ronda: "Cuartos", rondaNum: 4, host: true,  gf: 7,  ga: 4  },
  { año: 1994, ronda: "Octavos", rondaNum: 3, host: false, gf: 4,  ga: 4  },
  { año: 1998, ronda: "Octavos", rondaNum: 3, host: false, gf: 10, ga: 5  },
  { año: 2002, ronda: "Octavos", rondaNum: 3, host: false, gf: 7,  ga: 3  },
  { año: 2006, ronda: "Octavos", rondaNum: 3, host: false, gf: 7,  ga: 5  },
  { año: 2010, ronda: "Octavos", rondaNum: 3, host: false, gf: 8,  ga: 7  },
  { año: 2014, ronda: "Octavos", rondaNum: 3, host: false, gf: 5,  ga: 5  },
  { año: 2018, ronda: "Octavos", rondaNum: 3, host: false, gf: 4,  ga: 4  },
  { año: 2022, ronda: "Grupos",  rondaNum: 1, host: false, gf: 2,  ga: 3  },
];

export const LOCALIA = {
  casaRecord: { v: 85, e: 22, d: 13, total: 120 },
  fueraRecord: { v: 48, e: 22, d: 28, total: 98  },
  fueraWC:     { prom_ronda: 2.75 },
  sedeWC:      { prom_ronda: 4.20 },
  altitudBonus: {
    azteca:     { metros: 2240, bonus_pp: 3.6 },
    guadalajara:{ metros: 1554, bonus_pp: 1.8 },
  },
};

export const PENALES = {
  mundiales: [
    { año: 1986, rival: "Alemania Occ.", flagCode: "de", resultado: "P", marcador: "1-1", conv: "3-4" },
    { año: 1994, rival: "Bulgaria",      flagCode: "bg", resultado: "P", marcador: "1-1", conv: "1-3" },
  ],
  pGanarEstimada: 30,
  probPenalesPorRonda: [
    { ronda: "R32",   prob: 19.1 },
    { ronda: "R16",   prob: 18.3 },
    { ronda: "QF",    prob: 17.0 },
    { ronda: "SF",    prob: 15.6 },
    { ronda: "Final", prob: 14.9 },
  ],
};

export const RIVALES_RANKING = [
  { rival: "Haití",              flagCode: "ht", rank: 90,  ronda: "R16", pMxGana: 86.0 },
  { rival: "Qatar",              flagCode: "qa", rank: 71,  ronda: "R32", pMxGana: 83.0 },
  { rival: "Bosnia-Herzegovina", flagCode: "ba", rank: 62,  ronda: "R32", pMxGana: 80.5 },
  { rival: "Australia",          flagCode: "au", rank: 31,  ronda: "R16", pMxGana: 62.7 },
  { rival: "Paraguay",           flagCode: "py", rank: 30,  ronda: "R16", pMxGana: 61.9 },
  { rival: "Escocia",            flagCode: "gb-sct", rank: 28, ronda: "R16", pMxGana: 60.1 },
  { rival: "Turquía",            flagCode: "tr", rank: 23,  ronda: "R16", pMxGana: 55.4 },
  { rival: "Canadá",             flagCode: "ca", rank: 22,  ronda: "R32", pMxGana: 54.4 },
  { rival: "Ecuador",            flagCode: "ec", rank: 21,  ronda: "R16", pMxGana: 53.5 },
  { rival: "Japón",              flagCode: "jp", rank: 19,  ronda: "R16", pMxGana: 51.4 },
  { rival: "Senegal",            flagCode: "sn", rank: 17,  ronda: "R16", pMxGana: 49.4 },
  { rival: "EUA",                flagCode: "us", rank: 16,  ronda: "R16", pMxGana: 48.4 },
  { rival: "Suiza",              flagCode: "ch", rank: 14,  ronda: "R32", pMxGana: 46.3 },
  { rival: "Marruecos",          flagCode: "ma", rank: 13,  ronda: "R16", pMxGana: 45.3 },
  { rival: "Croacia",            flagCode: "hr", rank: 10,  ronda: "R16", pMxGana: 42.1 },
  { rival: "Brasil",             flagCode: "br", rank: 4,   ronda: "R16", pMxGana: 36.3 },
  { rival: "Colombia",           flagCode: "co", rank: 12,  ronda: "QF",  pMxGana: 34.9 },
  { rival: "Uruguay",            flagCode: "uy", rank: 11,  ronda: "QF",  pMxGana: 34.2 },
  { rival: "Bélgica",            flagCode: "be", rank: 9,   ronda: "QF",  pMxGana: 32.8 },
  { rival: "Países Bajos",       flagCode: "nl", rank: 8,   ronda: "QF",  pMxGana: 32.0 },
  { rival: "Alemania",           flagCode: "de", rank: 7,   ronda: "QF",  pMxGana: 31.3 },
  { rival: "Portugal",           flagCode: "pt", rank: 6,   ronda: "SF",  pMxGana: 30.6 },
  { rival: "Inglaterra",         flagCode: "gb-eng", rank: 5, ronda: "SF", pMxGana: 29.9 },
  { rival: "España",             flagCode: "es", rank: 3,   ronda: "SF",  pMxGana: 28.4 },
  { rival: "Francia",            flagCode: "fr", rank: 2,   ronda: "QF",  pMxGana: 27.7 },
  { rival: "Argentina",          flagCode: "ar", rank: 1,   ronda: "QF",  pMxGana: 27.0 },
];

export const ESCENARIOS = [
  // [J1, J2] → pClasif después de 2 juegos
  { j1: "G", j2: "G", pts: "6+", pClasif: 99, label: "Gana-Gana" },
  { j1: "G", j2: "E", pts: "4+", pClasif: 81, label: "Gana-Empata" },
  { j1: "G", j2: "P", pts: "3+", pClasif: 56, label: "Gana-Pierde" },
  { j1: "E", j2: "G", pts: "4+", pClasif: 81, label: "Empata-Gana" },
  { j1: "E", j2: "E", pts: "2+", pClasif: 28, label: "Empata-Empata" },
  { j1: "E", j2: "P", pts: "1+", pClasif: 8,  label: "Empata-Pierde" },
  { j1: "P", j2: "G", pts: "3+", pClasif: 56, label: "Pierde-Gana" },
  { j1: "P", j2: "E", pts: "1+", pClasif: 8,  label: "Pierde-Empata" },
  { j1: "P", j2: "P", pts: "0+", pClasif: 2,  label: "Pierde-Pierde" },
];

export const CAMINO_ARBOL = [
  { ronda: "R32",   rival1ro: "Suiza o Canadá",    rank1ro: 18, pGana1ro: 54,  rival2do: "Canadá o Suiza",   rank2do: 22, pGana2do: 59 },
  { ronda: "R16",   rival1ro: "Brasil / EUA",      rank1ro: 10, pGana1ro: 44,  rival2do: "Marruecos / EUA",  rank2do: 13, pGana2do: 48 },
  { ronda: "QF",    rival1ro: "Alemania / NL",     rank1ro: 7,  pGana1ro: 39,  rival2do: "Ingl / Bélgica",   rank2do: 7,  pGana2do: 39 },
  { ronda: "SF",    rival1ro: "España / Francia",  rank1ro: 2,  pGana1ro: 32,  rival2do: "Brasil / Portugal", rank2do: 4,  pGana2do: 36 },
  { ronda: "Final", rival1ro: "Arg / Francia",     rank1ro: 1,  pGana1ro: 27,  rival2do: "Arg / España",      rank2do: 1,  pGana2do: 27 },
];
