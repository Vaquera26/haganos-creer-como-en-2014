"""
Ranking de Rivales Mas Peligrosos
-----------------------------------
Analiza todos los posibles rivales de Mexico en las rondas eliminatorias.
Para cada rival potencial: calcula P(Mexico gana), nivel de dificultad,
y cuando es mas probable que aparezca en el bracket.

Incluye dos escenarios: Mexico termina 1ro o 2do del grupo.
"""

import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import matplotlib.cm as cm

from data.rankings import EQUIPOS
from data.grupo_2026 import TODOS_LOS_GRUPOS, R32_CANDIDATOS
from utils import prob_resultado, elo_desde_ranking, setup_estilo, guardar_figura
from utils import VERDE, ROJO, ORO, AZUL, BG_DARK, BG_PANEL, TEXT_CLR, GRIS

setup_estilo()

RANK_MEXICO = 15

# todos los posibles rivales en rondas eliminatorias (excluye Grupo A)
RIVALES_POSIBLES = {equipo: datos for equipo, datos in EQUIPOS.items() if equipo != "México"}

# probabilidad de que Mexico enfrente a cada rival segun bracket
# (estimacion basada en la estructura del sorteo 2026)
PROB_BRACKET = {
    # R32 (si Mexico 1ro): Group B runner-up
    "Canadá":             {"ronda_mas_probable": "R32",  "prob_enfrentarse": 0.22},
    "Suiza":              {"ronda_mas_probable": "R32",  "prob_enfrentarse": 0.22},
    "Bosnia-Herzegovina": {"ronda_mas_probable": "R32",  "prob_enfrentarse": 0.06},
    "Qatar":              {"ronda_mas_probable": "R32",  "prob_enfrentarse": 0.04},
    # R16 (grupos adyacentes a A/B en el bracket)
    "Brasil":             {"ronda_mas_probable": "R16",  "prob_enfrentarse": 0.18},
    "Marruecos":          {"ronda_mas_probable": "R16",  "prob_enfrentarse": 0.12},
    "Escocia":            {"ronda_mas_probable": "R16",  "prob_enfrentarse": 0.04},
    "Haití":              {"ronda_mas_probable": "R16",  "prob_enfrentarse": 0.01},
    "EUA":                {"ronda_mas_probable": "R16",  "prob_enfrentarse": 0.14},
    "Turquía":            {"ronda_mas_probable": "R16",  "prob_enfrentarse": 0.05},
    "Paraguay":           {"ronda_mas_probable": "R16",  "prob_enfrentarse": 0.03},
    "Australia":          {"ronda_mas_probable": "R16",  "prob_enfrentarse": 0.03},
    # QF y mas
    "Argentina":          {"ronda_mas_probable": "QF",   "prob_enfrentarse": 0.10},
    "Francia":            {"ronda_mas_probable": "QF",   "prob_enfrentarse": 0.08},
    "España":             {"ronda_mas_probable": "SF",   "prob_enfrentarse": 0.07},
    "Alemania":           {"ronda_mas_probable": "QF",   "prob_enfrentarse": 0.09},
    "Países Bajos":       {"ronda_mas_probable": "QF",   "prob_enfrentarse": 0.06},
    "Bélgica":            {"ronda_mas_probable": "QF",   "prob_enfrentarse": 0.05},
    "Portugal":           {"ronda_mas_probable": "SF",   "prob_enfrentarse": 0.05},
    "Inglaterra":         {"ronda_mas_probable": "SF",   "prob_enfrentarse": 0.05},
    "Uruguay":            {"ronda_mas_probable": "QF",   "prob_enfrentarse": 0.04},
    "Colombia":           {"ronda_mas_probable": "QF",   "prob_enfrentarse": 0.04},
    "Croacia":            {"ronda_mas_probable": "R16",  "prob_enfrentarse": 0.03},
    "Japón":              {"ronda_mas_probable": "R16",  "prob_enfrentarse": 0.03},
    "Senegal":            {"ronda_mas_probable": "R16",  "prob_enfrentarse": 0.04},
    "Ecuador":            {"ronda_mas_probable": "R16",  "prob_enfrentarse": 0.03},
}


