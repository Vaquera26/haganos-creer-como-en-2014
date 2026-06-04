"""
Arbol de Caminos Posibles
--------------------------
Diagrama tipo llave de bracket mostrando todos los posibles caminos de Mexico.
Cada nodo tiene probabilidad de llegar y dificultad del rival.
Usa networkx + matplotlib para dibujar el arbol.
"""

import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as FancyBboxPatch
import networkx as nx

from utils import prob_resultado, setup_estilo, guardar_figura, elo_desde_ranking
from utils import VERDE, ROJO, ORO, AZUL, BG_DARK, BG_PANEL, TEXT_CLR, GRIS

setup_estilo()

# arbol de caminos: nodos = (etapa, resultado_posible)
# probabilidades basadas en ranking del rival esperado
CAMINOS = {
    "grupos": {
        "rival": "Grupo A",
        "label": "Fase de Grupos\nvs SUD/KOR/CZE",
        "p_llegar": 1.0,
        "rank_rivales": [60, 25, 41],  # 3 partidos
        "pos": (0, 1),
    },
}

# llave simplificada: Mexico como 1ro o 2do del grupo
NODOS = [
    # (id, label, p_llegar, p_ganar, rank_rival, nivel, y_pos)
    ("start",    "Mexico\n(Rank 15)",           1.000, None,  None, 0, 1.0),
    ("grupos_G", "Clasifica\n1ro (60%)",         0.850, 0.85,  None, 1, 1.5),
    ("grupos_2", "Clasifica\n2do (25%)",         0.850, 0.25,  None, 1, 0.5),
    ("grupos_3", "3ro: depende\nde criterios",   0.100, None,  None, 1, -0.3),
    # R32 si termina 1ro
    ("r32_A",    "R32 vs\nSuiza/Canada\n(Rk~18)", 0.600, 0.620, 18,  2, 1.5),
    # R32 si termina 2do
    ("r32_B",    "R32 vs\nCanada/Suiza\n(Rk~22)", 0.250, 0.590, 22,  2, 0.5),
    # R32 si termina 3ro (vs lider otro grupo ~8)
    ("r32_C",    "R32 vs lider\ngrupo grande\n(Rk~6)", 0.060, 0.320, 6, 2, -0.3),
    # R16
    ("r16_A",    "R16 vs\nBrasil/EUA\n(Rk~10)",   0.372, 0.445, 10, 3, 1.8),
    ("r16_B",    "R16 vs\nMarruec/EUA\n(Rk~13)",  0.148, 0.480, 13, 3, 0.8),
    ("r16_C",    "R16 vs\ntop potencia\n(Rk~4)",   0.019, 0.310, 4,  3, -0.3),
    # QF
    ("qf_A",     "QF vs\nAlem/NL\n(Rk~7)",        0.165, 0.390, 7,  4, 1.8),
    ("qf_B",     "QF vs\nIngl/Belg\n(Rk~7)",      0.071, 0.390, 7,  4, 0.8),
    # SF
    ("sf",       "SF vs\nEspaña/Fran\n(Rk~3)",    0.093, 0.320, 3,  5, 1.3),
    # Final
    ("final",    "Final vs\nArg/Fran\n(Rk~1)",    0.030, 0.250, 1,  6, 1.3),
    ("campeon",  "CAMPEON",                        0.007, 1.0,  None, 7, 1.3),
]

EDGES = [
    ("start",    "grupos_G"),
    ("start",    "grupos_2"),
    ("start",    "grupos_3"),
    ("grupos_G", "r32_A"),
    ("grupos_2", "r32_B"),
    ("grupos_3", "r32_C"),
    ("r32_A",    "r16_A"),
    ("r32_B",    "r16_B"),
    ("r32_C",    "r16_C"),
    ("r16_A",    "qf_A"),
    ("r16_B",    "qf_B"),
    ("r16_C",    "qf_B"),
    ("qf_A",     "sf"),
    ("qf_B",     "sf"),
    ("sf",       "final"),
    ("final",    "campeon"),
]


