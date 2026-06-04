"""
Radiografia del Grupo A
------------------------
Comparacion detallada de los 4 equipos del Grupo A.
Metricas: ranking FIFA, fuerza ofensiva (xG), solidez defensiva (xGA),
experiencia mundialista, forma reciente, coeficiente Elo.

Salida: radar chart de las 4 selecciones + barras individuales.
"""

import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches

from utils import prob_resultado, xg_partido, elo_desde_ranking, setup_estilo, guardar_figura
from utils import VERDE, ROJO, ORO, AZUL, BG_DARK, BG_PANEL, TEXT_CLR, GRIS

setup_estilo()

# datos del Grupo A con metricas historicas y de forma reciente
GRUPO_A = {
    "México": {
        "rank": 15, "elo": 1688,
        "mundiales": 18, "mejor_resultado": "Cuartos 1970/1986",
        "goles_ultimos_10": 17, "goles_contra_ultimos_10": 5,
        "xg_prom": 1.65, "xga_prom": 0.72,
        "forma_pct": 0.77,  # W/(W+D+L) ultimos 10, ponderado
        "presion": 8.5,     # presion mediática/historica (escala 1-10)
        "color": VERDE,
    },
    "Corea del Sur": {
        "rank": 25, "elo": 1600,
        "mundiales": 11, "mejor_resultado": "4to lugar 2002",
        "goles_ultimos_10": 14, "goles_contra_ultimos_10": 9,
        "xg_prom": 1.35, "xga_prom": 0.98,
        "forma_pct": 0.58,
        "presion": 6.0,
        "color": ROJO,
    },
    "Chequia": {
        "rank": 41, "elo": 1488,
        "mundiales": 10,  # contando era Checoslovaquia
        "mejor_resultado": "Final Checoslovaquia 1934/1962",
        "goles_ultimos_10": 10, "goles_contra_ultimos_10": 11,
        "xg_prom": 1.15, "xga_prom": 1.12,
        "forma_pct": 0.47,
        "presion": 3.5,
        "color": AZUL,
    },
    "Sudáfrica": {
        "rank": 60, "elo": 1352,
        "mundiales": 4, "mejor_resultado": "Grupos (1998, 2002, 2010 como sede)",
        "goles_ultimos_10": 9, "goles_contra_ultimos_10": 14,
        "xg_prom": 0.98, "xga_prom": 1.35,
        "forma_pct": 0.38,
        "presion": 4.5,
        "color": "#FFD700",
    },
}

DIMENSIONES_RADAR = [
    "Ranking\n(invertido)",
    "Ataque\n(xG/90)",
    "Defensa\n(inv xGA)",
    "Forma\nreciente",
    "Experiencia\nmundialista",
]


def normalizar(valor, min_val, max_val):
    return (valor - min_val) / (max_val - min_val) * 10


def calcular_scores():
    scores = {}
    for equipo, datos in GRUPO_A.items():
        # ranking invertido: rank 1 = 10, rank 100 = 0
        rank_score = (101 - datos["rank"]) / 100 * 10
        # ataque: xg promedio normalizado (0.5 = 1 pt, 2.0 = 10 pts)
        ataque_score = normalizar(datos["xg_prom"], 0.5, 2.0)
        # defensa: xga invertido (0.5 = 10 pts, 2.0 = 0 pts)
        defensa_score = normalizar(2.0 - datos["xga_prom"], 0, 1.5)
        # forma
        forma_score = datos["forma_pct"] * 10
        # experiencia
        exp_score = min(10, datos["mundiales"] / 2)

        scores[equipo] = np.array([rank_score, ataque_score, defensa_score, forma_score, exp_score])
    return scores


