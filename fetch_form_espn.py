"""
Descarga resultados recientes de las 48 selecciones del Mundial 2026
usando la API pública de ESPN — completamente GRATIS, sin key, sin registro.

Uso:
    python3 fetch_form_espn.py

Genera automáticamente data/forma_todos.py con el bonus Elo de cada equipo.
"""

import sys, os, json, time
from pathlib import Path
from datetime import datetime

try:
    import requests
except ImportError:
    sys.exit("Instala requests: pip3 install requests")

BASE   = "https://site.api.espn.com/apis/site/v2/sports/soccer"
CACHE  = Path(__file__).parent / "data" / "cache_espn"
CACHE.mkdir(parents=True, exist_ok=True)
DESDE  = "2024-01-01"
H      = {"User-Agent": "Mozilla/5.0", "Accept": "application/json"}

# ── ESPN team IDs + confederación ────────────────────────────────────────────
EQUIPOS = {
    # Grupo A
    "México":              {"id": 203,   "conf": "CONCACAF"},
    "Corea del Sur":       {"id": 451,   "conf": "AFC"},
    "Chequia":             {"id": 450,   "conf": "UEFA"},
    "Sudáfrica":           {"id": 467,   "conf": "CAF"},
    # Grupo B
    "Canadá":              {"id": 206,   "conf": "CONCACAF"},
    "Suiza":               {"id": 475,   "conf": "UEFA"},
    "Bosnia-Herzegovina":  {"id": 452,   "conf": "UEFA"},
    "Qatar":               {"id": 4398,  "conf": "AFC"},
    # Grupo C
    "Brasil":              {"id": 205,   "conf": "CONMEBOL"},
    "Marruecos":           {"id": 2869,  "conf": "CAF"},
    "Escocia":             {"id": 580,   "conf": "UEFA"},
    "Haití":               {"id": 2654,  "conf": "CONCACAF"},
    # Grupo D
    "EUA":                 {"id": 660,   "conf": "CONCACAF"},
    "Turquía":             {"id": 484,   "conf": "UEFA"},
    "Paraguay":            {"id": 210,   "conf": "CONMEBOL"},
    "Australia":           {"id": 628,   "conf": "AFC"},
    # Grupo E
    "Alemania":            {"id": 481,   "conf": "UEFA"},
    "Ecuador":             {"id": 209,   "conf": "CONMEBOL"},
    "Costa de Marfil":     {"id": 4789,  "conf": "CAF"},
    "Curazao":             {"id": 11678, "conf": "CONCACAF"},
    # Grupo F
    "Países Bajos":        {"id": 449,   "conf": "UEFA"},
    "Japón":               {"id": 627,   "conf": "AFC"},
    "Suecia":              {"id": 466,   "conf": "UEFA"},
    "Túnez":               {"id": 659,   "conf": "CAF"},
    # Grupo G
    "Bélgica":             {"id": 459,   "conf": "UEFA"},
    "Irán":                {"id": 469,   "conf": "AFC"},
    "Egipto":              {"id": 2620,  "conf": "CAF"},
    "Nueva Zelanda":       {"id": 2666,  "conf": "AFC"},
    # Grupo H
    "España":              {"id": 164,   "conf": "UEFA"},
    "Uruguay":             {"id": 212,   "conf": "CONMEBOL"},
    "Arabia Saudita":      {"id": 655,   "conf": "AFC"},
    "Cabo Verde":          {"id": 2597,  "conf": "CAF"},
    # Grupo I
    "Francia":             {"id": 478,   "conf": "UEFA"},
    "Senegal":             {"id": 654,   "conf": "CAF"},
    "Noruega":             {"id": 464,   "conf": "UEFA"},
    "Irak":                {"id": 4375,  "conf": "AFC"},
    # Grupo J
    "Argentina":           {"id": 202,   "conf": "CONMEBOL"},
    "Austria":             {"id": 474,   "conf": "UEFA"},
    "Argelia":             {"id": 624,   "conf": "CAF"},
    "Jordania":            {"id": 2917,  "conf": "AFC"},
    # Grupo K
    "Portugal":            {"id": 482,   "conf": "UEFA"},
    "Colombia":            {"id": 208,   "conf": "CONMEBOL"},
    "Congo RD":            {"id": 2850,  "conf": "CAF"},
    "Uzbekistán":          {"id": 2570,  "conf": "AFC"},
    # Grupo L
    "Inglaterra":          {"id": 448,   "conf": "UEFA"},
    "Croacia":             {"id": 477,   "conf": "UEFA"},
    "Ghana":               {"id": 4469,  "conf": "CAF"},
    "Panamá":              {"id": 2659,  "conf": "CONCACAF"},
}

# Ligas ESPN por confederación
LIGAS = {
    "CONCACAF": ["concacaf.nations.league", "concacaf.gold", "fifa.worldq.concacaf", "fifa.friendly"],
    "CONMEBOL": ["fifa.worldq.conmebol", "conmebol.copa", "fifa.friendly"],
    "UEFA":     ["uefa.nations", "fifa.worldq.uefa", "fifa.friendly"],
    "CAF":      ["africa.nations", "fifa.worldq.caf", "fifa.friendly"],
    "AFC":      ["afc.asian.cup", "fifa.worldq.afc", "fifa.friendly"],
}


