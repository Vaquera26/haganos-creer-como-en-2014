"""
Descarga los últimos partidos de las 48 selecciones del Mundial 2026
usando la API gratuita de api-sports.io (100 req/día).

SETUP (1 sola vez):
  1. Regístrate gratis en https://dashboard.api-football.com/register
  2. Copia tu API key
  3. Corre: API_FOOTBALL_KEY=tu_key python3 fetch_form_api.py

Los datos se cachean en data/cache/ → solo necesitas correr esto
una vez (o cuando quieras actualizar).
"""

import os, json, time, sys
from pathlib import Path
from datetime import datetime

try:
    import requests
except ImportError:
    sys.exit("Instala requests: pip3 install requests")

# ── Cargar .env ───────────────────────────────────────────────────────────────
_env_path = Path(__file__).parent / ".env"
if _env_path.exists():
    for _line in _env_path.read_text().splitlines():
        _line = _line.strip()
        if _line and not _line.startswith("#") and "=" in _line:
            _k, _v = _line.split("=", 1)
            os.environ.setdefault(_k.strip(), _v.strip())

# ── Config ────────────────────────────────────────────────────────────────────
API_KEY   = os.getenv("API_FOOTBALL_KEY", "")
BASE_URL  = "https://v3.football.api-sports.io"
CACHE_DIR = Path(__file__).parent / "data" / "cache"
CACHE_DIR.mkdir(parents=True, exist_ok=True)

# Plan Free: acceso a temporadas 2022-2024 (no 'last', no 2025/2026)
# 48 equipos × 1 temporada = 48 requests (dentro del límite de 100/día)
TEMPORADAS = [2024]        # temporada más reciente disponible en plan Free
DESDE      = "2024-01-01"  # solo contar desde 2024 para el bonus de forma

# ── Equipos del Mundial 2026 con sus IDs en api-football ─────────────────────
# IDs verificados. Si alguno da 404 el script lo saltará e indicará cuál.
EQUIPOS_WC = {
    # Grupo A
    "México":              16,
    "Corea del Sur":       17,
    "Chequia":            763,
    "Sudáfrica":         1531,
    # Grupo B
    "Canadá":            5529,
    "Suiza":               15,
    "Bosnia-Herzegovina": 1113,
    "Qatar":             1569,
    # Grupo C
    "Brasil":               6,
    "Marruecos":           31,
    "Escocia":           1108,
    "Haití":             2386,
    # Grupo D
    "EUA":               2384,
    "Turquía":            777,
    "Paraguay":          2380,
    "Australia":           20,
    # Grupo E
    "Alemania":            25,
    "Ecuador":           2382,
    "Costa de Marfil":   1501,
    "Curazao":           5530,
    # Grupo F
    "Países Bajos":      1118,
    "Japón":               12,
    "Suecia":               5,
    "Túnez":               28,
    # Grupo G
    "Bélgica":              1,
    "Irán":                22,
    "Egipto":              32,
    "Nueva Zelanda":     4673,
    # Grupo H
    "España":               9,
    "Uruguay":              7,
    "Arabia Saudita":      23,
    "Cabo Verde":        1533,
    # Grupo I
    "Francia":              2,
    "Senegal":             13,
    "Noruega":           1090,
    "Irak":              1567,
    # Grupo J
    "Argentina":           26,
    "Austria":            775,
    "Argelia":           1532,
    "Jordania":          1548,
    # Grupo K
    "Portugal":            27,
    "Colombia":             8,
    "Congo RD":          1508,
    "Uzbekistán":        1568,
    # Grupo L
    "Inglaterra":          10,
    "Croacia":              3,
    "Ghana":             1504,
    "Panamá":              11,
}

# ── Helpers API ───────────────────────────────────────────────────────────────

def headers():
    return {"x-apisports-key": API_KEY, "x-rapidapi-host": "v3.football.api-sports.io"}


