"""
Probabilidad de Penales y Eliminacion Directa
-----------------------------------------------
Analiza cuanto probabilidad hay de que Mexico llegue a tiempo extra o penales.
Mexico tiene record de 0-2 en tandas de penales mundialistas (1986, 1994).
En CONCACAF: rendimiento mixto.

Por ronda: que tan probable es que el partido sea cerrado?
Si llega a penales, que probabilidad tiene Mexico de ganar?
"""

import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches

from utils import xg_partido, setup_estilo, guardar_figura
from utils import VERDE, ROJO, ORO, AZUL, BG_DARK, BG_PANEL, TEXT_CLR, GRIS
from scipy.stats import poisson

setup_estilo()

# registro historico de Mexico en penales
PENALES_MUNDIALES = [
    dict(año=1986, rival="Alemania Occ.", ronda="Cuartos", resultado="P", marcador_antes="1-1", conv_mx=3, conv_rival=4),
    dict(año=1994, rival="Bulgaria",      ronda="Octavos", resultado="P", marcador_antes="1-1", conv_mx=1, conv_rival=3),
]

PENALES_CONCACAF = [
    dict(torneo="Copa Oro 2019",  rival="EUA",    resultado="G"),
    dict(torneo="Copa Oro 2021",  rival="Canadá", resultado="P"),
    dict(torneo="Nations L 2021", rival="EUA",    resultado="P"),
]

# tasa historica de partidos mundialistas yendo a tiempo extra por ronda (1994-2022)
TASA_ET_POR_RONDA = {
    "Octavos": 0.28,   # 28% de los partidos de R16 van a ET
    "Cuartos": 0.31,
    "Semifinal": 0.29,
    "Final": 0.33,
}

# de los que van a ET, cuantos van a penales (aprox 60%)
TASA_PENALES_SI_ET = 0.62

# de acuerdo a diferencia de Elo: P(partido ir a tiempo extra dado que llego a ese juego)
def prob_et_dado_elo_diff(elo_diff):
    # los partidos mas equilibrados tienen mas probabilidad de ET
    # cuando elo_diff = 0 → max ~33%; cuando diff = 500 → min ~10%
    return max(0.08, 0.33 * np.exp(-elo_diff / 350))


def prob_penales_partido(rank_a, rank_b):
    from utils import elo_desde_ranking
    elo_diff = abs(elo_desde_ranking(rank_a) - elo_desde_ranking(rank_b))
    p_et = prob_et_dado_elo_diff(elo_diff)
    p_pen = p_et * TASA_PENALES_SI_ET
    return p_et, p_pen


# probabilidad de Mexico ganar en penales (basado en historia)
def prob_mx_ganar_penales():
    # mundiales: 0/2 = 0%
    # CONCACAF: 1/3 = 33%
    # combinado ponderado
    wm = 0.6   # peso mundiales (mas relevante)
    wc = 0.4
    return (0.0 * wm + 1/3 * wc)


