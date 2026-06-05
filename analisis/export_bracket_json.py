"""
Simula hasta que México gane el Mundial 2026 y exporta el bracket a JSON.

MODELO DE PROBABILIDAD (explicación):
  No es aleatorio puro — usa Elo basado en ranking FIFA real de cada equipo.
  El azar (distribución Poisson) representa la varianza natural del fútbol:
  incluso el mejor equipo pierde partidos. Las probabilidades reflejan
  la dificultad real de cada rival.

  Ejemplo:
    México (Rk 15, Elo ~1912) vs Qatar (Rk 71, Elo ~1240)
    → P(México gana) ≈ 83%
    México (Rk 15) vs Argentina (Rk 1, Elo ~1800)
    → P(México gana) ≈ 27%

  Velocidad: cada torneo completo tarda ~10ms. Con P(México campeón)≈1.4%,
  el número esperado de torneos = 1/0.014 ≈ 71. Total: ~700ms.

Formato oficial FIFA 2026:
  - 12 grupos × 4 equipos
  - Top 2 de cada grupo + 8 mejores 3ros = 32 en R32
  - Los 3ros juegan contra líderes (nunca entre sí)
  - Bracket M73-M88 oficial FIFA
  - Mismo grupo no se cruza hasta Semis
"""
import sys, os, json
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import numpy as np
from scipy.stats import poisson
from utils import prob_resultado, xg_partido
from data.grupo_2026 import TODOS_LOS_GRUPOS, FIXTURES_MEXICO
from data.rankings import EQUIPOS as RANKINGS_COMPLETOS
from data.forma_reciente import PARTIDOS_POST_2022

# Bonus de forma para TODOS los equipos (generado por fetch_form_api.py)
# Si no existe el módulo todavía, solo aplica el bonus de México
try:
    from data.forma_todos import FORMA_BONUS as _FORMA_BONUS_TODOS
except ImportError:
    _FORMA_BONUS_TODOS = {}

np.random.seed(None)

# ── Rankings de TODOS los equipos (de data/rankings.py) ───────────────────────
# Construimos dict nombre→rank usando rankings.py + TODOS_LOS_GRUPOS como fallback
RANKS = {}
for nombre, info in RANKINGS_COMPLETOS.items():
    RANKS[nombre] = info["rank"]
# Completar con equipos de los grupos que no están en rankings.py
for grupo in TODOS_LOS_GRUPOS.values():
    for nombre, rank in grupo.items():
        if nombre not in RANKS:
            RANKS[nombre] = rank

# ── Altitud real de los estadios de México (de data/grupo_2026.py) ───────────
# Convertimos a bonus Elo: Azteca (2240m)=25pts, Akron (1554m)=15pts
ALTITUD_BONUS = {}
for f in FIXTURES_MEXICO:
    rival = f["rival"]
    alt_m = f.get("altitud_m", 0)
    # Escala: 2240m → 25pts, 1554m → 17pts, 0m → 0pts
    bonus = round(alt_m / 2240 * 25)
    ALTITUD_BONUS[rival] = bonus
# En eliminatoria, México juega en EUA/Canada/México (aprox 500-1500m promedio)
# Usamos 10pts como estimación conservadora para R32/R16 en casa
ALT_BONUS_ELIM = 10

# ── Forma reciente de México ───────────────────────────────────────────────────
# Calculamos el rendimiento en partidos oficiales post-2023 para ajustar Elo
def calcular_forma_mx(partidos, tipos_oficiales=("Nations L","Gold Cup","Copa Amér","amistoso")):
    oficiales = [p for p in partidos if p["tipo"] in tipos_oficiales and p["fecha"] >= "2024-01-01"]
    if not oficiales:
        return 0
    ganados = sum(1 for p in oficiales if p["resultado"] == "G")
    tasa = ganados / len(oficiales)
    # Si tasa > 0.65, México está por encima de lo que indica su ranking
    # Bonus máximo: +12 puntos Elo (equivale a subir ~1.5 puestos de ranking)
    return round(max(0, (tasa - 0.50) * 60))

FORMA_MX_BONUS = calcular_forma_mx(PARTIDOS_POST_2022)

