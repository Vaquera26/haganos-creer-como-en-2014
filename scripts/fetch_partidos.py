"""
Descarga todos los partidos de Mexico (senior) desde 2023 hasta hoy.
Usa la API de API-Football (api-sports.io).

Registro GRATUITO: https://www.api-football.com/
Limite free tier: 100 llamadas/dia

Uso:
    export APIFOOTBALL_KEY="tu_api_key_aqui"
    python scripts/fetch_partidos.py

Genera: data/cache/mexico_partidos_raw.json
         data/cache/mexico_partidos_limpio.csv
"""

import os
import json
import time
import requests
import pandas as pd
from pathlib import Path
from datetime import date

ROOT = Path(__file__).parent.parent
CACHE_DIR = ROOT / "data" / "cache"
CACHE_DIR.mkdir(parents=True, exist_ok=True)

API_KEY = os.environ.get("APIFOOTBALL_KEY", "")
BASE_URL = "https://v3.football.api-sports.io"

# Mexico senior = ID 262 en API-Football
MEXICO_ID = 262

HEADERS = {
    "x-rapidapi-key": API_KEY,
    "x-rapidapi-host": "v3.football.api-sports.io",
}


def llamar_api(endpoint, params):
    if not API_KEY:
        raise ValueError(
            "Falta APIFOOTBALL_KEY. Registrate gratis en https://www.api-football.com/ "
            "y ejecuta: export APIFOOTBALL_KEY='tu_key'"
        )
    url = f"{BASE_URL}/{endpoint}"
    resp = requests.get(url, headers=HEADERS, params=params, timeout=15)
    resp.raise_for_status()
    data = resp.json()
    if data.get("errors"):
        raise RuntimeError(f"API error: {data['errors']}")
    return data["response"]


def fetch_temporada(año):
    print(f"Descargando partidos {año}...")
    # tipo 'national' filtra selecciones nacionales
    resultados = llamar_api("fixtures", {
        "team": MEXICO_ID,
        "season": año,
    })
    time.sleep(0.5)  # respetar rate limit
    return resultados


def normalizar(fixture):
    f = fixture["fixture"]
    teams = fixture["teams"]
    goals = fixture["goals"]
    league = fixture["league"]

    home = teams["home"]["name"]
    away = teams["away"]["name"]
    mexico_local = home == "Mexico"

    gf = goals["home"] if mexico_local else goals["away"]
    ga = goals["away"] if mexico_local else goals["home"]
    rival = away if mexico_local else home

    if gf is None or ga is None:
        resultado = None
    elif gf > ga:
        resultado = "G"
    elif gf == ga:
        resultado = "E"
    else:
        resultado = "P"

    return {
        "fixture_id": f["id"],
        "fecha": f["date"][:10],
        "rival": rival,
        "gf": gf,
        "ga": ga,
        "resultado": resultado,
        "tipo": league["name"],
        "sede": "H" if mexico_local else "A",
        "estadio": f.get("venue", {}).get("name", ""),
    }


def main():
    año_actual = date.today().year
    años = list(range(2023, año_actual + 1))

    todos = []
    for año in años:
        partidos_año = fetch_temporada(año)
        todos.extend(partidos_año)

    raw_path = CACHE_DIR / "mexico_partidos_raw.json"
    with open(raw_path, "w", encoding="utf-8") as fh:
        json.dump(todos, fh, ensure_ascii=False, indent=2)
    print(f"Raw guardado: {raw_path} ({len(todos)} partidos)")

    normalizados = [normalizar(p) for p in todos]
    df = pd.DataFrame(normalizados)
    df = df.dropna(subset=["resultado"])
    df = df.sort_values("fecha").reset_index(drop=True)

    csv_path = CACHE_DIR / "mexico_partidos_limpio.csv"
    df.to_csv(csv_path, index=False)
    print(f"CSV limpio: {csv_path} ({len(df)} partidos con resultado)")

    print("\nResumen:")
    print(df.groupby("resultado").size().to_string())
    print(f"\nGoles marcados: {df['gf'].sum()}")
    print(f"Goles recibidos: {df['ga'].sum()}")

    return df


if __name__ == "__main__":
    main()