def get(endpoint, params=None, cache_key=None, retries=3):
    """GET con caché local y reintento automático en 429."""
    if cache_key:
        path = CACHE_DIR / f"{cache_key}.json"
        if path.exists():
            return json.loads(path.read_text())

    for intento in range(retries):
        r = requests.get(f"{BASE_URL}{endpoint}", headers=headers(), params=params, timeout=15)
        if r.status_code == 429:
            espera = 15 * (intento + 1)
            print(f"    ⏳ rate-limit, esperando {espera}s...")
            time.sleep(espera)
            continue
        r.raise_for_status()
        break
    else:
        raise RuntimeError(f"429 persistente en {endpoint}")

    data = r.json()
    if data.get("errors") and "plan" in str(data["errors"]).lower():
        raise RuntimeError(f"Error de plan: {data['errors']}")

    if cache_key:
        path = CACHE_DIR / f"{cache_key}.json"
        path.write_text(json.dumps(data, ensure_ascii=False, indent=2))

    time.sleep(2.5)   # ~24 req/min → bien dentro del límite
    return data


def buscar_team_id(nombre):
    """Busca el ID correcto si el hardcodeado falla."""
    q = nombre.replace("-", " ")
    data = get("/teams", {"name": q}, cache_key=f"search_{q.replace(' ','_')}")
    equipos = data.get("response", [])
    for eq in equipos:
        t = eq.get("team", {})
        if t.get("national"):
            return t["id"], t["name"]
    return None, None


def fetch_fixtures(team_id, nombre):
    """Trae partidos de las temporadas en TEMPORADAS y los combina."""
    todos = []
    for season in TEMPORADAS:
        data = get(
            "/fixtures",
            {"team": team_id, "season": season},
            cache_key=f"fixtures_{team_id}_{season}",
        )
        todos.extend(data.get("response", []))
        time.sleep(1.2)
    return {"response": todos}


# ── Procesamiento ─────────────────────────────────────────────────────────────

def procesar_fixtures(fixtures_data, nombre_equipo):
    """Convierte la respuesta de la API al formato de forma_reciente.py"""
    partidos = []
    for f in fixtures_data.get("response", []):
        fecha_str = f["fixture"]["date"][:10]
        if fecha_str < DESDE:
            continue

        home = f["teams"]["home"]
        away = f["teams"]["away"]
        score = f["score"]["fulltime"]

        if score["home"] is None:
            continue  # partido sin resultado (no jugado)

        es_local = home["name"] == nombre_equipo or home.get("id") in [None]
        # Determinamos si el equipo es home o away por nombre aproximado
        equipo_es_home = any(
            p in home["name"].lower()
            for p in nombre_equipo.lower().split()[:1]
        )

        if equipo_es_home:
            gf, ga = score["home"], score["away"]
            rival = away["name"]
        else:
            gf, ga = score["away"], score["home"]
            rival = home["name"]

        if gf > ga:
            resultado = "G"
        elif gf == ga:
            resultado = "E"
        else:
            resultado = "P"

        tipo = f["league"]["name"]
        # Normalizar tipo
        if "world cup" in tipo.lower():
            tipo = "WC Qualifier"
        elif "nations league" in tipo.lower():
            tipo = "Nations L"
        elif "friendly" in tipo.lower() or "amistoso" in tipo.lower():
            tipo = "amistoso"
        elif "copa america" in tipo.lower():
            tipo = "Copa Amér"
        elif "gold cup" in tipo.lower():
            tipo = "Gold Cup"
        elif "africa cup" in tipo.lower() or "afcon" in tipo.lower():
            tipo = "AFCON"
        elif "asian cup" in tipo.lower():
            tipo = "Asian Cup"
        elif "euro" in tipo.lower():
            tipo = "EURO"

        partidos.append({
            "fecha":     fecha_str,
            "rival":     rival,
            "gf":        gf,
            "ga":        ga,
            "tipo":      tipo,
            "resultado": resultado,
        })

    return sorted(partidos, key=lambda x: x["fecha"])


