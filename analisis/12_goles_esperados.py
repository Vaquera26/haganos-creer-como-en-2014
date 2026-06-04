"""
Modelo de Goles Esperados (xG)
--------------------------------
Simula 50,000 marcadores para cada partido de Mexico en grupos.
Genera heatmaps de probabilidad de cada marcador posible,
distribuciones de diferencia de goles y resumen de expectativas.

Modelo: Poisson con parametros derivados de ranking FIFA y ventaja local.
"""

import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
import seaborn as sns
from scipy.stats import poisson

from data.grupo_2026 import FIXTURES_MEXICO
from utils import xg_partido, setup_estilo, guardar_figura, elo_desde_ranking
from utils import VERDE, ROJO, ORO, AZUL, BG_DARK, BG_PANEL, TEXT_CLR, GRIS

setup_estilo()
np.random.seed(42)

N_SIM = 50_000
MAX_GOLES = 6
ALTITUD = {"Sudáfrica": 30, "Corea del Sur": 15, "Chequia": 30}


def simular_marcadores_partido(rank_mx, rank_rival, local=True, alt_bonus=0, n=N_SIM):
    xg_mx, xg_rival = xg_partido(rank_mx, rank_rival, ventaja_local=local, altitud_bonus=alt_bonus)
    goles_mx    = poisson.rvs(xg_mx,    size=n)
    goles_rival = poisson.rvs(xg_rival, size=n)
    return goles_mx, goles_rival, xg_mx, xg_rival


def construir_heatmap(goles_mx, goles_rival):
    mat = np.zeros((MAX_GOLES + 1, MAX_GOLES + 1))
    for gm, gr in zip(goles_mx, goles_rival):
        if gm <= MAX_GOLES and gr <= MAX_GOLES:
            mat[gm, gr] += 1
    return mat / mat.sum() * 100


def main():
    fig, axes = plt.subplots(2, 3, figsize=(16, 10))
    fig.patch.set_facecolor(BG_DARK)

    cmap_heat = mcolors.LinearSegmentedColormap.from_list(
        "mx_heat", [BG_PANEL, "#1a472a", VERDE, ORO], N=256
    )

    for i, fixture in enumerate(FIXTURES_MEXICO):
        rival = fixture["rival"]
        rank_r = fixture["rank_rival"]
        alt = ALTITUD.get(rival, 0)

        goles_mx, goles_rival, xg_mx, xg_rival = simular_marcadores_partido(15, rank_r, local=True, alt_bonus=alt)

        resultados = np.where(goles_mx > goles_rival, "G",
                     np.where(goles_mx == goles_rival, "E", "P"))
        pct_g = (resultados == "G").mean() * 100
        pct_e = (resultados == "E").mean() * 100
        pct_p = (resultados == "P").mean() * 100

        # marcador mas probable
        from collections import Counter
        marcadores = Counter(zip(goles_mx.clip(0, MAX_GOLES), goles_rival.clip(0, MAX_GOLES)))
        top3 = marcadores.most_common(3)

        print(f"\nMexico vs {rival} (xG: {xg_mx:.2f} - {xg_rival:.2f})")
        print(f"  G={pct_g:.1f}%  E={pct_e:.1f}%  P={pct_p:.1f}%")
        print(f"  Marcadores mas probables: " + " | ".join([f"{m[0]}-{m[1]} ({c/N_SIM*100:.1f}%)" for m, c in top3]))

        # heatmap
        ax_heat = axes[0, i]
        ax_heat.set_facecolor(BG_PANEL)
        mat = construir_heatmap(goles_mx, goles_rival)

        im = ax_heat.imshow(mat, cmap=cmap_heat, aspect='auto', origin='lower',
                            vmin=0, vmax=mat.max())
        ax_heat.set_xlabel(f"Goles {rival}", color=TEXT_CLR)
        ax_heat.set_ylabel("Goles Mexico", color=TEXT_CLR)
        ax_heat.set_title(f"Mexico vs {rival}\n({fixture['fecha']}) xG: {xg_mx:.2f}—{xg_rival:.2f}",
                          color=TEXT_CLR, fontweight='bold')
        ax_heat.set_xticks(range(MAX_GOLES + 1))
        ax_heat.set_yticks(range(MAX_GOLES + 1))
        ax_heat.tick_params(colors=TEXT_CLR)
        for spine in ax_heat.spines.values(): spine.set_edgecolor('#30363d')

        # anotaciones de porcentaje en cada celda
        for r in range(MAX_GOLES + 1):
            for c in range(MAX_GOLES + 1):
                val = mat[r, c]
                if val >= 0.5:
                    col_txt = 'white' if val < mat.max() * 0.5 else BG_DARK
                    ax_heat.text(c, r, f'{val:.1f}', ha='center', va='center',
                                 color=col_txt, fontsize=6.5)

        # diagonales: victoria/empate/derrota
        for d in range(min(MAX_GOLES, 4)):
            ax_heat.plot([d - 0.5, d + 0.5], [d - 0.5, d + 0.5],
                         color=ORO, linewidth=0.8, alpha=0.4)

        # resultado badge
        ax_heat.text(MAX_GOLES - 0.2, 0.3,
                     f"G: {pct_g:.0f}%\nE: {pct_e:.0f}%\nP: {pct_p:.0f}%",
                     ha='right', va='bottom', color=TEXT_CLR, fontsize=8,
                     bbox=dict(boxstyle='round', facecolor=BG_DARK, edgecolor='#30363d', alpha=0.7))

        plt.colorbar(im, ax=ax_heat, fraction=0.04, pad=0.02).ax.yaxis.set_tick_params(color=GRIS)

        # distribucion de diferencia de goles
        ax_dist = axes[1, i]
        ax_dist.set_facecolor(BG_PANEL)
        diff = goles_mx.astype(int) - goles_rival.astype(int)
        diff_range = np.arange(-4, 5)
        counts = np.array([(diff == d).sum() / N_SIM * 100 for d in diff_range])
        colores_diff = [VERDE if d > 0 else (ORO if d == 0 else ROJO) for d in diff_range]

        ax_dist.bar(diff_range, counts, color=colores_diff, edgecolor=BG_DARK, linewidth=0.8, width=0.75)
        ax_dist.axvline(x=0, color=GRIS, linestyle='--', alpha=0.4, linewidth=1)
        ax_dist.set_xlabel("Diferencia de goles (Mexico - Rival)", color=TEXT_CLR)
        ax_dist.set_ylabel("% de simulaciones", color=TEXT_CLR)
        ax_dist.set_title(f"Diferencia de goles esperada\nvs {rival}", color=TEXT_CLR, fontweight='bold')
        ax_dist.set_xticks(diff_range)
        ax_dist.tick_params(colors=TEXT_CLR)
        for spine in ax_dist.spines.values(): spine.set_edgecolor('#30363d')
        ax_dist.grid(axis='y', alpha=0.3, color=TEXT_CLR)

        # valor esperado de goles
        ax_dist.text(0.05, 0.92,
                     f"E[GF]={xg_mx:.2f}  E[GA]={xg_rival:.2f}",
                     transform=ax_dist.transAxes, color=TEXT_CLR, fontsize=8,
                     bbox=dict(boxstyle='round', facecolor=BG_DARK, edgecolor='#30363d', alpha=0.7))

    plt.suptitle("Mexico 2026 — Modelo de Goles Esperados por Partido", color=TEXT_CLR,
                 fontsize=14, fontweight='bold')
    plt.tight_layout()
    guardar_figura(fig, "12_goles_esperados.png", dpi=140)
    plt.close()


if __name__ == "__main__":
    main()
