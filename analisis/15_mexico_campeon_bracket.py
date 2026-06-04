"""
Mexico Campeon — Bracket Completo
-----------------------------------
Simula torneos completos hasta que Mexico gane el Mundial.
Muestra el bracket exacto de ESA simulacion: todos los cruces,
quien cayo, el camino de Mexico resaltado en verde.
"""

import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch

from data.grupo_2026 import TODOS_LOS_GRUPOS
from utils import simular_marcador, prob_resultado, setup_estilo, guardar_figura
from utils import VERDE, ROJO, ORO, AZUL, BG_DARK, BG_PANEL, TEXT_CLR, GRIS

setup_estilo()
np.random.seed(None)   # aleatorio real para que sea distinto cada vez

BRACKET_R32 = [
    ("1A", "2B"), ("1C", "2D"),
    ("1E", "2F"), ("1G", "2H"),
    ("1B", "2A"), ("1D", "2C"),
    ("1F", "2E"), ("1H", "2G"),
    ("1I", "2J"), ("1K", "2L"),
    ("T1", "T2"), ("T3", "T4"),
    ("1J", "2I"), ("1L", "2K"),
    ("T5", "T6"), ("T7", "T8"),
]


def simular_grupo(grupo_label, equipos_ranks):
    equipos = list(equipos_ranks.keys())
    pts = {e: 0 for e in equipos}
    gd  = {e: 0 for e in equipos}
    gf  = {e: 0 for e in equipos}

    for i in range(len(equipos)):
        for j in range(i + 1, len(equipos)):
            a, b = equipos[i], equipos[j]
            local = grupo_label == "A" and a == "México"
            alt   = 25 if local else 0
            ga, gb = simular_marcador(equipos_ranks[a], equipos_ranks[b],
                                      ventaja_local=local, altitud_bonus=alt)
            ga, gb = int(ga[0]), int(gb[0])
            gf[a] += ga; gf[b] += gb
            gd[a] += ga - gb; gd[b] += gb - ga
            if ga > gb:    pts[a] += 3
            elif ga == gb: pts[a] += 1; pts[b] += 1
            else:          pts[b] += 3

    tabla = sorted(equipos, key=lambda e: (pts[e], gd[e], gf[e]), reverse=True)
    return {"1ro": tabla[0], "2do": tabla[1], "3ro": tabla[2],
            "pts": pts, "gd": gd, "gf": gf}


def partido_eliminatorio(eq_a, eq_b, ranks, ronda):
    if eq_a == "?" or eq_b == "?":
        return eq_a if eq_b == "?" else eq_b, (0, 0)

    rank_a = ranks.get(eq_a, 50)
    rank_b = ranks.get(eq_b, 50)
    local  = eq_a == "México" and ronda in ("R32", "R16")
    alt    = 20 if local else 0

    pw, pe, pl = prob_resultado(rank_a, rank_b, ventaja_local=local, altitud_bonus=alt)
    r = np.random.rand()

    xg_a = 1.2 * (rank_b / rank_a) ** 0.5
    xg_b = 1.2 * (rank_a / rank_b) ** 0.5
    from scipy.stats import poisson
    ga = int(poisson.rvs(max(0.3, xg_a)))
    gb = int(poisson.rvs(max(0.3, xg_b)))

    if r < pw:
        if ga <= gb: ga = gb + 1
        return eq_a, (ga, gb)
    elif r < pw + pe:
        # empate + penales; México 0/2 mundiales, 1/3 CONCACAF → 30%
        while ga != gb: gb = int(poisson.rvs(max(0.3, xg_b)))
        if "México" in (eq_a, eq_b):
            p_mx = 0.30
            ganador = "México" if np.random.rand() < p_mx else (eq_b if eq_a == "México" else eq_a)
        else:
            ganador = eq_a if np.random.rand() < 0.50 else eq_b
        return ganador, (ga, gb)
    else:
        if gb <= ga: gb = ga + 1
        return eq_b, (ga, gb)


