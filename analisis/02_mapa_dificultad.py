"""
Mapa de Dificultad del Camino
------------------------------
Para cada posicion final de Mexico en el Grupo A (1ro, 2do, 3ro),
calcula la dificultad acumulada de la ruta: R32, R16, QF, SF y Final.

La dificultad de cada juego se define como 1 - P(Mexico gana).
El mapa muestra cuanto cambia el nivel de exigencia segun como termine Mexico en grupos.
"""

import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import numpy as np
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
import seaborn as sns

from utils import prob_resultado, setup_estilo, guardar_figura, elo_desde_ranking
from utils import VERDE, ROJO, ORO, BG_DARK, BG_PANEL, TEXT_CLR, GRIS

setup_estilo()

# rival esperado por ronda segun posicion final en grupo A
# basado en el sorteo del mundial 2026
RIVALES_ESPERADOS = {
    "1ro": {
        "R32":   ("Suiza o Canadá",  18),
        "R16":   ("Brasil o EUA",    10),
        "QF":    ("Alemania/Países B", 7),
        "SF":    ("España/Francia",   2),
        "Final": ("Argentina/Francia",1),
    },
    "2do": {
        "R32":   ("Canadá o Suiza",  22),
        "R16":   ("Marruecos/EUA",   13),
        "QF":    ("Inglaterra/Bélg.", 7),
        "SF":    ("Brasil/Portugal",  4),
        "Final": ("Argentina/Francia",1),
    },
    "3ro": {
        "R32":   ("Lider grupo grande", 6),
        "R16":   ("Potencia top-8",     4),
        "QF":    ("Potencia top-5",     3),
        "SF":    ("Top-3",              2),
        "Final": ("Final inalcanzable", 1),
    },
}

RONDAS = ["R32", "R16", "QF", "SF", "Final"]
POSICIONES = ["1ro", "2do", "3ro"]


def dificultad_partido(rank_rival, pos_grupo):
    local = pos_grupo in ("1ro", "2do") and rank_rival > 15
    pw, _, _ = prob_resultado(15, rank_rival, ventaja_local=local)
    return 1.0 - pw


def construir_matriz():
    datos = np.zeros((len(RONDAS), len(POSICIONES)))
    rivales = {}
    for j, pos in enumerate(POSICIONES):
        for i, ronda in enumerate(RONDAS):
            nombre_rival, rank_rival = RIVALES_ESPERADOS[pos][ronda]
            dif = dificultad_partido(rank_rival, pos)
            datos[i, j] = round(dif, 3)
            rivales[(i, j)] = (nombre_rival, rank_rival, dif)
    return datos, rivales


def main():
    datos, rivales = construir_matriz()

    fig, axes = plt.subplots(1, 2, figsize=(14, 6),
                             gridspec_kw={'width_ratios': [2, 1]})
    fig.patch.set_facecolor(BG_DARK)

    # --- izq: heatmap dificultad ---
    ax = axes[0]
    ax.set_facecolor(BG_PANEL)

    cmap = mcolors.LinearSegmentedColormap.from_list(
        "mx", ["#006847", "#FFD700", "#CE1126"], N=256
    )

    im = ax.imshow(datos, cmap=cmap, vmin=0.2, vmax=0.85, aspect='auto')
    ax.set_xticks(range(len(POSICIONES)))
    ax.set_xticklabels(["1ro del grupo\n(ruta facil)", "2do del grupo\n(ruta media)", "3ro del grupo\n(ruta imposible)"],
                       color=TEXT_CLR, fontsize=9)
    ax.set_yticks(range(len(RONDAS)))
    ax.set_yticklabels(RONDAS, color=TEXT_CLR)
    ax.set_title("Dificultad del camino por posicion en grupo", color=TEXT_CLR, fontweight='bold')

    for i in range(len(RONDAS)):
        for j in range(len(POSICIONES)):
            nombre, rank, dif = rivales[(i, j)]
            color_txt = 'white' if dif > 0.55 else BG_DARK
            ax.text(j, i - 0.15, f'{dif*100:.0f}%',
                    ha='center', va='center', color=color_txt, fontsize=11, fontweight='bold')
            ax.text(j, i + 0.2, f'~{nombre}',
                    ha='center', va='center', color=color_txt, fontsize=7, alpha=0.85)

    cbar = plt.colorbar(im, ax=ax, fraction=0.03, pad=0.04)
    cbar.set_label("Probabilidad de derrota", color=TEXT_CLR, fontsize=9)
    cbar.ax.yaxis.set_tick_params(color=TEXT_CLR)
    plt.setp(cbar.ax.yaxis.get_ticklabels(), color=TEXT_CLR)

    for spine in ax.spines.values():
        spine.set_edgecolor('#30363d')

    # --- der: dificultad acumulada por posicion ---
    ax2 = axes[1]
    ax2.set_facecolor(BG_PANEL)

    colores_pos = [VERDE, ORO, ROJO]
    for j, pos in enumerate(POSICIONES):
        difs = [datos[i, j] for i in range(len(RONDAS))]
        acumulado = [1.0 - np.prod([1 - d for d in difs[:k+1]]) for k in range(len(RONDAS))]
        ax2.plot(RONDAS, acumulado, marker='o', color=colores_pos[j],
                 label=f"Terminar {pos}", linewidth=2, markersize=7)

    ax2.set_ylabel("P(eliminacion acumulada al llegar a esta ronda)", color=TEXT_CLR, fontsize=9)
    ax2.set_title("Riesgo acumulado\npor posicion en grupo", color=TEXT_CLR, fontweight='bold')
    ax2.legend(facecolor=BG_PANEL, edgecolor='#30363d', labelcolor=TEXT_CLR, fontsize=9)
    ax2.set_ylim(0, 1.05)
    ax2.tick_params(colors=TEXT_CLR)
    for spine in ax2.spines.values():
        spine.set_edgecolor('#30363d')
    ax2.grid(alpha=0.3, color=TEXT_CLR)

    plt.suptitle("Mexico 2026 — Mapa de Dificultad del Camino", color=TEXT_CLR,
                 fontsize=14, fontweight='bold')
    plt.tight_layout()
    guardar_figura(fig, "02_mapa_dificultad.png")
    plt.close()

    # output crudo
    print("\nMatriz de dificultad (probabilidad de perder cada juego):")
    import pandas as pd
    df = pd.DataFrame(datos, index=RONDAS, columns=POSICIONES)
    print(df.round(3).to_string())


if __name__ == "__main__":
    main()
