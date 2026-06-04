"""
Mexico contra su Historia
--------------------------
Compara el contexto de Mexico 2026 contra cada edicion del mundial en que participo.
Metricas: ronda alcanzada, rendimiento (puntos/partido), razon GF/GA,
ranking de rivales en grupos y condicion de sede.

La pregunta clave: es 2026 la mejor oportunidad historica de Mexico?
"""

import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.lines import Line2D

from data.historico import get_df, FORMA_RECIENTE
from utils import setup_estilo, guardar_figura
from utils import VERDE, ROJO, ORO, AZUL, BG_DARK, BG_PANEL, TEXT_CLR, GRIS

setup_estilo()


def enriquecer(df):
    d = df.copy()
    d["ratio_goles"] = d["gf"] / d["ga"].replace(0, 0.5)
    d["goles_por_partido"] = d["gf"] / d["partidos"]
    d["ga_por_partido"] = d["ga"] / d["partidos"]
    # nivel del grupo (estimado por ranking promedio de rivales)
    ranking_grupo = {
        1930: 25, 1950: 20, 1954: 22, 1958: 18, 1962: 15, 1966: 12,
        1970: 30,  # como sede pero rivales del grupo no tan fuertes
        1978: 18,
        1986: 28,  # como sede, rivales del grupo asequibles
        1994: 35,  # grupo con Italia, Noruega, Irlanda → muy difícil
        1998: 28, 2002: 30, 2006: 32, 2010: 30, 2014: 28, 2018: 25,
        2022: 5,   # grupo con Argentina → durísimo
        2026: 42,  # Corea 25, Chequia 41, Sudáfrica 60 → más accesible
    }
    d["rank_promedio_rivales"] = d["año"].map(ranking_grupo)
    return d