def calcular_datos_rival(rival, rank_rival, ronda):
    local = ronda in ("R32", "R16")
    alt = 20 if local else 0
    pw, pe, pl = prob_resultado(RANK_MEXICO, rank_rival, ventaja_local=local, altitud_bonus=alt)
    dificultad = 1.0 - pw
    return pw, pe, pl, dificultad


def main():
    filas = []
    for rival, meta in PROB_BRACKET.items():
        rank_r = EQUIPOS.get(rival, {}).get("rank", 50)
        ronda = meta["ronda_mas_probable"]
        prob_enc = meta["prob_enfrentarse"]

        pw, pe, pl, dif = calcular_datos_rival(rival, rank_r, ronda)
        filas.append({
            "rival": rival,
            "rank":  rank_r,
            "ronda": ronda,
            "p_encontrarse": prob_enc,
            "p_mx_gana": pw,
            "p_empate":  pe,
            "p_mx_pierde": pl,
            "dificultad": dif,
        })

    df = pd.DataFrame(filas).sort_values("p_mx_gana", ascending=False)

    print("\nRanking de rivales por probabilidad Mexico de ganar:")
    print(f"{'Rival':20s}  {'Rank':5s}  {'Ronda esperada':14s}  {'P(Mx gana)':11s}  {'Dificultad':10s}")
    for _, row in df.iterrows():
        barra = "█" * int(row["p_mx_gana"] * 20)
        print(f"  {row['rival']:20s}  {row['rank']:5.0f}  {row['ronda']:14s}  "
              f"{row['p_mx_gana']*100:9.1f}%  {row['dificultad']*100:9.1f}%  {barra}")

    # ---- FIGURA ----
    fig, axes = plt.subplots(1, 2, figsize=(16, 9), gridspec_kw={'width_ratios': [2, 1]})
    fig.patch.set_facecolor(BG_DARK)
    for ax in axes:
        ax.set_facecolor(BG_PANEL)

    # --- izq: barras horizontales P(Mexico gana) ---
    ax1 = axes[0]
    df_sorted = df.sort_values("p_mx_gana")

    colores = []
    for _, row in df_sorted.iterrows():
        if row["p_mx_gana"] >= 0.65:
            colores.append(VERDE)
        elif row["p_mx_gana"] >= 0.45:
            colores.append(ORO)
        elif row["p_mx_gana"] >= 0.30:
            colores.append('#f97316')
        else:
            colores.append(ROJO)

    tamaño_label = {
        "R32": 9, "R16": 9, "QF": 8, "SF": 8, "Final": 8,
    }
    marcadores_ronda = {"R32": "●", "R16": "◆", "QF": "▲", "SF": "★", "Final": "♦"}

    y_pos = range(len(df_sorted))
    etiquetas = [f"{marcadores_ronda.get(row['ronda'], '')} {row['rival']} (Rk{int(row['rank'])})"
                 for _, row in df_sorted.iterrows()]

    bars = ax1.barh(list(y_pos), df_sorted["p_mx_gana"] * 100, color=colores,
                    edgecolor=BG_DARK, linewidth=0.5, height=0.7)
    ax1.set_yticks(list(y_pos))
    ax1.set_yticklabels(etiquetas, color=TEXT_CLR, fontsize=8.5)
    ax1.set_xlabel("P(Mexico gana el partido) %", color=TEXT_CLR)
    ax1.set_title("Rivales potenciales: probabilidad de Mexico de ganar\n(ajustado por ronda y ventaja local)",
                  color=TEXT_CLR, fontweight='bold')
    ax1.set_xlim(0, 100)
    ax1.axvline(x=50, color=GRIS, linestyle='--', alpha=0.4, linewidth=1)
    ax1.tick_params(colors=TEXT_CLR)
    for spine in ax1.spines.values(): spine.set_edgecolor('#30363d')
    ax1.grid(axis='x', alpha=0.3, color=TEXT_CLR)

    for bar, val in zip(bars, df_sorted["p_mx_gana"]):
        if val * 100 > 5:
            ax1.text(bar.get_width() + 0.5, bar.get_y() + bar.get_height()/2,
                     f'{val*100:.0f}%', va='center', color=TEXT_CLR, fontsize=8, fontweight='bold')

    leyenda = [
        mpatches.Patch(color=VERDE,   label=">= 65% (favorable)"),
        mpatches.Patch(color=ORO,     label="45-64% (equilibrado)"),
        mpatches.Patch(color='#f97316', label="30-44% (dificil)"),
        mpatches.Patch(color=ROJO,    label="< 30% (muy dificil)"),
    ]
    ax1.legend(handles=leyenda, facecolor=BG_PANEL, edgecolor='#30363d', labelcolor=TEXT_CLR, fontsize=8)

    # leyenda rondas
    for sym, ronda in marcadores_ronda.items():
        pass  # incluido en etiquetas

    # --- der: scatter P(ganar) vs P(encontrarse) ---
    ax2 = axes[1]
    ax2.set_facecolor(BG_PANEL)

    scatter_col = []
    for _, row in df.iterrows():
        if row["p_mx_gana"] >= 0.65:   scatter_col.append(VERDE)
        elif row["p_mx_gana"] >= 0.45:  scatter_col.append(ORO)
        elif row["p_mx_gana"] >= 0.30:  scatter_col.append('#f97316')
        else:                            scatter_col.append(ROJO)

    sc = ax2.scatter(df["p_mx_gana"] * 100, df["p_encontrarse"] * 100,
                     c=scatter_col, s=80, zorder=3, edgecolors=BG_DARK, linewidth=0.8)

    for _, row in df.iterrows():
        if row["p_encontrarse"] > 0.04 or row["p_mx_gana"] < 0.40:
            ax2.annotate(row["rival"].split()[0], (row["p_mx_gana"]*100, row["p_encontrarse"]*100),
                         fontsize=6.5, color=GRIS, xytext=(3, 3), textcoords='offset points')

    ax2.set_xlabel("P(Mexico gana) %", color=TEXT_CLR)
    ax2.set_ylabel("P(ese rival aparezca en el bracket) %", color=TEXT_CLR)
    ax2.set_title("Rivales peligrosos vs probables\n(esquina inferior derecha = pesadilla)",
                  color=TEXT_CLR, fontweight='bold')
    ax2.axhline(y=10, color=GRIS, linestyle=':', alpha=0.3, linewidth=1)
    ax2.axvline(x=50, color=GRIS, linestyle=':', alpha=0.3, linewidth=1)
    ax2.tick_params(colors=TEXT_CLR)
    for spine in ax2.spines.values(): spine.set_edgecolor('#30363d')

    # cuadrantes
    ax2.text(15, ax2.get_ylim()[1] * 0.9 if ax2.get_ylim()[1] > 0 else 22,
             "Peligroso\ny probable", color=ROJO, fontsize=8, alpha=0.6, style='italic')
    ax2.text(70, ax2.get_ylim()[1] * 0.9 if ax2.get_ylim()[1] > 0 else 22,
             "Probable y\nmanejable", color=VERDE, fontsize=8, alpha=0.6, style='italic')

    plt.suptitle("Mexico 2026 — Ranking de Rivales Potenciales", color=TEXT_CLR,
                 fontsize=14, fontweight='bold')
    plt.tight_layout()
    guardar_figura(fig, "13_ranking_rivales.png")
    plt.close()


if __name__ == "__main__":
    main()