def simular_hasta_que_gane_mexico():
    intentos = 0
    etapas = {"R32": 0, "R16": 0, "QF": 0, "SF": 0, "Final": 0}
    print("Buscando simulacion donde Mexico sea campeon...")
    print("(Mexico gana el mundial ~1-2% de las veces, puede tomar ~50-100 intentos)\n")

    while True:
        intentos += 1
        resultado = simular_torneo_completo()
        etapa = resultado.get("etapa_mexico", "R32")

        # contar hasta donde llego Mexico en este intento
        if etapa in etapas:
            etapas[etapa] += 1

        if intentos % 10 == 0:
            total = sum(etapas.values())
            acum = 0
            partes = []
            for e in ["R32", "R16", "QF", "SF", "Final"]:
                acum += etapas.get(e, 0)
            llegaron_mas_lejos = intentos - acum
            print(f"  intento #{intentos:4d} | "
                  f"R32: {etapas['R32']:3d}  "
                  f"R16: {etapas['R16']:3d}  "
                  f"QF: {etapas['QF']:3d}  "
                  f"SF: {etapas['SF']:3d}  "
                  f"Final: {etapas['Final']:3d}  "
                  f"Campeon: {llegaron_mas_lejos:3d}", end='\r')

        if resultado["campeon"] == "México":
            print(f"\n\nMexico campeon en el intento #{intentos}!")
            return resultado


def simular_torneo_completo():
    ranks = {}
    for g, eq in TODOS_LOS_GRUPOS.items():
        for nombre, r in eq.items():
            ranks[nombre] = r

    # grupos
    clasificados = {}
    terceros = []
    for label, eq_ranks in TODOS_LOS_GRUPOS.items():
        res = simular_grupo(label, eq_ranks)
        clasificados[f"1{label}"] = res["1ro"]
        clasificados[f"2{label}"] = res["2do"]
        terceros.append({
            "equipo": res["3ro"], "grupo": label,
            "pts": res["pts"][res["3ro"]],
            "gd":  res["gd"][res["3ro"]],
            "gf":  res["gf"][res["3ro"]],
        })

    terceros_ok = sorted(terceros, key=lambda x: (x["pts"], x["gd"], x["gf"]), reverse=True)[:8]
    for i, t in enumerate(terceros_ok):
        clasificados[f"T{i+1}"] = t["equipo"]
    for i in range(8, 12):
        clasificados[f"T{i+1}"] = "?"

    # R32
    r32 = []
    for slot_a, slot_b in BRACKET_R32:
        eq_a = clasificados.get(slot_a, "?")
        eq_b = clasificados.get(slot_b, "?")
        ganador, score = partido_eliminatorio(eq_a, eq_b, ranks, "R32")
        r32.append({"equipo_a": eq_a, "equipo_b": eq_b, "ganador": ganador, "score": score})

    # R16
    r16 = []
    r32g = [p["ganador"] for p in r32]
    for i in range(0, 16, 2):
        eq_a, eq_b = r32g[i], r32g[i+1]
        ganador, score = partido_eliminatorio(eq_a, eq_b, ranks, "R16")
        r16.append({"equipo_a": eq_a, "equipo_b": eq_b, "ganador": ganador, "score": score})

    # QF
    qf = []
    r16g = [p["ganador"] for p in r16]
    for i in range(0, 8, 2):
        eq_a, eq_b = r16g[i], r16g[i+1]
        ganador, score = partido_eliminatorio(eq_a, eq_b, ranks, "QF")
        qf.append({"equipo_a": eq_a, "equipo_b": eq_b, "ganador": ganador, "score": score})

    # SF
    sf = []
    qfg = [p["ganador"] for p in qf]
    for i in range(0, 4, 2):
        eq_a, eq_b = qfg[i], qfg[i+1]
        ganador, score = partido_eliminatorio(eq_a, eq_b, ranks, "SF")
        sf.append({"equipo_a": eq_a, "equipo_b": eq_b, "ganador": ganador, "score": score})

    # Final
    sfg = [p["ganador"] for p in sf]
    campeon, score_final = partido_eliminatorio(sfg[0], sfg[1], ranks, "Final")
    final = {"equipo_a": sfg[0], "equipo_b": sfg[1], "ganador": campeon, "score": score_final}

    # donde quedo Mexico
    r32g  = [p["ganador"] for p in r32]
    r16g  = [p["ganador"] for p in r16]
    qfg   = [p["ganador"] for p in qf]
    sfg   = [p["ganador"] for p in sf]

    if "México" not in r32g:
        etapa_mx = "R32"
    elif "México" not in r16g:
        etapa_mx = "R16"
    elif "México" not in qfg:
        etapa_mx = "QF"
    elif "México" not in sfg:
        etapa_mx = "SF"
    elif campeon != "México":
        etapa_mx = "Final"
    else:
        etapa_mx = "Campeon"

    return {
        "campeon": campeon,
        "etapa_mexico": etapa_mx,
        "r32": r32, "r16": r16, "qf": qf, "sf": sf, "final": final,
        "clasificados": clasificados,
    }


