"""
Puntos Necesarios para Avanzar
--------------------------------
Simula 100,000 tablas del Grupo A para calcular con cuantos puntos
clasifica Mexico. En el formato 2026: top 2 + mejores 8 terceros.

Responde: con 6 pts es practicamente seguro? con 3 hay chance?
"""

import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from collections import defaultdict

from utils import simular_marcador, setup_estilo, guardar_figura
from utils import VERDE, ROJO, ORO, AZUL, BG_DARK, BG_PANEL, TEXT_CLR, GRIS

setup_estilo()
np.random.seed(2026)

EQUIPOS_GRUPO = {
    "México":        15,
    "Corea del Sur": 25,
    "Chequia":       41,
    "Sudáfrica":     60,
}

N = 100_000


def simular_tabla():
    equipos = list(EQUIPOS_GRUPO.keys())
    pts = {e: 0 for e in equipos}
    gd  = {e: 0 for e in equipos}
    gf  = {e: 0 for e in equipos}

    partidos = [(equipos[i], equipos[j]) for i in range(4) for j in range(i+1, 4)]

    for a, b in partidos:
        local = a == "México"
        alt = 25 if local else 0
        ga, gb = simular_marcador(EQUIPOS_GRUPO[a], EQUIPOS_GRUPO[b],
                                  ventaja_local=local, altitud_bonus=alt)
        ga, gb = int(ga[0]), int(gb[0])
        gf[a] += ga; gf[b] += gb
        gd[a] += ga - gb; gd[b] += gb - ga
        if ga > gb:   pts[a] += 3
        elif ga == gb: pts[a] += 1; pts[b] += 1
        else:          pts[b] += 3

    # ordenar tabla
    tabla = sorted(equipos, key=lambda e: (pts[e], gd[e], gf[e]), reverse=True)
    pos_mx = tabla.index("México") + 1
    pts_mx = pts["México"]
    return pos_mx, pts_mx


