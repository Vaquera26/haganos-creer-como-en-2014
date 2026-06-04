"""
Simulacion del Mundial 2026 Completo
--------------------------------------
Simula todos los 12 grupos + ronda eliminatoria completa (R32 → Final).
Corre N simulaciones y muestra:
  - Brackets posibles mas frecuentes
  - Probabilidad de cada equipo de ganar el torneo
  - Camino mas probable de Mexico partido por partido
  - Visualizacion del bracket "media simulacion"
"""

import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from collections import Counter, defaultdict

from data.grupo_2026 import TODOS_LOS_GRUPOS
from utils import simular_marcador, prob_resultado, elo_desde_ranking
from utils import setup_estilo, guardar_figura
from utils import VERDE, ROJO, ORO, AZUL, BG_DARK, BG_PANEL, TEXT_CLR, GRIS

setup_estilo()
np.random.seed(2026)

N_SIMS = 10_000

# llave R32 basada en el sorteo diciembre 2025
# formato: (ganador grupo X, segundo grupo Y) comparten mitad de bracket
BRACKET_R32 = [
    # mitad izquierda
    ("1A", "2B"), ("1B", "2A"),
    ("1C", "2D"), ("1D", "2C"),
    ("1E", "2F"), ("1F", "2E"),
    ("1G", "2H"), ("1H", "2G"),
    # mitad derecha
    ("1I", "2J"), ("1J", "2I"),
    ("1K", "2L"), ("1L", "2K"),
    # 8 terceros distribuidos en slots predeterminados (simplificado)
    ("T1", "T2"), ("T3", "T4"),
    ("T5", "T6"), ("T7", "T8"),
]

# los terceros de cada grupo ocupan slots fijos segun reglas FIFA 2026
# simplificacion: los 8 mejores terceros se distribuyen en la llave de forma predefinida
SLOTS_TERCEROS = {
    0: ("A", "B"),   # slot T1-T2 viene de grupos A y B
    1: ("C", "D"),
    2: ("E", "F"),
    3: ("G", "H"),
    4: ("I", "J"),
    5: ("K", "L"),
}


def simular_grupo(grupo_label, equipos_ranks):
    equipos = list(equipos_ranks.keys())
    pts = {e: 0 for e in equipos}
    gd  = {e: 0 for e in equipos}
    gf_total = {e: 0 for e in equipos}

    partidos = [(equipos[i], equipos[j]) for i in range(len(equipos)) for j in range(i+1, len(equipos))]

    for a, b in partidos:
        local_a = (grupo_label == "A" and a == "México")
        alt = 25 if local_a else 0
        ga, gb = simular_marcador(equipos_ranks[a], equipos_ranks[b],
                                  ventaja_local=local_a, altitud_bonus=alt)
        ga, gb = int(ga[0]), int(gb[0])
        gf_total[a] += ga; gf_total[b] += gb
        gd[a] += ga - gb; gd[b] += gb - ga
        if ga > gb:    pts[a] += 3
        elif ga == gb: pts[a] += 1; pts[b] += 1
        else:          pts[b] += 3

    tabla = sorted(equipos, key=lambda e: (pts[e], gd[e], gf_total[e]), reverse=True)
    return {
        "1ro": tabla[0], "2do": tabla[1], "3ro": tabla[2], "4to": tabla[3],
        "pts": pts, "gd": gd, "gf": gf_total,
    }


def simular_partido_eliminatorio(eq_a, eq_b, ranks, ronda="R32"):
    rank_a = ranks.get(eq_a, 50)
    rank_b = ranks.get(eq_b, 50)
    # ventaja local en R32 y R16 si alguno es Mexico (por estadios en Mexico)
    local_mx = eq_a == "México" and ronda in ("R32", "R16")
    alt = 20 if local_mx else 0
    pw, pe, pl = prob_resultado(rank_a, rank_b, ventaja_local=local_mx, altitud_bonus=alt)
    r = np.random.rand()
    if r < pw:
        return eq_a
    elif r < pw + pe:
        # empate → penales; México tiene historial 0/2 mundiales, 1/3 CONCACAF → ~30%
        if "México" in (eq_a, eq_b):
            p_mx = 0.30
            return "México" if np.random.rand() < p_mx else (eq_b if eq_a == "México" else eq_a)
        return eq_a if np.random.rand() < 0.50 else eq_b
    return eq_b


