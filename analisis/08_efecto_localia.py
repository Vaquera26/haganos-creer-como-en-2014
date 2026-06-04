"""
Efecto de Localía
------------------
Analiza cuanto importa ser sede en el Mundial.
1. Rendimiento historico de selecciones anfitrionas vs no anfitrionas.
2. Record de Mexico en casa vs fuera.
3. Estimacion del bonus que la localía le da a Mexico en 2026.
4. Factores especificos: altitud Azteca, clima, adaptacion.
"""

import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches

from data.historico import get_df, HOSTS_HISTORICO, FORMA_RECIENTE
from utils import setup_estilo, guardar_figura, prob_resultado, elo_desde_ranking
from utils import VERDE, ROJO, ORO, AZUL, BG_DARK, BG_PANEL, TEXT_CLR, GRIS

setup_estilo()

# rendimiento de Mexico jugando en casa (general, no solo mundiales)
MEXICO_EN_CASA = {
    "total_partidos": 120,
    "victorias": 85, "empates": 22, "derrotas": 13,
    "gf": 280, "ga": 95,
}
MEXICO_FUERA = {
    "total_partidos": 98,
    "victorias": 48, "empates": 22, "derrotas": 28,
    "gf": 175, "ga": 115,
}

# estadios de Mexico en 2026 con altitud
ESTADIOS_2026 = {
    "Azteca (CDMX)":           {"altitud_m": 2240, "capacidad": 87000, "partidos_mx": 2},
    "Estadio Akron (Guadalajara)": {"altitud_m": 1554, "capacidad": 49000, "partidos_mx": 1},
}

# impacto estimado de altitud en rendimiento del rival (% de reduccion en rendimiento)
def penalizacion_altitud(metros):
    if metros < 500:   return 0.0
    elif metros < 1200: return 0.03
    elif metros < 2000: return 0.07
    elif metros < 2500: return 0.12
    return 0.18


def analizar_sedes():
    df_hosts = pd.DataFrame(HOSTS_HISTORICO)
    mapa_ronda = {"Grupos": 1, "Segunda": 2, "Octavos": 3, "Cuartos": 4,
                  "Semifinal": 5, "Final": 6, "Campeón": 7}
    df_hosts["ronda_num"] = df_hosts["ronda_alcanzada"].map(mapa_ronda)
    # promedio de rondas como sede vs promedio mundial general (para comparar)
    return df_hosts


