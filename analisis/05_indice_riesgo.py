"""
El Indice de Riesgo de Mexico
------------------------------
Metrica compuesta que mide cuanto riesgo tiene el camino de Mexico.
Dimensiones: dificultad del grupo, ruta eliminatoria, forma reciente,
efecto localia (bonus), vulnerabilidad en penales, presion historica.

Visualizado como radar chart comparando Mexico 2026 vs su promedio historico.
"""

import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyArrowPatch

from data.historico import get_df, FORMA_RECIENTE
from utils import prob_resultado, setup_estilo, guardar_figura, elo_desde_ranking
from utils import VERDE, ROJO, ORO, AZUL, BG_DARK, BG_PANEL, TEXT_CLR, GRIS

setup_estilo()

# dimensiones del indice (valores 0-10, donde 10 = maximo riesgo)
DIMENSIONES = [
    "Dificultad\ndel grupo",
    "Ruta en\neliminatoria",
    "Forma\nreciente (inv)",
    "Vulnerabilidad\nen penales",
    "Presion\nhistorica",
    "Dependencia\nde goles",
]

def calcular_dificultad_grupo():
    # rango promedio rivales: Corea 25, Chequia 41, Sudáfrica 60 → promedio 42
    rank_promedio = (25 + 41 + 60) / 3
    # normalizar: rank 1 = 10 de dificultad, rank 100 = 1
    return max(1, 10 - (rank_promedio - 1) * 9 / 99)


def calcular_dificultad_ruta():
    # si clasifica 1ro: posibles rivales Suiza(14), Brasil(4), Alemania(7)...
    # promedio de rivales en ruta si termina 1ro: ~12 de rank promedio ponderado
    rank_ruta_1ro = 12
    return max(1, 10 - (rank_ruta_1ro - 1) * 9 / 47)  # normalizado sobre top 48


def calcular_forma_invertida():
    # forma reciente: ultimos 10: 7G-2E-1P → rendimiento 0.77
    # si la forma es buena, el RIESGO es bajo → inverso
    ultimos = FORMA_RECIENTE["ultimos_10"]
    rendimiento = (ultimos["w"] * 3 + ultimos["d"]) / (ultimos["w"] + ultimos["d"] + ultimos["l"]) / 3
    return (1 - rendimiento) * 10  # invierto: buena forma = bajo riesgo


def calcular_vulnerabilidad_penales():
    # Mexico: 0 victorias en 2 tandas de penales mundialistas
    # tambien: solo 40% de conversion en torneos CONCACAF (estimado)
    return 7.5  # alto riesgo en penales


def calcular_presion_historica():
    # 7 octavos de final consecutivos perdidos = presion psicologica maxima
    # + ser sede = presion adicional
    return 8.5


def calcular_dependencia_goles():
    # en 2022 Mexico fue eliminado por diferencia de goles
    # en 2010 casi; en 2018 dependio del resultado de otro partido
    # goles en favor ultimos torneos: bajando tendencia
    df = get_df()
    era_mod = df[df["año"] >= 1994]
    goles_promedio = era_mod["gf"].mean() / era_mod["partidos"].mean()
    # normalizar: si marcas 2+ goles/partido, bajo riesgo; si <1.3, alto riesgo
    return max(1, min(10, (2.0 - goles_promedio) * 8 + 3))


def scores_2026():
    return np.array([
        calcular_dificultad_grupo(),
        calcular_dificultad_ruta(),
        calcular_forma_invertida(),
        calcular_vulnerabilidad_penales(),
        calcular_presion_historica(),
        calcular_dependencia_goles(),
    ])


def scores_historico_promedio():
    # promedio historico aproximado de Mexico (era moderna 1994-2018)
    # grupo tipicamente dificil (muchos con Argentina o rivales top)
    return np.array([5.5, 7.0, 5.0, 7.5, 6.0, 5.0])


def scores_2022():
    # Qatar 2022: grupo con Argentina → muy dificil, mala forma post-pandemic
    return np.array([7.0, 8.0, 6.0, 7.5, 8.0, 7.0])


def radar_chart(ax, valores, color, label, alpha=0.25):
    n = len(valores)
    angulos = np.linspace(0, 2 * np.pi, n, endpoint=False).tolist()
    angulos += angulos[:1]
    vals = list(valores) + [valores[0]]

    ax.plot(angulos, vals, color=color, linewidth=2, label=label)
    ax.fill(angulos, vals, color=color, alpha=alpha)
    return angulos


