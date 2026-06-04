"""
Escenarios de Clasificacion
----------------------------
Enumera todos los 27 escenarios posibles (3 resultados x 3 partidos).
Para cada combinacion muestra: puntos, probabilidad de ese escenario,
y si Mexico clasifica o no (con que margen de seguridad).

Responde: con cuantos puntos clasifica Mexico? Con 6 seguro? Con 3?
"""

import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import seaborn as sns

from data.grupo_2026 import FIXTURES_MEXICO
from utils import prob_resultado, setup_estilo, guardar_figura
from utils import VERDE, ROJO, ORO, BG_DARK, BG_PANEL, TEXT_CLR, GRIS

setup_estilo()

RANK_MEXICO = 15
ALTITUD = {"Sudáfrica": 30, "Corea del Sur": 15, "Chequia": 30}

PROB_CLASIF_POR_PTS = {
    0: 0.01, 1: 0.04, 2: 0.12, 3: 0.40, 4: 0.72, 5: 0.95, 6: 0.99, 7: 1.0, 8: 1.0, 9: 1.0
}


def probs_partidos():
    probs = []
    for f in FIXTURES_MEXICO:
        alt = ALTITUD.get(f["rival"], 0)
        pw, pe, pl = prob_resultado(RANK_MEXICO, f["rank_rival"], ventaja_local=True, altitud_bonus=alt)
        probs.append({"rival": f["rival"], "pw": pw, "pe": pe, "pl": pl})
    return probs


def generar_escenarios(probs):
    codigos = {"G": 3, "E": 1, "P": 0}
    rows = []
    for r1 in ["G", "E", "P"]:
        for r2 in ["G", "E", "P"]:
            for r3 in ["G", "E", "P"]:
                pts = codigos[r1] + codigos[r2] + codigos[r3]
                p_esc = (
                    probs[0]["pw" if r1=="G" else ("pe" if r1=="E" else "pl")] *
                    probs[1]["pw" if r2=="G" else ("pe" if r2=="E" else "pl")] *
                    probs[2]["pw" if r3=="G" else ("pe" if r3=="E" else "pl")]
                )
                p_cl = PROB_CLASIF_POR_PTS.get(pts, 1.0)
                rows.append({
                    "j1": r1, "j2": r2, "j3": r3,
                    "resultado": f"{r1}-{r2}-{r3}",
                    "pts": pts,
                    "p_escenario": p_esc,
                    "p_clasif": p_cl,
                    "p_conjunta": p_esc * p_cl,
                    "clasifica": p_cl >= 0.50,
                })
    return pd.DataFrame(rows).sort_values("pts", ascending=False)