def main():
    df = get_df()
    df = enriquecer(df)

    # proyeccion 2026 (estimada)
    proj_2026 = {
        "año": 2026, "sede": "México/EUA/Canadá", "ronda": "R16+",
        "ronda_num": 3.5,  # projection: llegamos entre R16 y QF
        "w": 2.1, "d": 0.7, "l": 0.2, "gf": 5.5, "ga": 2.2,
        "host": True, "penales": False, "eliminado_por": "?",
        "pts": 7.0, "partidos": 3.0, "rendimiento": 0.74,
        "gd": 3.3, "ratio_goles": 2.5, "goles_por_partido": 1.8,
        "ga_por_partido": 0.73, "rank_promedio_rivales": 42,
    }

    print("Comparacion historica de Mexico en mundiales:")
    print(df[["año", "ronda", "w", "d", "l", "gf", "ga", "rendimiento", "host"]].to_string(index=False))

    # ---- FIGURA ----
    fig, axes = plt.subplots(2, 2, figsize=(14, 10))
    fig.patch.set_facecolor(BG_DARK)
    for ax in axes.flat:
        ax.set_facecolor(BG_PANEL)

    años = df["año"].tolist()
    x = np.arange(len(años))

    # colores: verde si fue sede, dorado si es era moderna, gris el resto
    def color_año(row):
        if row["host"]:
            return ORO
        elif row["año"] >= 1994:
            return VERDE
        return GRIS

    colores = [color_año(df.iloc[i]) for i in range(len(df))]

    # --- graf 1: ronda alcanzada ---
    ax = axes[0, 0]
    ronda_labels = {1: "Grupos", 2: "R16", 3: "R16", 4: "Cuartos", 5: "Semi", 6: "Final", 7: "Campeon"}
    bars = ax.bar(x, df["ronda_num"], color=colores, edgecolor=BG_DARK, linewidth=0.8, width=0.7)
    ax.axhline(y=3, color=ROJO, linestyle='--', alpha=0.5, linewidth=1.5, label="Octavos (techo historico)")
    ax.axhline(y=proj_2026["ronda_num"], color=AZUL, linestyle='--', alpha=0.7, linewidth=1.5, label="Proyeccion 2026")
    ax.set_xticks(x)
    ax.set_xticklabels(años, rotation=45, color=TEXT_CLR, fontsize=8)
    ax.set_yticks([1, 2, 3, 4, 5])
    ax.set_yticklabels(["Grupos", "Seg.R.", "Octavos", "Cuartos", "Semi"], color=TEXT_CLR, fontsize=8)
    ax.set_title("Ronda alcanzada por edicion", color=TEXT_CLR, fontweight='bold')
    ax.legend(facecolor=BG_PANEL, edgecolor='#30363d', labelcolor=TEXT_CLR, fontsize=8)
    ax.tick_params(colors=TEXT_CLR)
    for spine in ax.spines.values(): spine.set_edgecolor('#30363d')

    # --- graf 2: rendimiento (pts/partido normalizado) ---
    ax = axes[0, 1]
    ax.bar(x, df["rendimiento"] * 100, color=colores, edgecolor=BG_DARK, linewidth=0.8, width=0.7)
    ax.axhline(y=proj_2026["rendimiento"] * 100, color=AZUL, linestyle='--', alpha=0.7, linewidth=1.5, label="Proyeccion 2026")
    ax.axhline(y=df["rendimiento"].mean() * 100, color=GRIS, linestyle=':', alpha=0.5, linewidth=1, label="Promedio historico")
    ax.set_xticks(x)
    ax.set_xticklabels(años, rotation=45, color=TEXT_CLR, fontsize=8)
    ax.set_ylabel("% de puntos posibles", color=TEXT_CLR)
    ax.set_title("Rendimiento general (pts obtenidos / pts posibles)", color=TEXT_CLR, fontweight='bold')
    ax.legend(facecolor=BG_PANEL, edgecolor='#30363d', labelcolor=TEXT_CLR, fontsize=8)
    ax.tick_params(colors=TEXT_CLR)
    for spine in ax.spines.values(): spine.set_edgecolor('#30363d')

    # --- graf 3: GF y GA por partido ---
    ax = axes[1, 0]
    ax.plot(años, df["goles_por_partido"], marker='o', color=VERDE, linewidth=2, label="GF/partido", markersize=6)
    ax.plot(años, df["ga_por_partido"],   marker='s', color=ROJO,  linewidth=2, label="GA/partido", markersize=6)
    ax.axvline(x=1993, color=GRIS, linestyle='--', alpha=0.4, linewidth=1)
    ax.text(1993.5, ax.get_ylim()[1] * 0.9 if ax.get_ylim()[1] > 0 else 2.5,
            "Era\nmoderna", color=GRIS, fontsize=7, alpha=0.7)
    ax.set_xlabel("Mundial", color=TEXT_CLR)
    ax.set_ylabel("Goles por partido", color=TEXT_CLR)
    ax.set_title("Goles marcados y recibidos por partido", color=TEXT_CLR, fontweight='bold')
    ax.legend(facecolor=BG_PANEL, edgecolor='#30363d', labelcolor=TEXT_CLR)
    ax.tick_params(colors=TEXT_CLR)
    for spine in ax.spines.values(): spine.set_edgecolor('#30363d')

    # agregar proyeccion 2026
    ax.plot([2022, 2026], [df[df.año==2022]["goles_por_partido"].values[0], proj_2026["goles_por_partido"]],
            marker='D', color=AZUL, linewidth=1.5, linestyle='--', markersize=5, label="Proyeccion 2026")

    # --- graf 4: dificultad del grupo (rank promedio de rivales) ---
    ax = axes[1, 1]
    ax.scatter(df["rank_promedio_rivales"], df["ronda_num"],
               c=colores, s=80, zorder=3, edgecolors=BG_DARK, linewidth=0.8)
    ax.scatter([proj_2026["rank_promedio_rivales"]], [proj_2026["ronda_num"]],
               c=AZUL, s=150, zorder=4, marker='*', label="2026 (proyeccion)")

    for _, row in df.iterrows():
        ax.annotate(str(row["año"]), (row["rank_promedio_rivales"], row["ronda_num"]),
                    fontsize=7, color=GRIS, xytext=(3, 3), textcoords='offset points')

    ax.set_xlabel("Rank promedio de rivales en grupos (mayor = mas debiles)", color=TEXT_CLR)
    ax.set_ylabel("Ronda alcanzada", color=TEXT_CLR)
    ax.set_yticks([1, 2, 3, 4])
    ax.set_yticklabels(["Grupos", "Seg.R.", "Octavos", "Cuartos"], color=TEXT_CLR, fontsize=8)
    ax.set_title("Dificultad del grupo vs ronda alcanzada\n(patron historico)", color=TEXT_CLR, fontweight='bold')
    ax.legend(facecolor=BG_PANEL, edgecolor='#30363d', labelcolor=TEXT_CLR, fontsize=9)
    ax.tick_params(colors=TEXT_CLR)
    for spine in ax.spines.values(): spine.set_edgecolor('#30363d')

    leyenda = [
        mpatches.Patch(color=ORO,  label="Como sede"),
        mpatches.Patch(color=VERDE, label="Era moderna (1994+)"),
        mpatches.Patch(color=GRIS,  label="Era clasica"),
    ]
    axes[0, 0].legend(handles=leyenda + [
        Line2D([0], [0], color=ROJO, linestyle='--', label="Techo historico"),
    ], facecolor=BG_PANEL, edgecolor='#30363d', labelcolor=TEXT_CLR, fontsize=7)

    plt.suptitle("Mexico contra su Historia — ¿Es 2026 la mejor oportunidad?", color=TEXT_CLR,
                 fontsize=14, fontweight='bold')
    plt.tight_layout()
    guardar_figura(fig, "07_mexico_vs_historia.png")
    plt.close()


if __name__ == "__main__":
    main()