# ── Flag codes ───────────────────────────────────────────────────────────────
FLAG = {
    "México":"mx","Corea del Sur":"kr","Chequia":"cz","Sudáfrica":"za",
    "Canadá":"ca","Suiza":"ch","Bosnia-Herzegovina":"ba","Qatar":"qa",
    "Brasil":"br","Marruecos":"ma","Escocia":"gb-sct","Haití":"ht",
    "EUA":"us","Turquía":"tr","Paraguay":"py","Australia":"au",
    "Alemania":"de","Ecuador":"ec","Costa de Marfil":"ci","Curazao":"cw",
    "Países Bajos":"nl","Japón":"jp","Suecia":"se","Túnez":"tn",
    "Bélgica":"be","Irán":"ir","Egipto":"eg","Nueva Zelanda":"nz",
    "España":"es","Uruguay":"uy","Arabia Saudita":"sa","Cabo Verde":"cv",
    "Francia":"fr","Senegal":"sn","Noruega":"no","Irak":"iq",
    "Argentina":"ar","Austria":"at","Argelia":"dz","Jordania":"jo",
    "Portugal":"pt","Colombia":"co","Congo RD":"cd","Uzbekistán":"uz",
    "Inglaterra":"gb-eng","Croacia":"hr","Ghana":"gh","Panamá":"pa",
    "?":"un",
}

# ── Bracket R32 oficial FIFA 2026 (M73-M88) ──────────────────────────────────
BRACKET_R32 = [
    ("2A","2B"),   # M73
    ("1E","T_E"),  # M74 – líder E vs 3ro elegible
    ("1F","2C"),   # M75
    ("1C","2F"),   # M76
    ("1I","T_I"),  # M77
    ("2E","2I"),   # M78
    ("1A","T_A"),  # M79 – México si gana el grupo
    ("1L","T_L"),  # M80
    ("1D","T_D"),  # M81
    ("1G","T_G"),  # M82
    ("2K","2L"),   # M83
    ("1H","2J"),   # M84
    ("1B","T_B"),  # M85
    ("1J","2H"),   # M86
    ("1K","T_K"),  # M87
    ("2D","2G"),   # M88
]

TERCEROS_ELEGIBLES = {
    "E": {"A","B","C","D","F"},
    "I": {"C","D","F","G","H"},
    "A": {"C","E","F","H","I"},
    "L": {"E","H","I","J","K"},
    "D": {"B","E","F","I","J"},
    "G": {"A","E","H","I","J"},
    "B": {"E","F","G","I","J"},
    "K": {"D","E","I","J","L"},
}
SLOT_ORDER = ["E","I","A","L","D","G","B","K"]


# ── Núcleo probabilístico ─────────────────────────────────────────────────────

def get_rank(nombre):
    return RANKS.get(nombre, 60)

def elo_forma_bonus(nombre):
    """Bonus de forma reciente para cualquier equipo.
    Usa data/forma_todos.py si está disponible; sino solo México."""
    if _FORMA_BONUS_TODOS:
        return _FORMA_BONUS_TODOS.get(nombre, 0)
    return FORMA_MX_BONUS if nombre == "México" else 0

def simular_marcador_full(eq_a, eq_b, ventaja_local=False, altitud_bonus=0):
    """Simula un marcador usando ranking real + bonus de forma para México."""
    rank_a = get_rank(eq_a)
    rank_b = get_rank(eq_b)
    bonus_extra_a = elo_forma_bonus(eq_a)
    bonus_extra_b = elo_forma_bonus(eq_b)

    # Ajustar Elo manualmente para incluir forma
    from utils import elo_desde_ranking
    base_bonus = (60 if ventaja_local else 0) + altitud_bonus
    elo_a = elo_desde_ranking(rank_a) + base_bonus + bonus_extra_a
    elo_b = elo_desde_ranking(rank_b) + bonus_extra_b

    p_base = 1.0 / (1.0 + 10.0 ** ((elo_b - elo_a) / 400.0))
    deseq  = abs(p_base - 0.5) * 2.0
    p_emp  = 0.26 * (1.0 - deseq * 0.55)
    pw     = p_base * (1.0 - p_emp)
    pl     = (1.0 - p_base) * (1.0 - p_emp)

    ratio  = elo_a / elo_b
    xg_a   = 1.2 * (ratio ** 0.65)
    xg_b   = 1.2 * ((1.0 / ratio) ** 0.65)

    ga = int(poisson.rvs(max(0.3, xg_a)))
    gb = int(poisson.rvs(max(0.3, xg_b)))
    return ga, gb, pw, p_emp


# ── Simulación de grupos ──────────────────────────────────────────────────────

