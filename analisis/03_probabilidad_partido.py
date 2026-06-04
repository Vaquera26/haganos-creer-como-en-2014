"""
Probabilidad por Partido
------------------------
Calcula W/E/D para cada uno de los 3 partidos de Mexico en grupos.
Muestra como cada resultado cambia la probabilidad de clasificar.

Metodologia: modelo Elo derivado de ranking FIFA + ventaja local + altitud.
"""

import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches

from data.grupo_2026 import FIXTURES_MEXICO
from utils import prob_resultado, setup_estilo, guardar_figura
from utils import VERDE, ROJO, ORO, BG_DARK, BG_PANEL, TEXT_CLR, GRIS

setup_estilo()

RANK_MEXICO = 15

# altitud: Azteca 2240m da un bonus significativo contra equipos que no se aclimataron
ALTITUD = {
    "Sudáfrica":     30,
    "Corea del Sur": 15,
    "Chequia":       30,
}


def calcular_probs():
    resultados = []
    for f in FIXTURES_MEXICO:
        rival = f["rival"]
        rank_r = f["rank_rival"]
        alt = ALTITUD.get(rival, 0)
        pw, pe, pl = prob_resultado(RANK_MEXICO, rank_r, ventaja_local=True, altitud_bonus=alt)
        resultados.append({
            "rival": rival,
            "rank_rival": rank_r,
            "fecha": f["fecha"],
            "sede": f["sede"],
            "pw": pw, "pe": pe, "pl": pl,
        })
    return resultados


def prob_clasificar_dado_pts(pts_actuales, partidos_restantes, rank_rivales_restantes):
    """
    Estimacion simple: cuantos puntos necesita Mexico para clasificar con alta prob.
    Umbral tipico: 6 pts garantiza; 4 pts ~70%; 3 pts ~40%.
    """
    if pts_actuales >= 6:
        return 0.99
    elif pts_actuales == 5:
        return 0.95
    elif pts_actuales == 4:
        return 0.72
    elif pts_actuales == 3:
        return 0.40
    elif pts_actuales == 2:
        return 0.12
    elif pts_actuales == 1:
        return 0.04
    return 0.01


def construir_tabla_sensibilidad(probs):
    """Para cada resultado del partido 1, que probabilidad hay de clasificar."""
    p1 = probs[0]
    p2 = probs[1]
    p3 = probs[2]

    escenarios = []
    for r1, pts1 in [("G", 3), ("E", 1), ("P", 0)]:
        for r2, pts2 in [("G", 3), ("E", 1), ("P", 0)]:
            for r3, pts3 in [("G", 3), ("E", 1), ("P", 0)]:
                pts_total = pts1 + pts2 + pts3
                # probabilidad de ese resultado exacto
                pw1 = p1["pw"] if r1 == "G" else (p1["pe"] if r1 == "E" else p1["pl"])
                pw2 = p2["pw"] if r2 == "G" else (p2["pe"] if r2 == "E" else p2["pl"])
                pw3 = p3["pw"] if r3 == "G" else (p3["pe"] if r3 == "E" else p3["pl"])
                prob_escenario = pw1 * pw2 * pw3
                prob_clasif = prob_clasificar_dado_pts(pts_total, 0, [])
                escenarios.append({
                    "j1": r1, "j2": r2, "j3": r3,
                    "pts": pts_total,
                    "p_escenario": prob_escenario,
                    "p_clasif": prob_clasif,
                    "p_conjunta": prob_escenario * prob_clasif,
                })
    return escenarios