def calcular_forma(partidos, n_recientes=15):
    """
    Calcula un bonus Elo basado en rendimiento reciente (desde DESDE).
    Rango: -15 a +15 puntos Elo.
    """
    recientes = partidos[-n_recientes:] if len(partidos) >= n_recientes else partidos
    if not recientes:
        return 0, 0, 0, 0

    g = sum(1 for p in recientes if p["resultado"] == "G")
    e = sum(1 for p in recientes if p["resultado"] == "E")
    d = sum(1 for p in recientes if p["resultado"] == "P")
    n = len(recientes)

    tasa = (g + 0.5 * e) / n   # puntos por partido (escala 0-1)
    # baseline 0.50 → bonus 0; 0.70 → +12; 0.30 → -10
    bonus = round((tasa - 0.50) * 60)
    bonus = max(-15, min(15, bonus))
    return bonus, g, e, d


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    if not API_KEY:
        print("ERROR: no encontré la API key.")
        print("Regístrate gratis en https://dashboard.api-football.com/register")
        print("Luego corre:  API_FOOTBALL_KEY=tu_key python3 fetch_form_api.py")
        sys.exit(1)

    print("=" * 60)
    print("DESCARGA FORMA RECIENTE — 48 SELECCIONES MUNDIAL 2026")
    print(f"Desde: {DESDE}  |  Temporadas: {TEMPORADAS}")
    print("=" * 60)

    # Verificar cuota restante
    status = get("/status", cache_key=None)
    if status.get("errors"):
        sys.exit(f"Error de API: {status['errors']}\nRevisa tu key en https://dashboard.api-football.com")
    resp = status.get("response", {})
    if isinstance(resp, list):
        resp = resp[0] if resp else {}
    sub  = resp.get("subscription", {})
    req  = resp.get("requests", {})
    print(f"\nPlan: {sub.get('plan','?')}  |  Requests hoy: {req.get('current','?')} / {req.get('limit_day','?')}")

    forma_todos = {}
    errores = []

    for nombre, team_id in EQUIPOS_WC.items():
        # Intentar con ID hardcodeado primero
        try:
            data = fetch_fixtures(team_id, nombre)
            if not data.get("response"):
                raise ValueError("sin respuesta")
        except Exception:
            # Fallback: buscar por nombre
            team_id_alt, nombre_api = buscar_team_id(nombre)
            if not team_id_alt:
                errores.append(nombre)
                print(f"  ✗ {nombre:25} — no encontrado, saltando")
                continue
            data = fetch_fixtures(team_id_alt, nombre)

        partidos = procesar_fixtures(data, nombre)
        bonus, g, e, d = calcular_forma(partidos)

        forma_todos[nombre] = {
            "bonus_elo": bonus,
            "partidos": partidos,
            "resumen": {"G": g, "E": e, "P": d, "n": g + e + d},
        }

        signo = f"+{bonus}" if bonus >= 0 else str(bonus)
        print(f"  ✓ {nombre:25}  {g}G {e}E {d}P  bonus={signo:4} Elo")

    # Guardar JSON completo
    out_json = CACHE_DIR / "forma_todos.json"
    out_json.write_text(json.dumps(forma_todos, ensure_ascii=False, indent=2))
    print(f"\n✓ Datos guardados en {out_json}")

    # Generar data/forma_todos.py (importable por la simulación)
    generar_modulo(forma_todos)

    if errores:
        print(f"\n⚠ Equipos no encontrados: {errores}")
        print("  Edita EQUIPOS_WC en fetch_form_api.py con los IDs correctos.")


def generar_modulo(forma_todos):
    """Genera data/forma_todos.py con los bonus Elo de cada equipo."""
    lineas = [
        '"""',
        f"Bonus Elo por forma reciente — generado automáticamente.",
        f"Fuente: api-football.com | Desde: {DESDE}",
        f"Generado: {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        '"""',
        "",
        "# nombre → bonus Elo (rango -15 a +15)",
        "# Positivo = equipo rinde mejor que su ranking sugiere",
        "# Negativo = equipo en mal momento",
        "FORMA_BONUS = {",
    ]
    for nombre, datos in sorted(forma_todos.items()):
        b = datos["bonus_elo"]
        r = datos["resumen"]
        signo = f"+{b}" if b >= 0 else str(b)
        lineas.append(f'    "{nombre}": {b:3},  # {r["G"]}G {r["E"]}E {r["P"]}P  ({signo} Elo)')
    lineas.append("}")
    lineas.append("")

    out = Path(__file__).parent / "data" / "forma_todos.py"
    out.write_text("\n".join(lineas))
    print(f"✓ Módulo generado en {out}")
    print("\nAhora corre: python3 analisis/export_bracket_json.py")
    print("La simulación usará los bonus de forma de TODOS los equipos.")


if __name__ == "__main__":
    main()