# ─── Dibujo del bracket ───────────────────────────────────────────────────────

def es_mexico(nombre):
    return nombre == "México"


def color_caja(nombre, es_ganador):
    if es_mexico(nombre):
        return VERDE if es_ganador else '#004d35'
    if es_ganador:
        return '#1f3a5f'
    return '#111827'


def dibujar_caja(ax, cx, cy, nombre, score_str, es_ganador, w=3.1, h=0.52):
    col = color_caja(nombre, es_ganador)
    borde = VERDE if es_mexico(nombre) else (ORO if es_ganador and es_mexico(nombre) else '#2d3748')
    borde_w = 2.5 if es_mexico(nombre) else 0.8

    rect = FancyBboxPatch((cx - w/2, cy - h/2), w, h,
                          boxstyle="round,pad=0.04",
                          facecolor=col, edgecolor=borde,
                          linewidth=borde_w, zorder=4)
    ax.add_patch(rect)

    nombre_corto = nombre[:18]
    col_txt = VERDE if es_mexico(nombre) else (TEXT_CLR if es_ganador else '#6b7280')
    peso = 'bold' if es_ganador or es_mexico(nombre) else 'normal'
    ax.text(cx - 0.3, cy, nombre_corto, ha='center', va='center',
            color=col_txt, fontsize=7.5, fontweight=peso, zorder=5)

    if score_str:
        ax.text(cx + w/2 - 0.25, cy, score_str, ha='center', va='center',
                color=ORO if es_ganador else '#4b5563', fontsize=7, fontweight='bold', zorder=5)


def linea(ax, x0, y0, x1, y1, mx=False):
    col = VERDE if mx else '#2d3748'
    lw  = 1.8  if mx else 0.8
    ax.plot([x0, x1], [y0, y1], color=col, linewidth=lw, zorder=2, alpha=0.9 if mx else 0.5)