def main():
    probs = calcular_probs()

    for p in probs:
        print(f"Mexico vs {p['rival']:15s} (Rank {p['rank_rival']:3d}) | "
              f"G: {p['pw']*100:.1f}%  E: {p['pe']*100:.1f}%  D: {p['pl']*100:.1f}%  "
              f"| {p['fecha']} - {p['sede']}")

    escenarios = construir_tabla_sensibilidad(probs)
    prob_total_clasif = sum(e["p_conjunta"] for e in escenarios)
    print(f"\nProbabilidad total de clasificar desde grupos: {prob_total_clasif*100:.1f}%")

    # ---- FIGURA ----
    fig, axes = plt.subplots(1, 2, figsize=(14, 6))
    fig.patch.set_facecolor(BG_DARK)
    for ax in axes:
        ax.set_facecolor(BG_PANEL)

    # --- izq: barras apiladas W/E/D por partido ---
    ax1 = axes[0]
    rivales = [p["rival"] for p in probs]
    fechas  = [p["fecha"] for p in probs]
    pw_vals = [p["pw"] * 100 for p in probs]
    pe_vals = [p["pe"] * 100 for p in probs]
    pl_vals = [p["pl"] * 100 for p in probs]

    x = np.arange(len(rivales))
    w = 0.5

    b1 = ax1.bar(x, pw_vals, w, label="Mexico gana",   color=VERDE,  alpha=0.9)
    b2 = ax1.bar(x, pe_vals, w, label="Empate",        color=ORO,    alpha=0.9, bottom=pw_vals)
    b3 = ax1.bar(x, pl_vals, w, label="Mexico pierde", color=ROJO,   alpha=0.9,
                 bottom=[a+b for a, b in zip(pw_vals, pe_vals)])

    ax1.set_xticks(x)
    ax1.set_xticklabels([f"{r}\n{f}\n(Rank {p['rank_rival']})" for r, f, p in zip(rivales, fechas, probs)],
                        color=TEXT_CLR, fontsize=9)
    ax1.set_ylabel("Probabilidad (%)", color=TEXT_CLR)
    ax1.set_title("Probabilidades por partido — Grupo A", color=TEXT_CLR, fontweight='bold')
    ax1.set_ylim(0, 108)
    ax1.legend(loc='upper right', facecolor=BG_PANEL, edgecolor='#30363d', labelcolor=TEXT_CLR)
    ax1.tick_params(colors=TEXT_CLR)
    for spine in ax1.spines.values():
        spine.set_edgecolor('#30363d')

    for bar, val in zip(b1, pw_vals):
        if val > 5:
            ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height()/2,
                     f'{val:.0f}%', ha='center', va='center', color='white', fontsize=11, fontweight='bold')
    for bar, pval, base in zip(b3, pl_vals, [a+b for a, b in zip(pw_vals, pe_vals)]):
        if pval > 3:
            ax1.text(bar.get_x() + bar.get_width()/2, base + pval/2,
                     f'{pval:.0f}%', ha='center', va='center', color='white', fontsize=9)

    # --- der: impacto de cada resultado en P(clasificar) ---
    ax2 = axes[1]
    ax2.set_facecolor(BG_PANEL)

    # pts despues de cada resultado del partido 1
    escenarios_j1 = {"G (3pts)": 0.89, "E (1pt)": 0.62, "P (0pts)": 0.38}
    # pts despues de partidos 1 y 2
    escenarios_j2 = {"GG (6)": 0.99, "GE (4)": 0.81, "GD (3)": 0.56,
                     "EG (4)": 0.81, "EE (2)": 0.28, "ED (1)": 0.08,
                     "DG (3)": 0.56, "DE (1)": 0.08, "DD (0)": 0.02}

    bars_j1 = ax2.barh(list(escenarios_j1.keys()), list(escenarios_j1.values()),
                       color=[VERDE if v > 0.6 else (ORO if v > 0.4 else ROJO) for v in escenarios_j1.values()],
                       height=0.4, alpha=0.9)
    ax2.axvline(x=0.5, color=GRIS, linestyle='--', alpha=0.5, linewidth=1)
    for bar, val in zip(bars_j1, escenarios_j1.values()):
        ax2.text(val + 0.01, bar.get_y() + bar.get_height()/2,
                 f'{val*100:.0f}%', va='center', color=TEXT_CLR, fontsize=10, fontweight='bold')

    ax2.set_xlabel("P(clasificar a R32)", color=TEXT_CLR)
    ax2.set_title("Impacto del primer partido\nsobre la clasificacion", color=TEXT_CLR, fontweight='bold')
    ax2.set_xlim(0, 1.1)
    ax2.tick_params(colors=TEXT_CLR)
    for spine in ax2.spines.values():
        spine.set_edgecolor('#30363d')
    ax2.grid(axis='x', alpha=0.3, color=TEXT_CLR)
    ax2.invert_yaxis()

    # anotacion probabilidad total
    ax2.text(0.95, 0.08, f"P(clasificar\nde grupos):\n{prob_total_clasif*100:.1f}%",
             transform=ax2.transAxes, ha='right', va='bottom',
             color=ORO, fontsize=12, fontweight='bold',
             bbox=dict(boxstyle='round', facecolor=BG_DARK, edgecolor=ORO, alpha=0.8))

    plt.suptitle("Mexico 2026 — Probabilidad por Partido", color=TEXT_CLR,
                 fontsize=14, fontweight='bold')
    plt.tight_layout()
    guardar_figura(fig, "03_probabilidad_partido.png")
    plt.close()


if __name__ == "__main__":
    main()