def simular_mundial():
    # paso 1: simular los 12 grupos
    resultados_grupos = {}
    ranks_global = {}

    for grupo_label, equipos_ranks in TODOS_LOS_GRUPOS.items():
        resultado = simular_grupo(grupo_label, equipos_ranks)
        resultados_grupos[grupo_label] = resultado
        for equipo, rank in equipos_ranks.items():
            ranks_global[equipo] = rank

    # paso 2: extraer clasificados
    clasificados = {}
    terceros = []

    for label, res in resultados_grupos.items():
        clasificados[f"1{label}"] = res["1ro"]
        clasificados[f"2{label}"] = res["2do"]
        tercero = res["3ro"]
        pts_3ro = res["pts"][tercero]
        gd_3ro  = res["gd"][tercero]
        gf_3ro  = res["gf"][tercero]
        terceros.append({
            "equipo": tercero, "grupo": label,
            "pts": pts_3ro, "gd": gd_3ro, "gf": gf_3ro
        })

    # paso 3: determinar los 8 mejores terceros
    terceros_sorted = sorted(terceros, key=lambda x: (x["pts"], x["gd"], x["gf"]), reverse=True)
    mejores_8 = terceros_sorted[:8]
    for i, t in enumerate(mejores_8):
        clasificados[f"T{i+1}"] = t["equipo"]
    # los otros 4 terceros no clasifican
    for i in range(8, 12):
        clasificados[f"T{i+1}"] = "eliminado"

    # paso 4: simular knockout R32 → R16 → QF → SF → Final
    rondas_resultado = {}

    def simular_ronda(partidos, nombre_ronda):
        ganadores = []
        for slot_a, slot_b in partidos:
            eq_a = clasificados.get(slot_a, slot_a)
            eq_b = clasificados.get(slot_b, slot_b)
            if eq_a == "eliminado":
                ganadores.append(eq_b); continue
            if eq_b == "eliminado":
                ganadores.append(eq_a); continue
            ganador = simular_partido_eliminatorio(eq_a, eq_b, ranks_global, nombre_ronda)
            ganadores.append(ganador)
        return ganadores

    # R32 (16 partidos → 16 ganadores)
    r32_ganadores = simular_ronda(BRACKET_R32, "R32")

    # R16 (8 partidos): los 16 ganadores del R32 se emparejan en el mismo orden del bracket
    r16_partidos = [(r32_ganadores[i], r32_ganadores[i+1]) for i in range(0, 16, 2)]
    r16_ganadores = []
    for a, b in r16_partidos:
        g = simular_partido_eliminatorio(a, b, ranks_global, "R16")
        r16_ganadores.append(g)

    # QF (4 partidos)
    qf_partidos = [(r16_ganadores[i], r16_ganadores[i+1]) for i in range(0, 8, 2)]
    qf_ganadores = []
    for a, b in qf_partidos:
        g = simular_partido_eliminatorio(a, b, ranks_global, "QF")
        qf_ganadores.append(g)

    # SF (2 partidos)
    sf_partidos = [(qf_ganadores[0], qf_ganadores[1]), (qf_ganadores[2], qf_ganadores[3])]
    sf_ganadores = []
    sf_perdedores = []
    for a, b in sf_partidos:
        g = simular_partido_eliminatorio(a, b, ranks_global, "SF")
        sf_ganadores.append(g)
        sf_perdedores.append(b if g == a else a)

    # Final
    campeon = simular_partido_eliminatorio(sf_ganadores[0], sf_ganadores[1], ranks_global, "Final")
    subcampeon = sf_ganadores[1] if campeon == sf_ganadores[0] else sf_ganadores[0]

    # determinar donde quedo Mexico
    def etapa_mexico():
        if "México" not in r32_ganadores:
            return "R32"
        if "México" not in r16_ganadores:
            return "R16"
        if "México" not in qf_ganadores:
            return "QF"
        if "México" not in sf_ganadores:
            return "SF"
        if campeon != "México":
            return "Final"
        return "Campeon"

    return {
        "campeon": campeon,
        "subcampeon": subcampeon,
        "sf_ganadores": sf_ganadores,
        "qf_ganadores": qf_ganadores,
        "r16_ganadores": r16_ganadores,
        "r32_ganadores": r32_ganadores,
        "etapa_mexico": etapa_mexico(),
    }


