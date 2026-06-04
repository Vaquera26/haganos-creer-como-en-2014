"""
Ejecuta los 13 analisis en secuencia y guarda todas las imagenes en outputs/.
Tiempo estimado: 2-4 minutos (el analisis 01 corre 100k simulaciones).
"""

import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).parent

SCRIPTS = [
    ("01", "analisis/01_ruta_quinto_partido.py",   "La Ruta del Quinto Partido"),
    ("02", "analisis/02_mapa_dificultad.py",        "Mapa de Dificultad del Camino"),
    ("03", "analisis/03_probabilidad_partido.py",   "Probabilidad por Partido"),
    ("04", "analisis/04_escenarios_clasificacion.py","Escenarios de Clasificacion"),
    ("05", "analisis/05_indice_riesgo.py",           "Indice de Riesgo"),
    ("06", "analisis/06_arbol_caminos.py",           "Arbol de Caminos Posibles"),
    ("07", "analisis/07_mexico_vs_historia.py",      "Mexico vs su Historia"),
    ("08", "analisis/08_efecto_localia.py",          "Efecto de Localia"),
    ("09", "analisis/09_radiografia_grupo.py",       "Radiografia del Grupo A"),
    ("10", "analisis/10_puntos_necesarios.py",       "Puntos Necesarios para Avanzar"),
    ("11", "analisis/11_probabilidad_penales.py",    "Probabilidad de Penales"),
    ("12", "analisis/12_goles_esperados.py",         "Modelo de Goles Esperados"),
    ("13", "analisis/13_ranking_rivales.py",         "Ranking de Rivales"),
]


def separador(titulo):
    w = 60
    print(f"\n{'=' * w}")
    print(f"  {titulo}")
    print(f"{'=' * w}")


def main():
    errores = []
    t_inicio_total = time.time()

    print("\nHaganos Creer Como en 2014 — Mexico Mundial 2026")
    print(f"Ejecutando {len(SCRIPTS)} analisis...\n")

    for num, script, titulo in SCRIPTS:
        separador(f"[{num}/13] {titulo}")
        t_inicio = time.time()

        resultado = subprocess.run(
            [sys.executable, str(ROOT / script)],
            cwd=str(ROOT),
            capture_output=False,
        )

        elapsed = time.time() - t_inicio
        if resultado.returncode != 0:
            print(f"  ERROR (codigo {resultado.returncode}) — {elapsed:.1f}s")
            errores.append((num, titulo))
        else:
            print(f"  OK — {elapsed:.1f}s")

    total = time.time() - t_inicio_total
    print(f"\n{'=' * 60}")
    print(f"Completado en {total:.1f}s")

    if errores:
        print(f"\nScripts con error ({len(errores)}):")
        for num, titulo in errores:
            print(f"  [{num}] {titulo}")
        sys.exit(1)
    else:
        print(f"\nTodas las imagenes guardadas en: {ROOT / 'outputs'}/")
        imgs = sorted((ROOT / "outputs").glob("*.png"))
        for img in imgs:
            size_kb = img.stat().st_size / 1024
            print(f"  {img.name} ({size_kb:.0f} KB)")


if __name__ == "__main__":
    main()
