"""
La Ruta del Quinto Partido
--------------------------
Mexico nunca ha superado los octavos de final en la era moderna (1994-2018).
En el formato 2026 con R32, el primer juego eliminatorio es el cuarto partido,
y el "quinto partido" historicamente maldito es ahora el juego de R16 (partido #5).

Simulacion Monte Carlo de 100,000 escenarios completos del torneo.
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from collections import Counter

from data.grupo_2026 import TODOS_LOS_GRUPOS, FIXTURES_MEXICO
from utils import prob_resultado, simular_marcador, clasificar_resultado, setup_estilo, guardar_figura
from utils import VERDE, ROJO, ORO, BG_DARK, BG_PANEL, TEXT_CLR, GRIS

N_SIMS = 100_000
np.random.seed(42)

setup_estilo()


def simular_grupo(equipos_ranks, rank_mexico=15, ventaja_local=True):
    """
    Simula los 6 partidos del Grupo A.
    Devuelve posicion final de Mexico (1, 2, 3 o 4).
    """
    equipos = list(equipos_ranks.keys())
    n = len(equipos)
    pts = {e: 0 for e in equipos}
    gd  = {e: 0 for e in equipos}
    gf  = {e: 0 for e in equipos}

    # fixtures del grupo A: 6 partidos
    partidos = [(equipos[i], equipos[j]) for i in range(n) for j in range(i+1, n)]

    for a, b in partidos:
        rank_a = equipos_ranks[a]
        rank_b = equipos_ranks[b]
        # Mexico juega en casa en el Azteca (vs Sudáfrica y Chequia), Guadalajara vs Corea
        local = ventaja_local and a == "México"
        altitud = 30 if local else 0  # bonus altitud Azteca

        ga_goals, gb_goals = simular_marcador(rank_a, rank_b, ventaja_local=local, altitud_bonus=altitud)
        ga_goals, gb_goals = int(ga_goals[0]), int(gb_goals[0])

        gf[a] += ga_goals; gf[b] += gb_goals
        gd[a] += ga_goals - gb_goals; gd[b] += gb_goals - ga_goals

        if ga_goals > gb_goals:
            pts[a] += 3
        elif ga_goals == gb_goals:
            pts[a] += 1; pts[b] += 1
        else:
            pts[b] += 3

    tabla = sorted(equipos, key=lambda e: (pts[e], gd[e], gf[e]), reverse=True)
    pos = tabla.index("México") + 1
    return pos, pts["México"], gd["México"]


def prob_avance_tercero(pts_mexico):
    # historico de terceros lugares: con 4+ pts casi siempre avanza de los 8 mejores
    # con 3 pts: ~50%, con 4: ~70%, con 5: ~90%, con 6: ~99%
    curva = {0: 0.01, 1: 0.02, 2: 0.05, 3: 0.48, 4: 0.70, 5: 0.90, 6: 0.99}
    return curva.get(min(pts_mexico, 6), 0.99)


def rank_oponente_por_ronda(ronda, pos_grupo):
    """Rank promedio del rival de Mexico segun la ronda y posicion en el grupo."""
    tabla = {
        "R32":   {1: 14, 2: 22, 3: 8},   # 1ro vs 2do grupo B; 2do vs 1ro grupo B; 3ro vs lider otro grupo
        "R16":   {1: 20, 2: 14, 3: 10},
        "QF":    {1: 8,  2: 7,  3: 6},
        "SF":    {1: 4,  2: 4,  3: 3},
        "Final": {1: 2,  2: 2,  3: 2},
    }
    return tabla.get(ronda, {}).get(pos_grupo, 10)


def simular_torneo_mexico():
    grupo_a = {"México": 15, "Corea del Sur": 25, "Chequia": 41, "Sudáfrica": 60}
    pos, pts, gd_val = simular_grupo(grupo_a)

    # determinar si Mexico avanza
    if pos <= 2:
        avanza = True
    else:  # 3er lugar
        p3 = prob_avance_tercero(pts)
        avanza = np.random.rand() < p3

    if not avanza:
        return "Grupos"

    rondas = ["R32", "R16", "QF", "SF", "Final"]
    nombres = {"R32": "R32 (J4)", "R16": "R16 (J5)", "QF": "Cuartos (J6)", "SF": "Semi (J7)", "Final": "Final (J8)"}

    for ronda in rondas:
        rank_rival = rank_oponente_por_ronda(ronda, pos)
        # ventaja local en R32 y R16 si siguen en Mexico
        local = ronda in ("R32", "R16")
        pw, pe, pl = prob_resultado(15, rank_rival, ventaja_local=local, altitud_bonus=20 if local else 0)
        r = np.random.rand()
        if r < pw:
            continue
        elif r < pw + pe:
            # empate -> penales: Mexico gana 40% de las veces en penales
            if np.random.rand() < 0.40:
                continue
            else:
                return ronda
        else:
            return ronda

    return "Campeon"


def correr_simulacion():
    resultados = []
    for _ in range(N_SIMS):
        resultados.append(simular_torneo_mexico())
    return Counter(resultados)


def main():
    print(f"Ejecutando {N_SIMS:,} simulaciones...")
    conteo = correr_simulacion()

    orden = ["Grupos", "R32", "R16", "QF", "SF", "Final", "Campeon"]
    etiquetas = {
        "Grupos":  "Fase de\nGrupos",
        "R32":     "R32\n(Juego 4)",
        "R16":     "R16\n(Juego 5)\n← maldición",
        "QF":      "Cuartos\n(Juego 6)",
        "SF":      "Semi\n(Juego 7)",
        "Final":   "Final\n(Juego 8)",
        "Campeon": "Campeon",
    }

    # probabilidad de LLEGAR a cada etapa (acumulado desde arriba)
    total = N_SIMS
    prob_llegar = {}
    acum = total
    for etapa in orden:
        acum -= conteo.get(etapa, 0)
        prob_llegar[etapa] = (acum + conteo.get(etapa, 0)) / total if etapa == orden[0] else acum / total

    # arreglar logica: prob_llegar[etapa] = sims que llegaron a ESA etapa / total
    prob_real = {}
    sobreviven = total
    for etapa in orden:
        prob_real[etapa] = sobreviven / total
        sobreviven -= conteo.get(etapa, 0)

    print("\n--- Resultados ---")
    for etapa in orden:
        eliminados = conteo.get(etapa, 0)
        print(f"  {etiquetas[etapa].replace(chr(10), ' ')}: llega {prob_real[etapa]*100:.1f}%  |  eliminados aqui {eliminados/total*100:.1f}%")

    # ---- FIGURA ----
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
    fig.patch.set_facecolor(BG_DARK)
    for ax in (ax1, ax2):
        ax.set_facecolor(BG_PANEL)

    # grafica 1: probabilidad de llegar a cada etapa (escalera)
    probs = [prob_real[e] * 100 for e in orden]
    colores = []
    for i, e in enumerate(orden):
        if i == 0:
            colores.append(ROJO)
        elif e in ("R16", "QF"):
            colores.append(ORO)
        elif e in ("SF", "Final", "Campeon"):
            colores.append(VERDE)
        else:
            colores.append(GRIS)

    bars = ax1.barh([etiquetas[e] for e in orden], probs, color=colores, edgecolor='none', height=0.65)
    ax1.set_xlabel("% de 100,000 simulaciones", color=TEXT_CLR)
    ax1.set_title("Probabilidad de alcanzar cada ronda", color=TEXT_CLR, fontweight='bold')
    ax1.set_xlim(0, 105)
    ax1.invert_yaxis()
    ax1.grid(axis='x', alpha=0.3, color=TEXT_CLR)
    ax1.tick_params(colors=TEXT_CLR)
    for spine in ax1.spines.values():
        spine.set_edgecolor('#30363d')

    for bar, prob in zip(bars, probs):
        ax1.text(bar.get_width() + 1, bar.get_y() + bar.get_height()/2,
                 f'{prob:.1f}%', va='center', color=TEXT_CLR, fontsize=9, fontweight='bold')

    # linea vertical marcando donde historicamente cae Mexico (R16 en el nuevo formato)
    ax1.axvline(x=0, color=ROJO, linestyle='--', alpha=0.3, linewidth=1)

    # grafica 2: distribucion de donde queda Mexico (pie/donut)
    elim_por_ronda = {e: conteo.get(e, 0) / total * 100 for e in orden}
    sizes = [elim_por_ronda[e] for e in orden if elim_por_ronda[e] > 0]
    lbls = [etiquetas[e].replace('\n', ' ') for e in orden if elim_por_ronda[e] > 0]
    cols_pie = [colores[orden.index(e)] for e in orden if elim_por_ronda[e] > 0]

    wedges, texts, autotexts = ax2.pie(
        sizes, labels=lbls, colors=cols_pie,
        autopct=lambda p: f'{p:.1f}%' if p > 2 else '',
        startangle=90, pctdistance=0.75,
        wedgeprops=dict(edgecolor=BG_DARK, linewidth=1.5)
    )
    for t in texts + autotexts:
        t.set_color(TEXT_CLR)
        t.set_fontsize(8)

    ax2.set_title("Distribucion de eliminaciones", color=TEXT_CLR, fontweight='bold')
    ax2.set_facecolor(BG_PANEL)

    # anotacion maldicion
    ax1.annotate(
        "Maldicion del\nquinto partido\n(0/7 en R16 historico)",
        xy=(prob_real["R16"] * 100, list(etiquetas.keys()).index("R16") - 0.3),
        xytext=(prob_real["R16"] * 100 + 5, list(etiquetas.keys()).index("R16") + 1.2),
        color=ORO, fontsize=8, alpha=0.8,
        arrowprops=dict(arrowstyle='->', color=ORO, alpha=0.6)
    )

    plt.suptitle("Mexico 2026 — La Ruta del Quinto Partido", color=TEXT_CLR,
                 fontsize=15, fontweight='bold', y=1.01)
    plt.tight_layout()
    guardar_figura(fig, "01_ruta_quinto_partido.png")
    plt.close()


if __name__ == "__main__":
    main()