# ── HTTP con caché ────────────────────────────────────────────────────────────

def get(url, cache_key):
    path = CACHE / f"{cache_key}.json"
    if path.exists():
        return json.loads(path.read_text())
    r = requests.get(url, headers=H, timeout=10)
    if r.status_code != 200 or not r.text.strip():
        return {}
    data = r.json()
    path.write_text(json.dumps(data, ensure_ascii=False))
    time.sleep(0.3)
    return data


# ── Fetch partidos de un equipo ───────────────────────────────────────────────

def fetch_equipo(nombre, info):
    team_id = info["id"]
    conf    = info["conf"]
    ligas   = LIGAS[conf]

    todos = []
    for liga in ligas:
        ckey = f"{team_id}_{liga.replace('.','_')}"
        data = get(f"{BASE}/{liga}/teams/{team_id}/schedule", ckey)
        for e in data.get("events", []):
            fecha = e.get("date", "")[:10]
            if fecha < DESDE:
                continue
            comps = e.get("competitions", [{}])[0].get("competitors", [])
            if len(comps) < 2:
                continue
            home, away = comps[0], comps[1]

            def gol(c):
                sc = c.get("score", {})
                if isinstance(sc, dict):
                    return sc.get("displayValue", None)
                return str(sc) if sc is not None else None

            gh, ga_val = gol(home), gol(away)
            if gh is None or ga_val is None:
                continue

            try:
                gh, ga_val = int(float(gh)), int(float(ga_val))
            except (ValueError, TypeError):
                continue

            es_home = str(home.get("team", {}).get("id", "")) == str(team_id)
            gf = gh if es_home else ga_val
            gc = ga_val if es_home else gh
            rival = (away if es_home else home).get("team", {}).get("displayName", "?")

            if gf > gc:   res = "G"
            elif gf == gc: res = "E"
            else:          res = "P"

            todos.append({
                "fecha": fecha,
                "rival": rival,
                "gf": gf,
                "ga": gc,
                "liga": liga,
                "resultado": res,
            })

    # Deduplicar por fecha+rival (mismo partido puede aparecer en varias ligas)
    vistos = set()
    unicos = []
    for p in sorted(todos, key=lambda x: x["fecha"]):
        key = (p["fecha"], p["rival"][:6])
        if key not in vistos:
            vistos.add(key)
            unicos.append(p)

    return unicos


# ── Cálculo de bonus Elo ──────────────────────────────────────────────────────

def calcular_forma(partidos, n=15):
    recientes = partidos[-n:] if len(partidos) >= n else partidos
    if not recientes:
        return 0, 0, 0, 0
    g = sum(1 for p in recientes if p["resultado"] == "G")
    e = sum(1 for p in recientes if p["resultado"] == "E")
    d = sum(1 for p in recientes if p["resultado"] == "P")
    n_real = len(recientes)
    tasa = (g + 0.5 * e) / n_real
    bonus = round((tasa - 0.50) * 60)
    return max(-15, min(15, bonus)), g, e, d


# ── Generar módulo Python importable ─────────────────────────────────────────

def generar_modulo(forma_todos):
    lineas = [
        '"""',
        f"Bonus Elo por forma reciente — ESPN API (gratuita, sin key).",
        f"Desde: {DESDE} | Generado: {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        '"""',
        "",
        "FORMA_BONUS = {",
    ]
    for nombre, d in sorted(forma_todos.items()):
        b = d["bonus_elo"]
        r = d["resumen"]
        signo = f"+{b}" if b >= 0 else str(b)
        lineas.append(
            f'    "{nombre}": {b:4},  # {r["G"]}G {r["E"]}E {r["P"]}P  '
            f'en {r["n"]} partidos desde {DESDE}  ({signo} Elo)'
        )
    lineas += ["}", ""]
    out = Path(__file__).parent / "data" / "forma_todos.py"
    out.write_text("\n".join(lineas))
    return out


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    print("=" * 62)
    print("FORMA RECIENTE — 48 SELECCIONES | ESPN API (gratis, sin key)")
    print(f"Desde: {DESDE}")
    print("=" * 62)

    forma_todos = {}

    for nombre, info in EQUIPOS.items():
        partidos = fetch_equipo(nombre, info)
        bonus, g, e, d = calcular_forma(partidos)
        forma_todos[nombre] = {
            "bonus_elo": bonus,
            "resumen": {"G": g, "E": e, "P": d, "n": g + e + d},
        }
        signo = f"+{bonus}" if bonus >= 0 else str(bonus)
        print(f"  {nombre:25}  {g}G {e}E {d}P  ({len(partidos):2} total)  bonus={signo:4} Elo")

    out = generar_modulo(forma_todos)
    print(f"\n✓ Guardado en {out}")
    print("Corre: python3 analisis/export_bracket_json.py")


if __name__ == "__main__":
    main()