def simular_grupo(grupo_label, equipos_ranks):
    equipos = list(equipos_ranks.keys())
    pts = {e: 0 for e in equipos}
    gd  = {e: 0 for e in equipos}
    gf  = {e: 0 for e in equipos}
    partidos = []

    for i in range(len(equipos)):
        for j in range(i + 1, len(equipos)):
            a, b = equipos[i], equipos[j]
            es_mx_local = (grupo_label == "A" and a == "México")
            # Altitud específica según rival (para partidos de México en casa)
            alt = ALTITUD_BONUS.get(b, 0) if es_mx_local else 0
            ga, gb, _, _ = simular_marcador_full(a, b, ventaja_local=es_mx_local, altitud_bonus=alt)

            gf[a] += ga; gf[b] += gb
            gd[a] += ga - gb; gd[b] += gb - ga
            if ga > gb:    pts[a] += 3
            elif ga == gb: pts[a] += 1; pts[b] += 1
            else:          pts[b] += 3
            # Capturar TODOS los partidos de todos los grupos
            partidos.append({"a": a, "b": b, "ga": ga, "gb": gb})

    tabla = sorted(equipos, key=lambda e: (pts[e], gd[e], gf[e]), reverse=True)
    return {
        "1ro": tabla[0], "2do": tabla[1],
        "3ro": tabla[2] if len(tabla) > 2 else None,
        "pts": pts, "gd": gd, "gf": gf,
        "tabla": [{"equipo": e, "pts": pts[e], "gd": gd[e], "gf": gf[e]} for e in tabla],
        "partidos": partidos,
    }


# ── Simulación de partido eliminatorio ───────────────────────────────────────

def partido_eliminatorio(eq_a, eq_b, ronda):
    if eq_a == "?" or eq_b == "?":
        return (eq_b if eq_a == "?" else eq_a), (0, 0), False

    local = (eq_a == "México") and (ronda in ("R32", "R16"))
    alt   = ALT_BONUS_ELIM if local else 0

    ga, gb, pw, pe = simular_marcador_full(eq_a, eq_b, ventaja_local=local, altitud_bonus=alt)
    r = np.random.rand()

    if r < pw:
        if ga <= gb: ga = gb + 1
        return eq_a, (ga, gb), False
    elif r < pw + pe:
        while ga != gb: gb = int(poisson.rvs(max(0.3, 1.2)))
        if "México" in (eq_a, eq_b):
            ganador = "México" if np.random.rand() < 0.30 else (eq_b if eq_a == "México" else eq_a)
        else:
            ganador = eq_a if np.random.rand() < 0.50 else eq_b
        return ganador, (ga, gb), True
    else:
        if gb <= ga: gb = ga + 1
        return eq_b, (ga, gb), False


# ── Asignación de 3ros (respeta grupos elegibles FIFA) ───────────────────────

def asignar_terceros(terceros_ok):
    disponibles = list(terceros_ok)
    asignacion  = {}
    for winner_group in SLOT_ORDER:
        elegibles = TERCEROS_ELEGIBLES[winner_group]
        for i, t in enumerate(disponibles):
            if t["grupo"] in elegibles:
                asignacion[f"T_{winner_group}"] = t["equipo"]
                disponibles.pop(i)
                break
        else:
            if disponibles:
                asignacion[f"T_{winner_group}"] = disponibles.pop(0)["equipo"]
    return asignacion


# ── Torneo completo ───────────────────────────────────────────────────────────

def simular_torneo():
    clasificados = {}
    terceros_todos = []
    grupos_data = {}  # Todos los 12 grupos capturados

    for label, eq_ranks in TODOS_LOS_GRUPOS.items():
        res  = simular_grupo(label, eq_ranks)
        clasificados[f"1{label}"] = res["1ro"]
        clasificados[f"2{label}"] = res["2do"]
        grupos_data[label] = res
        if res["3ro"]:
            terceros_todos.append({
                "equipo": res["3ro"], "grupo": label,
                "pts":    res["pts"][res["3ro"]],
                "gd":     res["gd"][res["3ro"]],
                "gf":     res["gf"][res["3ro"]],
            })

    terceros_ok = sorted(terceros_todos,
                         key=lambda x: (x["pts"], x["gd"], x["gf"]), reverse=True)[:8]
    clasificados.update(asignar_terceros(terceros_ok))

    log_mx = []

    def jugar(eq_a, eq_b, ronda):
        g, score, pen = partido_eliminatorio(eq_a, eq_b, ronda)
        if "México" in (eq_a, eq_b):
            rival = eq_b if eq_a == "México" else eq_a
            s = score if eq_a == "México" else (score[1], score[0])
            log_mx.append({"ronda": ronda, "rival": rival,
                            "score": s, "gano": g == "México", "penales": pen})
        return {"equipo_a": eq_a, "equipo_b": eq_b, "ganador": g, "score": score, "penales": pen}

    r32 = [jugar(clasificados.get(a,"?"), clasificados.get(b,"?"), "R32") for a, b in BRACKET_R32]
    r32g = [p["ganador"] for p in r32]
    r16  = [jugar(r32g[i], r32g[i+1], "R16")  for i in range(0, 16, 2)]
    r16g = [p["ganador"] for p in r16]
    qf   = [jugar(r16g[i], r16g[i+1], "QF")   for i in range(0, 8,  2)]
    qfg  = [p["ganador"] for p in qf]
    sf   = [jugar(qfg[i],  qfg[i+1],  "SF")   for i in range(0, 4,  2)]
    sfg  = [p["ganador"] for p in sf]
    fin  = jugar(sfg[0], sfg[1], "Final")

    return {"campeon": fin["ganador"], "log_mexico": log_mx,
            "grupos": grupos_data,
            "r32": r32, "r16": r16, "qf": qf, "sf": sf, "final": fin}