def main():
    scores = calcular_scores()

    # probs entre equipos
    for e1 in GRUPO_A:
        for e2 in GRUPO_A:
            if e1 < e2:
                r1, r2 = GRUPO_A[e1]["rank"], GRUPO_A[e2]["rank"]
                local = e1 == "México"
                pw, pe, pl = prob_resultado(r1, r2, ventaja_local=local, altitud_bonus=25 if local else 0)
                print(f"  {e1:15s} vs {e2:15s}: G={pw*100:.1f}% E={pe*100:.1f}% P={pl*100:.1f}%")

    # ---- FIGURA ----
    fig = plt.figure(figsize=(14, 9))
    fig.patch.set_facecolor(BG_DARK)

    # radar chart
    ax_radar = fig.add_subplot(121, polar=True)
    ax_radar.set_facecolor(BG_PANEL)

    n = len(DIMENSIONES_RADAR)
    angulos = np.linspace(0, 2 * np.pi, n, endpoint=False).tolist()
    angulos += angulos[:1]

    ax_radar.set_xticks(angulos[:-1])
    ax_radar.set_xticklabels(DIMENSIONES_RADAR, color=TEXT_CLR, fontsize=9)
    ax_radar.set_ylim(0, 10)
    ax_radar.set_yticks([2, 4, 6, 8, 10])
    ax_radar.set_yticklabels(["2", "4", "6", "8", "10"], color=GRIS, fontsize=7)
    ax_radar.grid(color='#30363d', alpha=0.6)
    ax_radar.spines['polar'].set_color('#30363d')

    for equipo, vals in scores.items():
        color = GRUPO_A[equipo]["color"]
        v = list(vals) + [vals[0]]
        ax_radar.plot(angulos, v, color=color, linewidth=2.5, label=equipo)
        ax_radar.fill(angulos, v, color=color, alpha=0.15)

    ax_radar.legend(loc='upper right', bbox_to_anchor=(1.3, 1.1),
                    facecolor=BG_PANEL, edgecolor='#30363d', labelcolor=TEXT_CLR, fontsize=9)
    ax_radar.set_title("Perfil del Grupo A", color=TEXT_CLR, fontweight='bold', pad=20)

    # barras individuales por metrica
    ax_bars = fig.add_subplot(122)
    ax_bars.set_facecolor(BG_PANEL)

    equipos = list(GRUPO_A.keys())
    n_dim = len(DIMENSIONES_RADAR)
    y = np.arange(n_dim)
    h = 0.18
    offsets = np.linspace(-0.28, 0.28, len(equipos))

    for i, equipo in enumerate(equipos):
        color = GRUPO_A[equipo]["color"]
        vals = scores[equipo]
        bars = ax_bars.barh(y + offsets[i], vals, h, color=color, alpha=0.85, label=equipo)

    ax_bars.set_yticks(y)
    ax_bars.set_yticklabels([d.replace('\n', ' ') for d in DIMENSIONES_RADAR], color=TEXT_CLR, fontsize=9)
    ax_bars.set_xlabel("Score (0-10)", color=TEXT_CLR)
    ax_bars.set_title("Comparacion por metrica", color=TEXT_CLR, fontweight='bold')
    ax_bars.set_xlim(0, 11)
    ax_bars.axvline(x=5, color=GRIS, linestyle='--', alpha=0.3, linewidth=1)
    ax_bars.legend(facecolor=BG_PANEL, edgecolor='#30363d', labelcolor=TEXT_CLR, fontsize=9)
    ax_bars.tick_params(colors=TEXT_CLR)
    for spine in ax_bars.spines.values(): spine.set_edgecolor('#30363d')
    ax_bars.grid(axis='x', alpha=0.3, color=TEXT_CLR)

    # tabla resumen abajo
    info_txt = "\n".join([
        f"{eq}: Rank {GRUPO_A[eq]['rank']} | Elo ~{GRUPO_A[eq]['elo']} | Mejor: {GRUPO_A[eq]['mejor_resultado']}"
        for eq in equipos
    ])
    fig.text(0.5, 0.01, info_txt, ha='center', va='bottom', color=GRIS, fontsize=7, alpha=0.8)

    plt.suptitle("Mexico 2026 — Radiografia del Grupo A", color=TEXT_CLR,
                 fontsize=14, fontweight='bold')
    plt.tight_layout(rect=[0, 0.06, 1, 0.98])
    guardar_figura(fig, "09_radiografia_grupo.png")
    plt.close()


if __name__ == "__main__":
    main()