def main():
    probs = probs_partidos()
    df = generar_escenarios(probs)

    prob_total = df["p_conjunta"].sum()
    print(f"P(clasificar de grupos): {prob_total*100:.1f}%\n")
    print("Escenarios con >= 5% de probabilidad:")
    top = df[df["p_escenario"] >= 0.03].sort_values("p_escenario", ascending=False)
    for _, row in top.iterrows():
        sym = "✓" if row["clasifica"] else "✗"
        print(f"  {sym} {row['resultado']}  {row['pts']}pts  "
              f"P(esc)={row['p_escenario']*100:.1f}%  P(clasif)={row['p_clasif']*100:.0f}%")

    # ---- FIGURA ----
    fig, axes = plt.subplots(1, 2, figsize=(14, 7))
    fig.patch.set_facecolor(BG_DARK)
    for ax in axes:
        ax.set_facecolor(BG_PANEL)

    # --- izq: matriz resultado J1 x J2 coloreada por probabilidad de clasificar
    ax1 = axes[0]
    pivot_data = np.zeros((3, 3))
    resultados = ["G", "E", "P"]
    for i, r1 in enumerate(resultados):
        for j, r2 in enumerate(resultados):
            # promedio ponderado de P(clasif) dado J1=r1, J2=r2 (suma sobre J3)
            sub = df[(df["j1"] == r1) & (df["j2"] == r2)]
            if len(sub) > 0:
                # esperanza de P(clasif) dado r1, r2
                p_r3_norm = sub["p_escenario"] / sub["p_escenario"].sum()
                val = (sub["p_clasif"] * p_r3_norm).sum()
                pivot_data[i, j] = val

    import matplotlib.colors as mcolors
    cmap = mcolors.LinearSegmentedColormap.from_list("mx", [ROJO, ORO, VERDE], N=256)
    im = ax1.imshow(pivot_data, cmap=cmap, vmin=0, vmax=1, aspect='auto')

    ax1.set_xticks([0, 1, 2])
    ax1.set_yticks([0, 1, 2])
    rivales = [f["rival"] for f in FIXTURES_MEXICO]
    ax1.set_xticklabels([f"J2 vs {rivales[1]}\n{r}" for r in ["Gana", "Empata", "Pierde"]],
                        color=TEXT_CLR, fontsize=9)
    ax1.set_yticklabels([f"J1 vs {rivales[0]}\n{r}" for r in ["Gana", "Empata", "Pierde"]],
                        color=TEXT_CLR, fontsize=9)
    ax1.set_title("P(clasificar) segun primeros 2 partidos", color=TEXT_CLR, fontweight='bold')

    for i in range(3):
        for j in range(3):
            val = pivot_data[i, j]
            color_t = 'white' if val < 0.6 else BG_DARK
            ax1.text(j, i, f'{val*100:.0f}%', ha='center', va='center',
                     color=color_t, fontsize=14, fontweight='bold')

    cbar = plt.colorbar(im, ax=ax1, fraction=0.03, pad=0.04)
    cbar.set_label("P(clasificar)", color=TEXT_CLR, fontsize=9)
    plt.setp(cbar.ax.yaxis.get_ticklabels(), color=TEXT_CLR)

    for spine in ax1.spines.values():
        spine.set_edgecolor('#30363d')

    # --- der: distribucion de puntos con colores ---
    ax2 = axes[1]
    ax2.set_facecolor(BG_PANEL)

    pts_dist = df.groupby("pts").agg(
        prob_acum=("p_escenario", "sum"),
        prob_clasif=("p_clasif", "first"),
    ).reset_index()

    colores_pts = [VERDE if p >= 0.9 else (ORO if p >= 0.4 else ROJO) for p in pts_dist["prob_clasif"]]
    bars = ax2.bar(pts_dist["pts"], pts_dist["prob_acum"] * 100,
                   color=colores_pts, edgecolor=BG_DARK, linewidth=1.2, width=0.7)

    for bar, row in zip(bars, pts_dist.itertuples()):
        ax2.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.3,
                 f"P(cl)={row.prob_clasif*100:.0f}%", ha='center', va='bottom',
                 color=TEXT_CLR, fontsize=8)

    ax2.set_xlabel("Puntos obtenidos en grupos", color=TEXT_CLR)
    ax2.set_ylabel("Probabilidad de esa cantidad de puntos (%)", color=TEXT_CLR)
    ax2.set_title("Distribucion de puntos esperados\n(y su asociacion con clasificar)", color=TEXT_CLR, fontweight='bold')
    ax2.set_xticks(range(0, 10))
    ax2.tick_params(colors=TEXT_CLR)
    for spine in ax2.spines.values():
        spine.set_edgecolor('#30363d')
    ax2.grid(axis='y', alpha=0.3, color=TEXT_CLR)

    leyenda = [
        mpatches.Patch(color=VERDE, label="Alta seguridad (>= 90%)"),
        mpatches.Patch(color=ORO,   label="Con incertidumbre (40-89%)"),
        mpatches.Patch(color=ROJO,  label="En peligro (< 40%)"),
    ]
    ax2.legend(handles=leyenda, facecolor=BG_PANEL, edgecolor='#30363d', labelcolor=TEXT_CLR)

    plt.suptitle("Mexico 2026 — Escenarios de Clasificacion", color=TEXT_CLR,
                 fontsize=14, fontweight='bold')
    plt.tight_layout()
    guardar_figura(fig, "04_escenarios_clasificacion.png")
    plt.close()


if __name__ == "__main__":
    main()