def main():
    print(f"Simulando {N_SIMS:,} mundiales completos...")

    campeones = Counter()
    subcampeones = Counter()
    etapa_mx = Counter()
    sf_apariciones = Counter()

    for _ in range(N_SIMS):
        res = simular_mundial()
        campeones[res["campeon"]] += 1
        subcampeones[res["subcampeon"]] += 1
        etapa_mx[res["etapa_mexico"]] += 1
        for eq in res["sf_ganadores"]:
            sf_apariciones[eq] += 1

    print("\n--- Top 15 candidatos a campeon ---")
    for equipo, cnt in campeones.most_common(15):
        pct = cnt / N_SIMS * 100
        barra = "█" * int(pct / 2)
        print(f"  {equipo:22s} {pct:5.1f}%  {barra}")

    print("\n--- Mexico en el Mundial 2026 ---")
    orden = ["R32", "R16", "QF", "SF", "Final", "Campeon"]
    for etapa in orden:
        pct = etapa_mx.get(etapa, 0) / N_SIMS * 100
        print(f"  Eliminado en {etapa:10s}: {pct:5.1f}%")

    # ---- FIGURA ----
    fig = plt.figure(figsize=(20, 12))
    fig.patch.set_facecolor(BG_DARK)

    # subplot izquierda: barras candidatos a campeon
    ax1 = fig.add_subplot(1, 3, (1, 2))
    ax1.set_facecolor(BG_PANEL)

    top_n = 20
    top_equipos = [e for e, _ in campeones.most_common(top_n)]
    top_probs   = [campeones[e] / N_SIMS * 100 for e in top_equipos]

    colores = []
    for eq in top_equipos:
        if eq == "México":
            colores.append(VERDE)
        elif eq in ("Argentina", "Francia", "España", "Brasil", "Inglaterra", "Portugal"):
            colores.append(ROJO)
        else:
            colores.append(AZUL)

    bars = ax1.barh(range(len(top_equipos)), top_probs[::-1],
                    color=colores[::-1], edgecolor=BG_DARK, linewidth=0.5, height=0.7)
    ax1.set_yticks(range(len(top_equipos)))
    ax1.set_yticklabels(top_equipos[::-1], color=TEXT_CLR, fontsize=10)
    ax1.set_xlabel("P(campeon del mundo) %", color=TEXT_CLR, fontsize=11)
    ax1.set_title(f"Probabilidad de ganar el Mundial 2026\n({N_SIMS:,} simulaciones completas del torneo)",
                  color=TEXT_CLR, fontweight='bold', fontsize=13)

    for bar, val in zip(bars, top_probs[::-1]):
        if val > 0.3:
            ax1.text(bar.get_width() + 0.1, bar.get_y() + bar.get_height()/2,
                     f'{val:.1f}%', va='center', color=TEXT_CLR, fontsize=9, fontweight='bold')

    ax1.axvline(x=2.08, color=GRIS, linestyle='--', alpha=0.3, linewidth=1)
    ax1.text(2.1, 0.5, "base\n(1/48)", color=GRIS, fontsize=7, alpha=0.6)
    ax1.tick_params(colors=TEXT_CLR)
    for spine in ax1.spines.values():
        spine.set_edgecolor('#30363d')
    ax1.grid(axis='x', alpha=0.3, color=TEXT_CLR)

    # marcar Mexico
    if "México" in top_equipos:
        idx_mx = len(top_equipos) - 1 - top_equipos.index("México")
        ax1.get_yticklabels()[idx_mx].set_color(VERDE)
        ax1.get_yticklabels()[idx_mx].set_fontweight('bold')

    # subplot derecha: camino de Mexico
    ax2 = fig.add_subplot(1, 3, 3)
    ax2.set_facecolor(BG_PANEL)

    etapas_orden = ["R32", "R16", "QF", "SF", "Final", "Campeon"]
    # prob de LLEGAR a cada etapa
    sobreviven = N_SIMS
    prob_llegar = {}
    for etapa in etapas_orden:
        prob_llegar[etapa] = sobreviven / N_SIMS * 100
        sobreviven -= etapa_mx.get(etapa, 0)

    probs_llegar = [prob_llegar[e] for e in etapas_orden]
    etiq = ["R32\n(J4)", "R16\n(J5)\n← maldición", "QF\n(J6)", "SF\n(J7)", "Final\n(J8)", "Campeon"]
    cols = [VERDE if p >= 30 else (ORO if p >= 10 else ROJO) for p in probs_llegar]

    bars2 = ax2.barh(range(len(etapas_orden)), probs_llegar,
                     color=cols, edgecolor=BG_DARK, linewidth=0.5, height=0.65)
    ax2.set_yticks(range(len(etapas_orden)))
    ax2.set_yticklabels(etiq, color=TEXT_CLR, fontsize=9)
    ax2.set_xlabel("P(llegar a esa ronda) %", color=TEXT_CLR)
    ax2.set_title("Camino de Mexico\nen la simulacion del torneo", color=TEXT_CLR, fontweight='bold')
    ax2.set_xlim(0, 105)
    ax2.tick_params(colors=TEXT_CLR)
    for spine in ax2.spines.values():
        spine.set_edgecolor('#30363d')
    ax2.grid(axis='x', alpha=0.3, color=TEXT_CLR)

    for bar, val in zip(bars2, probs_llegar):
        ax2.text(bar.get_width() + 0.5, bar.get_y() + bar.get_height()/2,
                 f'{val:.1f}%', va='center', color=TEXT_CLR, fontsize=9, fontweight='bold')

    p_mx_campeon = campeones.get("México", 0) / N_SIMS * 100
    ax2.text(0.97, 0.04, f"P(Mexico campeon):\n{p_mx_campeon:.2f}%",
             transform=ax2.transAxes, ha='right', va='bottom',
             color=ORO if p_mx_campeon > 1 else GRIS,
             fontsize=11, fontweight='bold',
             bbox=dict(boxstyle='round', facecolor=BG_DARK, edgecolor=ORO, alpha=0.8))

    plt.suptitle("Mexico 2026 — Simulacion del Mundial Completo (R32 a Final)",
                 color=TEXT_CLR, fontsize=15, fontweight='bold')
    plt.tight_layout()
    guardar_figura(fig, "14_simulacion_mundial_completo.png", dpi=150)
    plt.close()

    # ---- FIGURA 2: bracket visual de 1 simulacion representativa ----
    print("\nGenerando bracket visual...")
    res_ejemplo = simular_mundial()
    _dibujar_bracket(res_ejemplo)