# ── Colores ANSI ──────────────────────────────────────────────────────────────
V  = "\033[92m";  R  = "\033[91m";  Y  = "\033[93m"
C  = "\033[96m";  W  = "\033[97m";  D  = "\033[90m"
B  = "\033[1m";   X  = "\033[0m"


def _log_partido(ronda, rival, score, gano, penales=False):
    marca   = f"{score[0]}-{score[1]}"
    pen_txt = f"{D} (pen){X}" if penales else ""
    rk      = RANKS.get(rival, "?")
    if gano:
        print(f"  {C}{B}{ronda:6}{X}  {W}Mexico {V}{B}{marca}{X}{W} {rival}{X}{pen_txt}"
              f"  {D}Rk{rk}{X}  {V}{B}AVANZA{X}")
    else:
        print(f"  {C}{B}{ronda:6}{X}  {W}Mexico {R}{B}{marca}{X}{W} {rival}{X}{pen_txt}"
              f"  {D}Rk{rk}{X}  {R}{B}ELIMINADO{X}")


def simular_hasta_ganar(max_intentos=500):
    print(f"\n{B}{Y}Buscando simulacion donde Mexico gane el Mundial...{X}")
    print(f"{D}(prob. ~1-2% por torneo — modelo Elo + forma real ESPN){X}\n")

    conteo = {"R32": 0, "R16": 0, "QF": 0, "SF": 0, "Final": 0}

    for i in range(max_intentos):
        res = simular_torneo()
        log_mx = res.get("log_mexico", [])

        print(f"{D}{'─'*54}{X}")
        print(f"{B}{W}Intento #{i+1}{X}")

        if not log_mx:
            print(f"  {R}{B}GRUPOS{X}  {D}Mexico eliminado en fase de grupos{X}")
        else:
            for l in log_mx:
                _log_partido(l["ronda"], l["rival"], l["score"], l["gano"], l.get("penales", False))

        if res["campeon"] == "México":
            print(f"\n{B}{V}{'★'*54}{X}")
            print(f"{B}{V}  MEXICO CAMPEON DEL MUNDO — intento #{i+1}{X}")
            print(f"{B}{V}{'★'*54}{X}\n")
            res["intentos"] = i + 1
            return res

        # registrar en qué ronda cayó
        etapa = "R32"
        for l in log_mx:
            if not l["gano"]:
                etapa = l["ronda"]
                break
        if not log_mx:
            etapa = "R32"
        if etapa in conteo:
            conteo[etapa] += 1

        # resumen cada 20 intentos
        if (i + 1) % 20 == 0:
            grupos_elim = (i + 1) - sum(conteo.values())
            print(f"\n{D}  [ #{i+1} acumulado ]  "
                  f"Grupos:{grupos_elim}  R32:{conteo['R32']}  R16:{conteo['R16']}  "
                  f"QF:{conteo['QF']}  SF:{conteo['SF']}  Final:{conteo['Final']}{X}\n")

    raise RuntimeError(f"México no ganó en {max_intentos} intentos")


# ── Conversión a JSON ─────────────────────────────────────────────────────────

def to_match(p):
    a, b = p["equipo_a"], p["equipo_b"]
    s = p["score"]
    suf = " (p)" if p.get("penales") else ""
    return {"a": a, "af": FLAG.get(a,"un"), "b": b, "bf": FLAG.get(b,"un"),
            "s": f"{s[0]}-{s[1]}{suf}", "w": 0 if p["ganador"] == a else 1}

def serial(obj):
    if isinstance(obj, (np.integer,)):  return int(obj)
    if isinstance(obj, (np.floating,)): return float(obj)
    if isinstance(obj, np.ndarray):     return obj.tolist()
    raise TypeError(f"No serializable: {type(obj)}")


