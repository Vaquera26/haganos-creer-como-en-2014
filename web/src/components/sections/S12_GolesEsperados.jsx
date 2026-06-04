import SectionWrapper from "../ui/SectionWrapper.jsx";
import Flag from "../ui/Flag.jsx";
import { PARTIDOS_GRUPO } from "../../data/analisis.js";

function ScoreHeatmap({ xgMx, xgRival, rival }) {
  const maxG = 4;
  const cells = [];
  let totalProb = 0;
  const probs = [];

  for (let g = 0; g <= maxG; g++) {
    for (let r = 0; r <= maxG; r++) {
      const pMx  = (Math.exp(-xgMx)  * Math.pow(xgMx,  g) / factorial(g));
      const pRiv = (Math.exp(-xgRival) * Math.pow(xgRival, r) / factorial(r));
      const p = pMx * pRiv * 100;
      probs.push({ g, r, p });
      totalProb += p;
    }
  }

  const maxP = Math.max(...probs.map((p) => p.p));

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Flag code="mx" className="w-6 h-4" alt="México" />
        <span className="text-xs text-gray-500">xG: {xgMx.toFixed(2)}</span>
        <span className="text-xs text-gray-600 mx-2">vs</span>
        <span className="text-xs text-gray-500">xG: {xgRival.toFixed(2)}</span>
      </div>
      <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${maxG+2}, minmax(0, 1fr))` }}>
        {/* encabezado */}
        <div className="text-center text-xs text-gray-700 pb-1">Mx\Rv</div>
        {Array.from({ length: maxG + 1 }, (_, c) => (
          <div key={c} className="text-center text-xs text-gray-600 pb-1">{c}</div>
        ))}
        {/* filas */}
        {Array.from({ length: maxG + 1 }, (_, g) => (
          <>
            <div key={`r${g}`} className="text-center text-xs text-gray-600 flex items-center justify-center">{g}</div>
            {Array.from({ length: maxG + 1 }, (_, r) => {
              const p = probs.find((x) => x.g === g && x.r === r)?.p ?? 0;
              const intensity = p / maxP;
              const isMxWin = g > r;
              const isDraw  = g === r;
              let bg = `rgba(90, 90, 90, ${intensity * 0.6})`;
              if (isMxWin) bg = `rgba(0, 104, 71, ${intensity})`;
              if (isDraw)  bg = `rgba(255, 215, 0, ${intensity * 0.7})`;

              return (
                <div key={`${g}-${r}`}
                  className="aspect-square rounded-sm flex items-center justify-center text-[9px] font-bold text-white/80"
                  style={{ backgroundColor: bg }}>
                  {p >= 3 ? `${p.toFixed(0)}%` : ""}
                </div>
              );
            })}
          </>
        ))}
      </div>
      <div className="flex gap-3 mt-2">
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-mx-green opacity-70"/><span className="text-xs text-gray-600">Mx gana</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-mx-gold opacity-70"/><span className="text-xs text-gray-600">Empate</span></div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-zinc-600"/><span className="text-xs text-gray-600">Pierde</span></div>
      </div>
    </div>
  );
}

function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

export default function S12_GolesEsperados() {
  return (
    <SectionWrapper
      id="s12"
      number={12}
      accent="green"
      title="Modelo de Goles Esperados"
      subtitle="El modelo no solo predice quién gana. Predice el marcador exacto con distribución Poisson. Así se ven los partidos antes de jugarlos."
      quote="Cada cuadro verde es un mundo donde México gana. Cada cuadro dorado es un empate que puede ser peor que una derrota."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {PARTIDOS_GRUPO.map((p) => (
          <div key={p.rival} className="bg-mx-card border border-mx-border rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <Flag code={p.flagCode} className="w-8 h-6 rounded shadow" alt={p.rival} />
              <div>
                <p className="text-sm font-bold text-white">vs {p.rival}</p>
                <p className="text-xs text-gray-500">{p.fecha}</p>
              </div>
            </div>

            <ScoreHeatmap xgMx={p.xgMx} xgRival={p.xgRival} rival={p.rival} />

            {/* marcadores más probables */}
            <div className="mt-4 pt-3 border-t border-mx-border">
              <p className="text-xs text-gray-600 mb-2">Marcadores más probables</p>
              <div className="flex gap-2 flex-wrap">
                {p.marcadores.map((m) => (
                  <div key={m.m} className={`border rounded px-2 py-1 text-xs font-bold
                    ${m.m.split("-")[0] > m.m.split("-")[1]
                      ? "border-mx-green/40 text-mx-green bg-mx-green/5"
                      : m.m.split("-")[0] === m.m.split("-")[1]
                        ? "border-mx-gold/40 text-mx-gold bg-mx-gold/5"
                        : "border-mx-red/40 text-mx-red bg-mx-red/5"}`}>
                    {m.m} <span className="text-gray-600 font-normal">({m.p}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-5 bg-mx-green/5 border border-mx-green/20 rounded-xl">
        <p className="text-sm text-gray-300 leading-relaxed">
          <span className="text-mx-green font-bold">La esperanza:</span> El marcador más probable vs Sudáfrica es 1-0.
          Un gol es suficiente para ganar el partido más importante del arranque. Solo necesitamos convertir las ocasiones
          que el modelo ya sabe que vamos a crear.
        </p>
      </div>
    </SectionWrapper>
  );
}