def main():
    s2026 = scores_2026()
    s_hist = scores_historico_promedio()
    s2022 = scores_2022()

    print("Indice de Riesgo Mexico 2026:")
    for dim, val in zip(DIMENSIONES, s2026):
        print(f"  {dim.replace(chr(10), ' '):35s}: {val:.2f}/10")
    print(f"\n  Riesgo total (promedio): {s2026.mean():.2f}/10")
    print(f"  Riesgo historico promedio: {s_hist.mean():.2f}/10")
    print(f"  Riesgo Qatar 2022: {s2022.mean():.2f}/10")

    # ---- FIGURA ----
    fig = plt.figure(figsize=(14, 7))
    fig.patch.set_facecolor(BG_DARK)

    # radar
    ax1 = fig.add_subplot(121, polar=True)
    ax1.set_facecolor(BG_PANEL)

    n = len(DIMENSIONES)
    angulos = np.linspace(0, 2 * np.pi, n, endpoint=False).tolist()
    angulos += angulos[:1]

    radar_chart(ax1, s2026,  VERDE, "Mexico 2026",          alpha=0.3)
    radar_chart(ax1, s_hist, GRIS,  "Promedio historico",   alpha=0.15)
    radar_chart(ax1, s2022,  ROJO,  "Qatar 2022",           alpha=0.15)

    ax1.set_xticks(angulos[:-1])
    ax1.set_xticklabels(DIMENSIONES, size=8.5, color=TEXT_CLR)
    ax1.set_ylim(0, 10)
    ax1.set_yticks([2, 4, 6, 8, 10])
    ax1.set_yticklabels(["2", "4", "6", "8", "10"], color=GRIS, size=7)
    ax1.tick_params(colors=TEXT_CLR)
    ax1.grid(color='#30363d', alpha=0.6)
    ax1.spines['polar'].set_color('#30363d')

    legend = ax1.legend(loc='upper right', bbox_to_anchor=(1.35, 1.1),
                        facecolor=BG_PANEL, edgecolor='#30363d', labelcolor=TEXT_CLR, fontsize=9)
    ax1.set_title("Indice de Riesgo\n(10 = maximo riesgo)", color=TEXT_CLR,
                  fontweight='bold', pad=20)

    # barras de componentes
    ax2 = fig.add_subplot(122)
    ax2.set_facecolor(BG_PANEL)

    y = np.arange(n)
    h = 0.28
    etiq = [d.replace('\n', ' ') for d in DIMENSIONES]

    ax2.barh(y + h, s_hist, h, label="Promedio historico", color=GRIS,   alpha=0.7)
    ax2.barh(y,     s2022,  h, label="Qatar 2022",          color=ROJO,   alpha=0.7)
    ax2.barh(y - h, s2026,  h, label="Mexico 2026",         color=VERDE,  alpha=0.9)

    ax2.set_yticks(y)
    ax2.set_yticklabels(etiq, color=TEXT_CLR, fontsize=9)
    ax2.set_xlabel("Nivel de riesgo (0=bajo, 10=alto)", color=TEXT_CLR)
    ax2.set_title("Comparacion componentes de riesgo", color=TEXT_CLR, fontweight='bold')
    ax2.set_xlim(0, 11)
    ax2.axvline(x=5, color=ORO, linestyle='--', alpha=0.4, linewidth=1)
    ax2.legend(facecolor=BG_PANEL, edgecolor='#30363d', labelcolor=TEXT_CLR, fontsize=9)
    ax2.tick_params(colors=TEXT_CLR)
    for spine in ax2.spines.values():
        spine.set_edgecolor('#30363d')
    ax2.grid(axis='x', alpha=0.3, color=TEXT_CLR)

    # anotacion conclusion
    diff = s2026.mean() - s_hist.mean()
    txt = f"2026 es {abs(diff):.1f} pts {'MENOS' if diff < 0 else 'MAS'} riesgoso\nque el promedio historico"
    ax2.text(0.97, 0.04, txt, transform=ax2.transAxes, ha='right', va='bottom',
             color=VERDE if diff < 0 else ROJO, fontsize=10, fontweight='bold',
             bbox=dict(boxstyle='round', facecolor=BG_DARK, edgecolor=ORO, alpha=0.8))

    plt.suptitle("Mexico 2026 — Indice de Riesgo", color=TEXT_CLR,
                 fontsize=14, fontweight='bold')
    plt.tight_layout()
    guardar_figura(fig, "05_indice_riesgo.png")
    plt.close()


if __name__ == "__main__":
    main()