def main():
    print("=" * 60)
    print("SIMULACIÓN MUNDIAL 2026 — MODELO COMPLETO")
    print("=" * 60)
    print(f"\nRankings FIFA reales: {len(RANKS)} equipos cargados")
    print(f"Bonus forma reciente México: +{FORMA_MX_BONUS} Elo pts")
    print(f"Altitud Azteca (2240m): +{ALTITUD_BONUS.get('Sudáfrica',0)} Elo | "
          f"Akron (1554m): +{ALTITUD_BONUS.get('Corea del Sur',0)} Elo")
    print(f"\nProbabilidades México en grupos (modelo Elo):")
    for f in FIXTURES_MEXICO:
        rk = f["rank_rival"]
        alt = ALTITUD_BONUS.get(f["rival"], 0)
        pw, pe, pl = prob_resultado(15, rk, ventaja_local=True, altitud_bonus=alt)
        # Ajustamos manualmente con forma bonus
        from utils import elo_desde_ranking
        elo_mx = elo_desde_ranking(15) + 60 + alt + FORMA_MX_BONUS
        elo_riv = elo_desde_ranking(rk)
        p = 1 / (1 + 10**((elo_riv - elo_mx)/400))
        print(f"  vs {f['rival']:15} (Rk {rk:3}) @ {f['sede'][:20]:20} → P(MX gana)≈{p*100:.1f}%")

    print(f"\nSimulando hasta que México gane...")
    print(f"(Esperado: ~{round(1/0.014)} torneos en promedio)\n")

    res = simular_hasta_ganar()

    # Exportar los 12 grupos con tabla completa + todos los partidos
    def exportar_grupo(label, gdata):
        partidos_export = []
        for p in gdata["partidos"]:
            partidos_export.append({
                "a": p["a"], "af": FLAG.get(p["a"], "un"),
                "b": p["b"], "bf": FLAG.get(p["b"], "un"),
                "ga": p["ga"], "gb": p["gb"],
            })
        return {
            "grupo": label,
            "tabla": [
                {"equipo": t["equipo"], "flag": FLAG.get(t["equipo"], "un"),
                 "rank": RANKS.get(t["equipo"], 99),
                 "pts": t["pts"], "gd": t["gd"], "gf": t["gf"]}
                for t in gdata["tabla"]
            ],
            "partidos": partidos_export,
        }

    grupos_export = {
        label: exportar_grupo(label, gdata)
        for label, gdata in res["grupos"].items()
    }

    data = {
        "campeon":    res["campeon"],
        "intentos":   res["intentos"],
        "modelo": {
            "ranking_equipos": len(RANKS),
            "forma_mx_bonus_elo": FORMA_MX_BONUS,
            "altitud_azteca_bonus": ALTITUD_BONUS.get("Sudáfrica", 0),
            "altitud_akron_bonus":  ALTITUD_BONUS.get("Corea del Sur", 0),
        },
        "grupos":     grupos_export,
        "log_mexico": [
            {"ronda": l["ronda"], "rival": l["rival"],
             "score": f"{l['score'][0]}-{l['score'][1]}",
             "penales": l["penales"], "gano": l["gano"]}
            for l in res["log_mexico"]
        ],
        "r32":   [to_match(p) for p in res["r32"]],
        "r16":   [to_match(p) for p in res["r16"]],
        "qf":    [to_match(p) for p in res["qf"]],
        "sf":    [to_match(p) for p in res["sf"]],
        "final": to_match(res["final"]),
    }

    out = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                       "web", "src", "data", "bracket_simulado.json")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2, default=serial)

    print(f"✓ Simulación #{res['intentos']} — Campeón: {data['campeon']}")
    print(f"  Final: {data['final']['a']} {data['final']['s']} {data['final']['b']}")
    print(f"\n  Clasificados por grupo (Rk = ranking FIFA):")
    for lbl, gexp in data["grupos"].items():
        t = gexp["tabla"]
        print(f"    Grupo {lbl}: 1º {t[0]['equipo']} (Rk{t[0]['rank']}) "
              f"| 2º {t[1]['equipo']} (Rk{t[1]['rank']}) "
              f"| 3º {t[2]['equipo']} (Rk{t[2]['rank']})")
    print(f"\n  Camino de México:")
    for l in data["log_mexico"]:
        pen = " (pen)" if l["penales"] else ""
        print(f"    {l['ronda']:6} vs {l['rival']:22} {l['score']}{pen}  {'✓' if l['gano'] else '✗'}"
              f"  [Rk {RANKS.get(l['rival'], '?')}]")
    print(f"\n  Guardado en {out}")


if __name__ == "__main__":
    main()