def main():
    p_penales_ganar = prob_mx_ganar_penales()
    print(f"P(Mexico gana tanda de penales, historico): {p_penales_ganar*100:.1f}%")

    # por ronda en 2026, con rivales estimados
    rivales_por_ronda = {
        "R32": 18, "Octavos (R16)": 10, "Cuartos": 7, "Semifinal": 3, "Final": 1,
    }

    print("\nProbabilidad de penales por ronda:")
    datos_ronda = []
    for ronda, rank_rival in rivales_por_ronda.items():
        p_et, p_pen = prob_penales_partido(15, rank_rival)
        p_mx_pasa = p_pen * p_penales_ganar
        datos_ronda.append({
            "ronda": ronda, "rank_rival": rank_rival,
            "p_et": p_et, "p_penales": p_pen, "p_mx_gana_pen": p_mx_pasa,
        })
        print(f"  {ronda:20s} (vs Rk ~{rank_rival:3d}): P(ET)={p_et*100:.1f}%  P(penales)={p_pen*100:.1f}%  P(MX gana)={p_mx_pasa*100:.1f}%")

    # ---- FIGURA ----
    fig, axes = plt.subplots(1, 3, figsize=(16, 6))
    fig.patch.set_facecolor(BG_DARK)
    for ax in axes:
        ax.set_facecolor(BG_PANEL)

    # --- 1: prob ET y penales por ronda ---
    ax = axes[0]
    df_r = pd.DataFrame(datos_ronda)
    x = np.arange(len(df_r))
    w = 0.35
    ax.bar(x - w/2, df_r["p_et"]     * 100, w, label="P(tiempo extra)", color=ORO,   alpha=0.9)
    ax.bar(x + w/2, df_r["p_penales"]* 100, w, label="P(penales)",       color=ROJO,  alpha=0.9)
    ax.set_xticks(x)
    ax.set_xticklabels(df_r["ronda"], rotation=30, color=TEXT_CLR, ha='right', fontsize=8)
    ax.set_ylabel("Probabilidad (%)", color=TEXT_CLR)
    ax.set_title("Probabilidad de ET y penales\npor ronda (rivales esperados)", color=TEXT_CLR, fontweight='bold')
    ax.legend(facecolor=BG_PANEL, edgecolor='#30363d', labelcolor=TEXT_CLR, fontsize=9)
    ax.tick_params(colors=TEXT_CLR)
    for spine in ax.spines.values(): spine.set_edgecolor('#30363d')
    ax.grid(axis='y', alpha=0.3, color=TEXT_CLR)

    # --- 2: historial de penales Mexico ---
    ax = axes[1]
    # distribucion de probabilidades en penales (simulacion)
    N_sim = 50_000
    resultados_pen = np.random.binomial(1, p_penales_ganar, N_sim)
    gana_pen_pct = resultados_pen.mean() * 100

    # graficar historial
    mundiales_txt = [f"{p['año']} vs {p['rival']}\n({p['conv_mx']}-{p['conv_rival']})" for p in PENALES_MUNDIALES]
    concacaf_txt  = [f"{p['torneo']}\nvs {p['rival']}" for p in PENALES_CONCACAF]
    resultados_m = [1 if p["resultado"] == "G" else 0 for p in PENALES_MUNDIALES]
    resultados_c = [1 if p["resultado"] == "G" else 0 for p in PENALES_CONCACAF]

    todos_txt = mundiales_txt + concacaf_txt
    todos_res = resultados_m + resultados_c
    todos_col = [ROJO if r == 0 else VERDE for r in todos_res]
    todos_peso = ["Mundial"] * 2 + ["CONCACAF"] * 3

    y_pos = np.arange(len(todos_txt))
    ax.barh(y_pos, [1]*len(todos_txt), color=todos_col, alpha=0.8, height=0.6)
    ax.set_yticks(y_pos)
    ax.set_yticklabels(todos_txt, color=TEXT_CLR, fontsize=8)
    ax.set_xlim(0, 1.4)
    ax.set_xticks([0.5])
    ax.set_xticklabels(["Resultado"], color=TEXT_CLR)

    for i, (txt, res, peso) in enumerate(zip(todos_txt, todos_res, todos_peso)):
        ax.text(1.05, i, "GANA ✓" if res else "PIERDE ✗", va='center',
                color=VERDE if res else ROJO, fontsize=9, fontweight='bold')
        ax.text(1.05, i - 0.25, peso, va='center', color=GRIS, fontsize=7)

    ax.set_title(f"Historial Mexico en tandas de penales\nP(ganar) estimada: {p_penales_ganar*100:.0f}%",
                 color=TEXT_CLR, fontweight='bold')
    ax.tick_params(colors=TEXT_CLR)
    for spine in ax.spines.values(): spine.set_edgecolor('#30363d')
    ax.axhline(y=1.5, color=GRIS, linestyle='--', alpha=0.4, linewidth=1)
    ax.text(0.5, 1.5 + 0.05, "Mundiales ↑ | CONCACAF ↓", color=GRIS, fontsize=7, ha='center')

    # --- 3: P(penales) vs equilibrio del partido ---
    ax = axes[2]
    diffs = np.linspace(0, 600, 200)
    p_et_curve  = [prob_et_dado_elo_diff(d) * 100 for d in diffs]
    p_pen_curve = [prob_et_dado_elo_diff(d) * TASA_PENALES_SI_ET * 100 for d in diffs]

    ax.plot(diffs, p_et_curve,  color=ORO,  linewidth=2.5, label="P(tiempo extra)")
    ax.plot(diffs, p_pen_curve, color=ROJO, linewidth=2.5, label="P(penales)")

    # marcar rivales de Mexico
    from utils import elo_desde_ranking
    for ronda, rank in rivales_por_ronda.items():
        diff_elo = abs(elo_desde_ranking(15) - elo_desde_ranking(rank))
        p_t = prob_et_dado_elo_diff(diff_elo) * 100
        ax.annotate(ronda.split('(')[0], xy=(diff_elo, p_t), xytext=(diff_elo + 15, p_t + 1.5),
                    color=TEXT_CLR, fontsize=7, arrowprops=dict(arrowstyle='->', color=GRIS, alpha=0.5))
        ax.plot(diff_elo, p_t, 'o', color=AZUL, markersize=6, zorder=4)

    ax.set_xlabel("Diferencia de Elo (0 = partidos muy parejos)", color=TEXT_CLR)
    ax.set_ylabel("Probabilidad (%)", color=TEXT_CLR)
    ax.set_title("P(ET/penales) segun equilibrio del partido", color=TEXT_CLR, fontweight='bold')
    ax.legend(facecolor=BG_PANEL, edgecolor='#30363d', labelcolor=TEXT_CLR, fontsize=9)
    ax.tick_params(colors=TEXT_CLR)
    for spine in ax.spines.values(): spine.set_edgecolor('#30363d')

    plt.suptitle("Mexico 2026 — Probabilidad de Penales y Eliminacion Directa", color=TEXT_CLR,
                 fontsize=14, fontweight='bold')
    plt.tight_layout()
    guardar_figura(fig, "11_probabilidad_penales.png")
    plt.close()


if __name__ == "__main__":
    main()