def main():
    resultados = [simular_tabla() for _ in range(N)]
    pos_arr = np.array([r[0] for r in resultados])
    pts_arr = np.array([r[1] for r in resultados])

    # por puntos: cuantas veces clasifica Mexico (1ro o 2do directo)
    clasif_directo  = defaultdict(int)
    total_por_pts   = defaultdict(int)
    pos_dist        = defaultdict(list)

    for pos, pts in resultados:
        total_por_pts[pts] += 1
        if pos <= 2:
            clasif_directo[pts] += 1
        pos_dist[pts].append(pos)

    print("Distribucion puntos Mexico:")
    print(f"{'Pts':>4}  {'Ocurrencias':>12}  {'% veces':>8}  {'P(clasif directo)':>18}  {'Pos prom':>9}")
    for p in sorted(total_por_pts.keys()):
        tot = total_por_pts[p]
        pct = tot / N * 100
        p_cl = clasif_directo[p] / tot if tot > 0 else 0
        pos_p = np.mean(pos_dist[p])
        print(f"{p:>4}  {tot:>12,}  {pct:>7.1f}%  {p_cl*100:>17.1f}%  {pos_p:>9.2f}")

    # probabilidad global de clasificar
    clasif_global = sum(pos <= 2 for pos, _ in resultados) / N
    # aprox con mejor-tercero: sumar ~60% de los 3ros
    terceros_pts = [pts for pos, pts in resultados if pos == 3]
    prob_3ro_clasifica_prom = 0.55  # historicamente ~55% de los 3ros con 4+ pts avanzan
    clasif_con_3ro = clasif_global + (len(terceros_pts) / N) * prob_3ro_clasifica_prom
    print(f"\nP(clasificar directamente como 1ro o 2do): {clasif_global*100:.1f}%")
    print(f"P(clasificar incluyendo chance como 3ro):   {clasif_con_3ro*100:.1f}%")

    # ---- FIGURA ----
    fig, axes = plt.subplots(1, 2, figsize=(14, 6))
    fig.patch.set_facecolor(BG_DARK)
    for ax in axes:
        ax.set_facecolor(BG_PANEL)

    # --- izq: P(clasificar directo) por pts ---
    ax1 = axes[0]
    pts_range = sorted(total_por_pts.keys())
    p_clasif  = [clasif_directo[p] / total_por_pts[p] for p in pts_range]
    ocurrencias = [total_por_pts[p] / N * 100 for p in pts_range]

    colores_barras = [VERDE if p >= 0.8 else (ORO if p >= 0.4 else ROJO) for p in p_clasif]
    bars = ax1.bar(pts_range, [p*100 for p in p_clasif], color=colores_barras,
                   edgecolor=BG_DARK, linewidth=0.8, width=0.7, zorder=3)

    ax1_r = ax1.twinx()
    ax1_r.plot(pts_range, ocurrencias, 'o--', color=AZUL, linewidth=1.5, markersize=6,
               label="Prob. de obtener esos pts")
    ax1_r.set_ylabel("P(obtener X puntos) %", color=AZUL, fontsize=9)
    ax1_r.tick_params(colors=AZUL)
    ax1_r.set_ylim(0, 45)

    ax1.set_xlabel("Puntos obtenidos en fase de grupos", color=TEXT_CLR)
    ax1.set_ylabel("P(clasificar directo como 1ro/2do) %", color=TEXT_CLR)
    ax1.set_title("Puntos vs probabilidad de clasificacion directa", color=TEXT_CLR, fontweight='bold')
    ax1.set_xticks(pts_range)
    ax1.set_ylim(0, 105)
    ax1.tick_params(colors=TEXT_CLR)
    for spine in ax1.spines.values(): spine.set_edgecolor('#30363d')
    ax1.grid(axis='y', alpha=0.3, color=TEXT_CLR, zorder=0)

    for bar, val, tot in zip(bars, p_clasif, pts_range):
        if total_por_pts[tot] / N > 0.01:
            ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 1.5,
                     f'{val*100:.0f}%', ha='center', va='bottom', color=TEXT_CLR,
                     fontsize=9, fontweight='bold')

    ax1.axhline(y=50, color=GRIS, linestyle='--', alpha=0.4, linewidth=1)
    ax1_r.legend(facecolor=BG_PANEL, edgecolor='#30363d', labelcolor=TEXT_CLR, fontsize=8, loc='upper left')

    # --- der: distribucion de posicion final ---
    ax2 = axes[1]
    pos_counts = pd.Series(pos_arr).value_counts().sort_index()
    col_pos = [VERDE, ORO, GRIS, ROJO]
    bars2 = ax2.bar(pos_counts.index, pos_counts.values / N * 100,
                    color=col_pos[:len(pos_counts)], edgecolor=BG_DARK, linewidth=0.8, width=0.6)

    for bar in bars2:
        ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.3,
                 f'{bar.get_height():.1f}%', ha='center', va='bottom', color=TEXT_CLR,
                 fontsize=10, fontweight='bold')

    ax2.axhline(y=0, color=GRIS, linewidth=0.5)
    ax2.set_xticks([1, 2, 3, 4])
    ax2.set_xticklabels(["1er lugar\n(clasificacion\ndirecta)",
                          "2do lugar\n(clasificacion\ndirecta)",
                          "3er lugar\n(posible\nclasificacion)",
                          "4to lugar\n(eliminado)"], color=TEXT_CLR, fontsize=9)
    ax2.set_ylabel("% de simulaciones", color=TEXT_CLR)
    ax2.set_title(f"Distribucion de posicion final de Mexico\n({N:,} simulaciones)", color=TEXT_CLR, fontweight='bold')
    ax2.tick_params(colors=TEXT_CLR)
    for spine in ax2.spines.values(): spine.set_edgecolor('#30363d')
    ax2.grid(axis='y', alpha=0.3, color=TEXT_CLR)

    ax2.text(0.95, 0.92,
             f"P(clasif. directo): {clasif_global*100:.1f}%\nP(clasif. total ~): {clasif_con_3ro*100:.1f}%",
             transform=ax2.transAxes, ha='right', va='top',
             color=ORO, fontsize=11, fontweight='bold',
             bbox=dict(boxstyle='round', facecolor=BG_DARK, edgecolor=ORO, alpha=0.8))

    plt.suptitle("Mexico 2026 — Puntos Necesarios para Clasificar", color=TEXT_CLR,
                 fontsize=14, fontweight='bold')
    plt.tight_layout()
    guardar_figura(fig, "10_puntos_necesarios.png")
    plt.close()


if __name__ == "__main__":
    main()