def _dibujar_bracket(res):
    fig, ax = plt.subplots(figsize=(22, 14))
    fig.patch.set_facecolor(BG_DARK)
    ax.set_facecolor(BG_DARK)
    ax.axis('off')
    ax.set_xlim(0, 22)
    ax.set_ylim(-1, 17)

    # equipos en R32 (16 partidos, 32 equipos)
    # Los mostramos en 2 columnas (izquierda y derecha del bracket)
    r32_gana = res["r32_ganadores"]
    r16_gana = res["r16_ganadores"]
    qf_gana  = res["qf_ganadores"]
    sf_gana  = res["sf_ganadores"]
    campeon  = res["campeon"]
    subcampeon = res["subcampeon"]

    def color_equipo(nombre):
        if nombre == "México":
            return VERDE
        if nombre in ("Argentina", "Francia", "España", "Brasil"):
            return ROJO
        return AZUL

    def caja(ax, x, y, texto, w=2.8, h=0.4, color=AZUL, fontsize=8):
        rect = mpatches.FancyBboxPatch((x - w/2, y - h/2), w, h,
                                       boxstyle="round,pad=0.05",
                                       facecolor=color, edgecolor=BG_DARK,
                                       linewidth=0.8, alpha=0.85, zorder=3)
        ax.add_patch(rect)
        ax.text(x, y, texto[:20], ha='center', va='center',
                color='white', fontsize=fontsize, fontweight='bold', zorder=4)

    # columnas x por ronda
    # Bracket split: left half (matches 0-7) y right half (matches 8-15)
    # R32: x=1 (left) y x=21 (right)
    # R16: x=3.5 y x=18.5
    # QF:  x=6 y x=16
    # SF:  x=8.5 y x=13.5
    # Final: x=11

    etiq_rondas = {
        1: "R32", 3.5: "R16", 6: "QF", 8.5: "SF",
        11: "FINAL",
        13.5: "SF", 16: "QF", 18.5: "R16", 21: "R32"
    }
    for x_r, label in etiq_rondas.items():
        ax.text(x_r, 16.5, label, ha='center', va='center',
                color=ORO, fontsize=10, fontweight='bold', alpha=0.9)

    # dibujar R32 ganadores (8 en cada lado)
    y_positions_left  = [15, 13, 11, 9, 7, 5, 3, 1]
    y_positions_right = [15, 13, 11, 9, 7, 5, 3, 1]

    for i, (y, eq) in enumerate(zip(y_positions_left, r32_gana[:8])):
        caja(ax, 1, y, eq, color=color_equipo(eq), fontsize=8)
    for i, (y, eq) in enumerate(zip(y_positions_right, r32_gana[8:])):
        caja(ax, 21, y, eq, color=color_equipo(eq), fontsize=8)

    # R16 (8 equipos)
    y_r16_left  = [14, 10, 6, 2]
    y_r16_right = [14, 10, 6, 2]
    for i, (y, eq) in enumerate(zip(y_r16_left, r16_gana[:4])):
        caja(ax, 3.5, y, eq, color=color_equipo(eq), w=3.0, fontsize=8.5)
        # lineas conectando
        ax.plot([1 + 1.4, 3.5 - 1.5], [y_positions_left[i*2], y], color='#30363d', linewidth=1, alpha=0.6)
        ax.plot([1 + 1.4, 3.5 - 1.5], [y_positions_left[i*2+1], y], color='#30363d', linewidth=1, alpha=0.6)

    for i, (y, eq) in enumerate(zip(y_r16_right, r16_gana[4:])):
        caja(ax, 18.5, y, eq, color=color_equipo(eq), w=3.0, fontsize=8.5)
        ax.plot([21 - 1.4, 18.5 + 1.5], [y_positions_right[i*2], y], color='#30363d', linewidth=1, alpha=0.6)
        ax.plot([21 - 1.4, 18.5 + 1.5], [y_positions_right[i*2+1], y], color='#30363d', linewidth=1, alpha=0.6)

    # QF (4 equipos)
    y_qf = [12, 4]
    for i, (y, eq) in enumerate(zip(y_qf, qf_gana[:2])):
        caja(ax, 6, y, eq, color=color_equipo(eq), w=3.2, fontsize=9)
        ax.plot([3.5 + 1.5, 6 - 1.6], [y_r16_left[i*2], y], color='#30363d', linewidth=1, alpha=0.6)
        ax.plot([3.5 + 1.5, 6 - 1.6], [y_r16_left[i*2+1], y], color='#30363d', linewidth=1, alpha=0.6)

    for i, (y, eq) in enumerate(zip(y_qf, qf_gana[2:])):
        caja(ax, 16, y, eq, color=color_equipo(eq), w=3.2, fontsize=9)
        ax.plot([18.5 - 1.5, 16 + 1.6], [y_r16_right[i*2], y], color='#30363d', linewidth=1, alpha=0.6)
        ax.plot([18.5 - 1.5, 16 + 1.6], [y_r16_right[i*2+1], y], color='#30363d', linewidth=1, alpha=0.6)

    # SF (2 equipos por lado → 4)
    y_sf = [8]
    caja(ax, 8.5, 10, sf_gana[0], color=color_equipo(sf_gana[0]), w=3.4, fontsize=9.5)
    caja(ax, 8.5, 4,  sf_gana[1] if len(sf_gana) > 1 else "?", color=color_equipo(sf_gana[1] if len(sf_gana) > 1 else "?"), w=3.4, fontsize=9.5)
    ax.plot([6 + 1.6, 8.5 - 1.7], [12, 10], color='#30363d', linewidth=1.2, alpha=0.7)
    ax.plot([6 + 1.6, 8.5 - 1.7], [4, 4],   color='#30363d', linewidth=1.2, alpha=0.7)

    caja(ax, 13.5, 10, sf_gana[0] if len(sf_gana) < 3 else sf_gana[2], color=color_equipo(sf_gana[0]), w=3.4, fontsize=9.5)
    caja(ax, 13.5, 4,  sf_gana[1] if len(sf_gana) < 4 else sf_gana[3], color=color_equipo(sf_gana[1] if len(sf_gana) > 1 else "?"), w=3.4, fontsize=9.5)
    ax.plot([16 - 1.6, 13.5 + 1.7], [12, 10], color='#30363d', linewidth=1.2, alpha=0.7)
    ax.plot([16 - 1.6, 13.5 + 1.7], [4, 4],   color='#30363d', linewidth=1.2, alpha=0.7)

    # Final
    caja(ax, 11, 10, sf_gana[0], color=color_equipo(sf_gana[0]), w=3.6, fontsize=10)
    caja(ax, 11, 4,  sf_gana[1] if len(sf_gana) > 1 else "?", color=color_equipo(sf_gana[1] if len(sf_gana) > 1 else "?"), w=3.6, fontsize=10)
    ax.plot([8.5 + 1.7, 11 - 1.8], [10, 10], color='#30363d', linewidth=1.2, alpha=0.7)
    ax.plot([13.5 - 1.7, 11 + 1.8], [10, 10], color='#30363d', linewidth=1.2, alpha=0.7)
    ax.plot([8.5 + 1.7, 11 - 1.8], [4, 4],   color='#30363d', linewidth=1.2, alpha=0.7)
    ax.plot([13.5 - 1.7, 11 + 1.8], [4, 4],  color='#30363d', linewidth=1.2, alpha=0.7)

    # Campeon
    col_camp = color_equipo(campeon)
    rect_camp = mpatches.FancyBboxPatch((11 - 2, 6.5), 4, 2,
                                         boxstyle="round,pad=0.1",
                                         facecolor=col_camp, edgecolor=ORO,
                                         linewidth=2.5, alpha=0.95, zorder=5)
    ax.add_patch(rect_camp)
    ax.text(11, 7.5, "CAMPEON", ha='center', va='center',
            color=ORO, fontsize=9, fontweight='bold', alpha=0.9, zorder=6)
    ax.text(11, 7.0, campeon, ha='center', va='center',
            color='white', fontsize=13, fontweight='bold', zorder=6)
    ax.plot([11, 11], [10 - 0.2, 8.5], color=ORO, linewidth=2, alpha=0.8, zorder=4)
    ax.plot([11, 11], [4 + 0.2, 6.5], color=ORO, linewidth=2, alpha=0.8, zorder=4)

    ax.text(11, -0.5, "* Resultado de 1 simulacion representativa. Ver barras de probabilidades para distribucion completa.",
            ha='center', va='center', color=GRIS, fontsize=7, style='italic')

    plt.title("Mexico 2026 — Bracket Completo (R32 → Final)\nSimulacion representativa",
              color=TEXT_CLR, fontsize=14, fontweight='bold', pad=10)
    guardar_figura(fig, "14b_bracket_visual.png", dpi=150)
    plt.close()
    print("  -> bracket visual guardado")


if __name__ == "__main__":
    main()