def color_prob(p):
    if p >= 0.7:
        return VERDE
    elif p >= 0.45:
        return ORO
    elif p >= 0.25:
        "#f97316"  # naranja
        return '#f97316'
    return ROJO


def main():
    nodos_dict = {n[0]: n for n in NODOS}

    fig, ax = plt.subplots(figsize=(16, 9))
    fig.patch.set_facecolor(BG_DARK)
    ax.set_facecolor(BG_DARK)

    ax.set_xlim(-0.5, 7.5)
    ax.set_ylim(-1, 3)
    ax.axis('off')

    # calcular posiciones
    pos_map = {}
    for nodo in NODOS:
        nid, label, p_llegar, p_ganar, rank_rival, nivel, y = nodo
        pos_map[nid] = (nivel * 1.0, y)

    # dibujar edges
    for src, dst in EDGES:
        x0, y0 = pos_map[src]
        x1, y1 = pos_map[dst]
        ax.plot([x0, x1], [y0, y1], color='#30363d', linewidth=1.2, zorder=1, alpha=0.8)

    # dibujar nodos
    for nodo in NODOS:
        nid, label, p_llegar, p_ganar, rank_rival, nivel, y = nodo
        x, _ = pos_map[nid]

        # tamano del nodo proporcional a P(llegar)
        size = max(0.06, p_llegar * 0.35)

        if nid == "campeon":
            node_color = ORO
        elif p_ganar is None:
            node_color = AZUL
        else:
            node_color = color_prob(p_ganar)

        circle = plt.Circle((x, y), size, color=node_color, zorder=3, alpha=0.85)
        ax.add_patch(circle)

        # texto dentro del nodo
        fontsize = min(7.5, max(5.5, 7 * p_llegar + 5))
        ax.text(x, y + 0.01, label, ha='center', va='center',
                color='white', fontsize=6.5, fontweight='bold',
                zorder=4, multialignment='center')

        # probabilidad de llegar debajo
        if p_llegar < 1.0:
            ax.text(x, y - size - 0.08, f"P={p_llegar*100:.1f}%",
                    ha='center', va='top', color=GRIS, fontsize=6.5, zorder=4)

    # leyenda de etapas
    etapas = ["Inicio", "Grupos", "R32", "R16", "QF", "SF", "Final", "Campeon"]
    for i, etapa in enumerate(etapas):
        ax.text(i * 1.0, -0.8, etapa, ha='center', va='center',
                color=GRIS, fontsize=8, style='italic')
        if i > 0:
            ax.plot([i-1, i], [-0.7, -0.7], color='#30363d', linewidth=0.8, alpha=0.5)

    # leyenda colores
    leyenda_items = [
        (VERDE, "P(ganar) >= 70%"),
        (ORO,   "45-69%"),
        ('#f97316', "25-44%"),
        (ROJO,  "< 25%"),
    ]
    for k, (col, txt) in enumerate(leyenda_items):
        ax.add_patch(plt.Circle((6.8, 2.5 - k * 0.22), 0.06, color=col, zorder=5))
        ax.text(6.95, 2.5 - k * 0.22, txt, va='center', color=TEXT_CLR, fontsize=7, zorder=5)

    ax.text(0.5, 2.85, "Mexico 2026 — Arbol de Caminos Posibles",
            transform=ax.transAxes, ha='center', va='center',
            color=TEXT_CLR, fontsize=14, fontweight='bold')
    ax.text(0.5, 2.70, "Tamano del nodo proporcional a P(llegar); color = dificultad del partido",
            ha='center', va='center', color=GRIS, fontsize=8)

    plt.tight_layout()
    guardar_figura(fig, "06_arbol_caminos.png", dpi=180)
    plt.close()

    print("Caminos principales:")
    for nodo in NODOS:
        nid, label, p_llegar, p_ganar, rank_rival, nivel, y = nodo
        if p_llegar > 0.01:
            pg_str = f"  P(ganar)={p_ganar*100:.0f}%" if p_ganar else ""
            print(f"  {label.replace(chr(10),' '):40s} P(llegar)={p_llegar*100:.1f}%{pg_str}")


if __name__ == "__main__":
    main()