def main():
    res = simular_hasta_que_gane_mexico()

    r32_partidos = res["r32"]
    r16_partidos = res["r16"]
    qf_partidos  = res["qf"]
    sf_partidos  = res["sf"]
    final_p      = res["final"]
    campeon      = res["campeon"]

    print("\nCamino de Mexico:")
    for ronda, partidos in [("R32", r32_partidos), ("R16", r16_partidos),
                             ("QF", qf_partidos), ("SF", sf_partidos)]:
        for p in partidos:
            if "México" in (p["equipo_a"], p["equipo_b"]):
                rival = p["equipo_b"] if p["equipo_a"] == "México" else p["equipo_a"]
                s = p["score"]
                print(f"  {ronda:5s}: Mexico {s[0]}-{s[1]} {rival}  → {p['ganador']}")
    s = final_p["score"]
    print(f"  Final: {final_p['equipo_a']} {s[0]}-{s[1]} {final_p['equipo_b']}  → CAMPEON: {campeon}")

    # ─── Figura ──────────────────────────────────────────────────────────────
    fig, ax = plt.subplots(figsize=(26, 18))
    fig.patch.set_facecolor(BG_DARK)
    ax.set_facecolor(BG_DARK)
    ax.axis('off')

    # layout: 8 partidos R32 izquierda, 8 derecha; convergen al centro
    # columnas x:  R32=1.8 | R16=5.2 | QF=8.4 | SF=11.2 | FINAL=14 | SF=16.8 | QF=19.6 | R16=22.8 | R32=26.2
    # pero dado que tenemos 16 partidos de R32, los split en 8 izquierda y 8 derecha

    COL = {
        "R32_L": 1.9, "R16_L": 5.4, "QF_L": 8.6, "SF_L": 11.4,
        "FINAL": 14.0,
        "SF_R": 16.6, "QF_R": 19.4, "R16_R": 22.6, "R32_R": 26.1,
    }

    # posiciones y para 8 pares en R32 (cada par ocupa 2 filas de altura 2.0)
    # total altura ~16 unidades para 8 partidos
    GAP = 2.0
    Y_BASE = 15.5

    def y_partido(idx):
        # y del centro del partido idx (0-7)
        return Y_BASE - idx * GAP

    def y_par(idx):
        # los dos equipos de un partido están separados 0.56 verticalmente
        yc = y_partido(idx)
        return yc + 0.28, yc - 0.28

    ax.set_xlim(0, 28)
    ax.set_ylim(-1.5, 18)

    # encabezados de ronda
    for col_name, label in [
        ("R32_L", "R32"), ("R16_L", "OCTAVOS"), ("QF_L", "CUARTOS"),
        ("SF_L", "SEMIS"), ("FINAL", "FINAL"),
        ("SF_R", "SEMIS"), ("QF_R", "CUARTOS"), ("R16_R", "OCTAVOS"), ("R32_R", "R32"),
    ]:
        ax.text(COL[col_name], 17.2, label, ha='center', va='center',
                color=ORO, fontsize=9, fontweight='bold', alpha=0.9)

    # ── R32: mitad izquierda (partidos 0-7) ──────────────────────────────────
    r32_L = r32_partidos[:8]
    r32_R = r32_partidos[8:]

    r32_y_ganadores_L = []
    r32_y_ganadores_R = []

    for idx, p in enumerate(r32_L):
        ya, yb = y_par(idx)
        g = p["ganador"]
        s = f"{p['score'][0]}-{p['score'][1]}"
        dibujar_caja(ax, COL["R32_L"], ya, p["equipo_a"], s if p["equipo_a"]==g else "", p["equipo_a"]==g)
        dibujar_caja(ax, COL["R32_L"], yb, p["equipo_b"], s if p["equipo_b"]==g else "", p["equipo_b"]==g)
        yc = y_partido(idx)
        r32_y_ganadores_L.append((yc, g))

    for idx, p in enumerate(r32_R):
        ya, yb = y_par(idx)
        g = p["ganador"]
        s = f"{p['score'][0]}-{p['score'][1]}"
        dibujar_caja(ax, COL["R32_R"], ya, p["equipo_a"], s if p["equipo_a"]==g else "", p["equipo_a"]==g)
        dibujar_caja(ax, COL["R32_R"], yb, p["equipo_b"], s if p["equipo_b"]==g else "", p["equipo_b"]==g)
        yc = y_partido(idx)
        r32_y_ganadores_R.append((yc, g))

    # ── R16: mitad izquierda (4 partidos) ────────────────────────────────────
    # cada partido R16 mezcla pares consecutivos de R32
    r16_y_L = []
    for idx, p in enumerate(r16_partidos[:4]):
        # y central entre los dos R32 que lo alimentan
        y_arr1 = r32_y_ganadores_L[idx*2][0]
        y_arr2 = r32_y_ganadores_L[idx*2+1][0]
        yc = (y_arr1 + y_arr2) / 2
        ya, yb = yc + 0.28, yc - 0.28
        g = p["ganador"]
        s = f"{p['score'][0]}-{p['score'][1]}"
        dibujar_caja(ax, COL["R16_L"], ya, p["equipo_a"], s if p["equipo_a"]==g else "", p["equipo_a"]==g)
        dibujar_caja(ax, COL["R16_L"], yb, p["equipo_b"], s if p["equipo_b"]==g else "", p["equipo_b"]==g)
        r16_y_L.append((yc, g))

        # lineas R32 → R16
        for r32_idx in (idx*2, idx*2+1):
            yr32, eq32 = r32_y_ganadores_L[r32_idx]
            is_mx = es_mexico(eq32)
            linea(ax, COL["R32_L"]+1.55, yr32, COL["R16_L"]-1.55, ya if r32_idx==idx*2 else yb, mx=is_mx)

    r16_y_R = []
    for idx, p in enumerate(r16_partidos[4:]):
        y_arr1 = r32_y_ganadores_R[idx*2][0]
        y_arr2 = r32_y_ganadores_R[idx*2+1][0]
        yc = (y_arr1 + y_arr2) / 2
        ya, yb = yc + 0.28, yc - 0.28
        g = p["ganador"]
        s = f"{p['score'][0]}-{p['score'][1]}"
        dibujar_caja(ax, COL["R16_R"], ya, p["equipo_a"], s if p["equipo_a"]==g else "", p["equipo_a"]==g)
        dibujar_caja(ax, COL["R16_R"], yb, p["equipo_b"], s if p["equipo_b"]==g else "", p["equipo_b"]==g)
        r16_y_R.append((yc, g))
        for r32_idx in (idx*2, idx*2+1):
            yr32, eq32 = r32_y_ganadores_R[r32_idx]
            linea(ax, COL["R32_R"]-1.55, yr32, COL["R16_R"]+1.55, ya if r32_idx==idx*2 else yb, mx=es_mexico(eq32))

    # ── QF ───────────────────────────────────────────────────────────────────
    qf_y_L = []
    for idx, p in enumerate(qf_partidos[:2]):
        y1, y2 = r16_y_L[idx*2][0], r16_y_L[idx*2+1][0]
        yc = (y1 + y2) / 2
        ya, yb = yc + 0.28, yc - 0.28
        g = p["ganador"]
        s = f"{p['score'][0]}-{p['score'][1]}"
        dibujar_caja(ax, COL["QF_L"], ya, p["equipo_a"], s if p["equipo_a"]==g else "", p["equipo_a"]==g)
        dibujar_caja(ax, COL["QF_L"], yb, p["equipo_b"], s if p["equipo_b"]==g else "", p["equipo_b"]==g)
        qf_y_L.append((yc, g))
        for ri, (yr16, eq16) in enumerate((r16_y_L[idx*2], r16_y_L[idx*2+1])):
            linea(ax, COL["R16_L"]+1.55, yr16, COL["QF_L"]-1.55, ya if ri==0 else yb, mx=es_mexico(eq16))

    qf_y_R = []
    for idx, p in enumerate(qf_partidos[2:]):
        y1, y2 = r16_y_R[idx*2][0], r16_y_R[idx*2+1][0]
        yc = (y1 + y2) / 2
        ya, yb = yc + 0.28, yc - 0.28
        g = p["ganador"]
        s = f"{p['score'][0]}-{p['score'][1]}"
        dibujar_caja(ax, COL["QF_R"], ya, p["equipo_a"], s if p["equipo_a"]==g else "", p["equipo_a"]==g)
        dibujar_caja(ax, COL["QF_R"], yb, p["equipo_b"], s if p["equipo_b"]==g else "", p["equipo_b"]==g)
        qf_y_R.append((yc, g))
        for ri, (yr16, eq16) in enumerate((r16_y_R[idx*2], r16_y_R[idx*2+1])):
            linea(ax, COL["R16_R"]-1.55, yr16, COL["QF_R"]+1.55, ya if ri==0 else yb, mx=es_mexico(eq16))

    # ── SF ───────────────────────────────────────────────────────────────────
    sf_y_L = []
    for idx, p in enumerate(sf_partidos[:1]):
        y1, y2 = qf_y_L[0][0], qf_y_L[1][0]
        yc = (y1 + y2) / 2
        ya, yb = yc + 0.28, yc - 0.28
        g = p["ganador"]
        s = f"{p['score'][0]}-{p['score'][1]}"
        dibujar_caja(ax, COL["SF_L"], ya, p["equipo_a"], s if p["equipo_a"]==g else "", p["equipo_a"]==g)
        dibujar_caja(ax, COL["SF_L"], yb, p["equipo_b"], s if p["equipo_b"]==g else "", p["equipo_b"]==g)
        sf_y_L.append((yc, g))
        for ri, (yqf, eqf) in enumerate((qf_y_L[0], qf_y_L[1])):
            linea(ax, COL["QF_L"]+1.6, yqf, COL["SF_L"]-1.55, ya if ri==0 else yb, mx=es_mexico(eqf))

    sf_y_R = []
    for idx, p in enumerate(sf_partidos[1:]):
        y1, y2 = qf_y_R[0][0], qf_y_R[1][0]
        yc = (y1 + y2) / 2
        ya, yb = yc + 0.28, yc - 0.28
        g = p["ganador"]
        s = f"{p['score'][0]}-{p['score'][1]}"
        dibujar_caja(ax, COL["SF_R"], ya, p["equipo_a"], s if p["equipo_a"]==g else "", p["equipo_a"]==g)
        dibujar_caja(ax, COL["SF_R"], yb, p["equipo_b"], s if p["equipo_b"]==g else "", p["equipo_b"]==g)
        sf_y_R.append((yc, g))
        for ri, (yqf, eqf) in enumerate((qf_y_R[0], qf_y_R[1])):
            linea(ax, COL["QF_R"]-1.6, yqf, COL["SF_R"]+1.55, ya if ri==0 else yb, mx=es_mexico(eqf))

    # ── Final ─────────────────────────────────────────────────────────────────
    yf_L = sf_y_L[0][0]
    yf_R = sf_y_R[0][0]
    yf   = (yf_L + yf_R) / 2

    p = final_p
    g = p["ganador"]
    s = f"{p['score'][0]}-{p['score'][1]}"

    ya_f, yb_f = yf + 0.28, yf - 0.28
    dibujar_caja(ax, COL["FINAL"], ya_f, p["equipo_a"], s if p["equipo_a"]==g else "", p["equipo_a"]==g, w=3.4, h=0.56)
    dibujar_caja(ax, COL["FINAL"], yb_f, p["equipo_b"], s if p["equipo_b"]==g else "", p["equipo_b"]==g, w=3.4, h=0.56)

    # lineas SF → Final
    ysf_L, eq_sf_L = sf_y_L[0]
    ysf_R, eq_sf_R = sf_y_R[0]
    linea(ax, COL["SF_L"]+1.55, ysf_L, COL["FINAL"]-1.7, ya_f, mx=es_mexico(eq_sf_L))
    linea(ax, COL["SF_R"]-1.55, ysf_R, COL["FINAL"]+1.7, ya_f, mx=es_mexico(eq_sf_R))

    # ── Campeon caja central ──────────────────────────────────────────────────
    ycamp = yf - 1.6
    rect_c = FancyBboxPatch((COL["FINAL"]-2.1, ycamp-0.7), 4.2, 1.4,
                             boxstyle="round,pad=0.12",
                             facecolor=VERDE, edgecolor=ORO,
                             linewidth=3, zorder=6)
    ax.add_patch(rect_c)
    ax.text(COL["FINAL"], ycamp + 0.25, "CAMPEON DEL MUNDO", ha='center', va='center',
            color=ORO, fontsize=10, fontweight='bold', zorder=7)
    ax.text(COL["FINAL"], ycamp - 0.22, campeon.upper(), ha='center', va='center',
            color='white', fontsize=16, fontweight='bold', zorder=7)
    ax.plot([COL["FINAL"], COL["FINAL"]], [yb_f - 0.28, ycamp + 0.7],
            color=ORO, linewidth=2.5, zorder=5)

    # ── leyenda y titulo ──────────────────────────────────────────────────────
    leyenda = [
        mpatches.Patch(color=VERDE,   label="Mexico"),
        mpatches.Patch(color='#1f3a5f', label="Equipo ganador"),
        mpatches.Patch(color='#111827', label="Eliminado"),
    ]
    ax.legend(handles=leyenda, loc='lower right', bbox_to_anchor=(0.99, 0.01),
              facecolor=BG_PANEL, edgecolor='#30363d', labelcolor=TEXT_CLR,
              fontsize=9, framealpha=0.9)

    ax.text(14, 17.8, "MEXICO CAMPEON DEL MUNDO 2026",
            ha='center', va='center', color=VERDE,
            fontsize=20, fontweight='bold',
            bbox=dict(boxstyle='round,pad=0.4', facecolor=BG_DARK, edgecolor=VERDE, linewidth=2))
    ax.text(14, 17.1, "bracket completo — R32 a Final",
            ha='center', va='center', color=GRIS, fontsize=10, style='italic')

    plt.tight_layout(pad=0.3)
    guardar_figura(fig, "15_mexico_campeon_bracket.png", dpi=160)
    plt.close()
    print("  -> bracket guardado en outputs/15_mexico_campeon_bracket.png")


if __name__ == "__main__":
    main()