def main():
    df = get_df()
    df_hosts = analizar_sedes()

    # rondas promedio como sede (excluye Qatar 2022 por ser sede atipica y casos prerank)
    host_df = df_hosts[df_hosts["año"] >= 1970]
    ronda_prom_host = host_df["ronda_num"].mean()
    # rondas promedio de Mexico no siendo sede
    no_host = df[(df["host"] == False) & (df["año"] >= 1994)]
    ronda_prom_no_host = no_host["ronda_num"].mean()

    # bonus de P(ganar) con vs sin altitud
    rank_rival_ejemplo = 25  # Corea del Sur
    p_sin_alt = prob_resultado(15, rank_rival_ejemplo, ventaja_local=True, altitud_bonus=0)
    p_con_alt = prob_resultado(15, rank_rival_ejemplo, ventaja_local=True, altitud_bonus=30)

    print(f"Ronda promedio de sedes (1970+): {ronda_prom_host:.2f}")
    print(f"Ronda promedio Mexico fuera de casa (1994-2018): {ronda_prom_no_host:.2f}")
    print(f"\nP(ganar) vs Corea sin altitud: {p_sin_alt[0]*100:.1f}%")
    print(f"P(ganar) vs Corea con altitud Azteca: {p_con_alt[0]*100:.1f}%")
    print(f"Bonus altitud: +{(p_con_alt[0]-p_sin_alt[0])*100:.1f} pp")

    # ---- FIGURA ----
    fig, axes = plt.subplots(2, 2, figsize=(14, 9))
    fig.patch.set_facecolor(BG_DARK)
    for ax in axes.flat:
        ax.set_facecolor(BG_PANEL)

    # --- 1: sedes y ronda alcanzada ---
    ax = axes[0, 0]
    años_host = host_df["año"].tolist()
    rondas_host = host_df["ronda_num"].tolist()
    paises_host = host_df["pais"].tolist()
    col_host = [ORO if p == "México" else AZUL for p in paises_host]

    bars = ax.bar(range(len(años_host)), rondas_host, color=col_host,
                  edgecolor=BG_DARK, linewidth=0.8, width=0.7)
    ax.axhline(y=ronda_prom_host, color=VERDE, linestyle='--', alpha=0.7, linewidth=1.5, label=f"Promedio sedes: {ronda_prom_host:.1f}")
    ax.axhline(y=ronda_prom_no_host, color=GRIS, linestyle=':', alpha=0.7, linewidth=1.5, label=f"Prom Mexico fuera: {ronda_prom_no_host:.1f}")
    ax.set_xticks(range(len(años_host)))
    ax.set_xticklabels([f"{p}\n{y}" for p, y in zip(paises_host, años_host)], rotation=45, fontsize=7, color=TEXT_CLR)
    ax.set_yticks([1, 2, 3, 4, 5, 6, 7])
    ax.set_yticklabels(["Grupos", "Seg.R.", "Octavos", "Cuartos", "Semi", "Final", "Campeon"], color=TEXT_CLR, fontsize=8)
    ax.set_title("Ronda alcanzada por selecciones anfitrionas", color=TEXT_CLR, fontweight='bold')
    ax.legend(facecolor=BG_PANEL, edgecolor='#30363d', labelcolor=TEXT_CLR, fontsize=8)
    ax.tick_params(colors=TEXT_CLR)
    for spine in ax.spines.values(): spine.set_edgecolor('#30363d')
    leyenda = [mpatches.Patch(color=ORO, label="Mexico"), mpatches.Patch(color=AZUL, label="Otro pais")]
    ax.legend(handles=leyenda + [
        mpatches.Patch(color=VERDE, alpha=0.5, label=f"Prom. sedes {ronda_prom_host:.1f}"),
    ], facecolor=BG_PANEL, edgecolor='#30363d', labelcolor=TEXT_CLR, fontsize=8)

    # --- 2: Mexico casa vs fuera ---
    ax = axes[0, 1]
    categorias = ['Victoria', 'Empate', 'Derrota']
    vals_casa  = [MEXICO_EN_CASA["victorias"]/MEXICO_EN_CASA["total_partidos"]*100,
                  MEXICO_EN_CASA["empates"]/MEXICO_EN_CASA["total_partidos"]*100,
                  MEXICO_EN_CASA["derrotas"]/MEXICO_EN_CASA["total_partidos"]*100]
    vals_fuera = [MEXICO_FUERA["victorias"]/MEXICO_FUERA["total_partidos"]*100,
                  MEXICO_FUERA["empates"]/MEXICO_FUERA["total_partidos"]*100,
                  MEXICO_FUERA["derrotas"]/MEXICO_FUERA["total_partidos"]*100]
    x = np.arange(3)
    w = 0.35
    b1 = ax.bar(x - w/2, vals_casa,  w, label="En casa", color=VERDE, alpha=0.9)
    b2 = ax.bar(x + w/2, vals_fuera, w, label="De visita", color=ROJO,  alpha=0.9)
    ax.set_xticks(x)
    ax.set_xticklabels(categorias, color=TEXT_CLR)
    ax.set_ylabel("Porcentaje de partidos (%)", color=TEXT_CLR)
    ax.set_title("Mexico: rendimiento en casa vs fuera", color=TEXT_CLR, fontweight='bold')
    ax.legend(facecolor=BG_PANEL, edgecolor='#30363d', labelcolor=TEXT_CLR)
    ax.tick_params(colors=TEXT_CLR)
    for spine in ax.spines.values(): spine.set_edgecolor('#30363d')
    for bars_grp in (b1, b2):
        for bar in bars_grp:
            ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.5,
                    f'{bar.get_height():.0f}%', ha='center', va='bottom', color=TEXT_CLR, fontsize=8)

    # --- 3: impacto altitud ---
    ax = axes[1, 0]
    altitudes = np.linspace(0, 3000, 300)
    penalizaciones = [penalizacion_altitud(a) * 100 for a in altitudes]
    ax.plot(altitudes, penalizaciones, color=ROJO, linewidth=2.5)
    for est, info in ESTADIOS_2026.items():
        alt = info["altitud_m"]
        pen = penalizacion_altitud(alt) * 100
        ax.axvline(x=alt, color=ORO, linestyle='--', alpha=0.7, linewidth=1.5)
        ax.annotate(f"{est.split('(')[0].strip()}\n{alt}m → -{pen:.0f}%",
                    xy=(alt, pen), xytext=(alt + 100, pen + 1),
                    color=ORO, fontsize=8, arrowprops=dict(arrowstyle='->', color=ORO, alpha=0.6))

    ax.set_xlabel("Altitud del estadio (metros sobre nivel del mar)", color=TEXT_CLR)
    ax.set_ylabel("Reduccion estimada en rendimiento del rival (%)", color=TEXT_CLR)
    ax.set_title("Impacto de la altitud en el rendimiento del rival", color=TEXT_CLR, fontweight='bold')
    ax.tick_params(colors=TEXT_CLR)
    for spine in ax.spines.values(): spine.set_edgecolor('#30363d')

    # --- 4: prob ganar por altitud ---
    ax = axes[1, 1]
    altitudes_test = [0, 500, 1000, 1500, 2000, 2240, 2500]
    rivales_test   = [("Sudáfrica", 60), ("Corea del Sur", 25), ("Chequia", 41)]
    colores_riv    = [VERDE, ORO, AZUL]
    for (nombre, rank), col in zip(rivales_test, colores_riv):
        probs = [prob_resultado(15, rank, ventaja_local=True, altitud_bonus=penalizacion_altitud(a)*200)[0]*100
                 for a in altitudes_test]
        ax.plot(altitudes_test, probs, marker='o', color=col, linewidth=2, markersize=5, label=f"vs {nombre} (Rk{rank})")

    ax.axvline(x=2240, color=GRIS, linestyle='--', alpha=0.5, linewidth=1)
    ax.text(2260, ax.get_ylim()[0] + 2 if ax.get_ylim()[0] > 0 else 52,
            "Azteca", color=GRIS, fontsize=8, alpha=0.7)
    ax.set_xlabel("Altitud del estadio (m)", color=TEXT_CLR)
    ax.set_ylabel("P(Mexico gana) %", color=TEXT_CLR)
    ax.set_title("P(Mexico gana) vs nivel de altitud del estadio", color=TEXT_CLR, fontweight='bold')
    ax.legend(facecolor=BG_PANEL, edgecolor='#30363d', labelcolor=TEXT_CLR, fontsize=9)
    ax.tick_params(colors=TEXT_CLR)
    for spine in ax.spines.values(): spine.set_edgecolor('#30363d')

    plt.suptitle("Mexico 2026 — Efecto de Localía y Altitud", color=TEXT_CLR,
                 fontsize=14, fontweight='bold')
    plt.tight_layout()
    guardar_figura(fig, "08_efecto_localia.png")
    plt.close()


if __name__ == "__main__":
    main()
