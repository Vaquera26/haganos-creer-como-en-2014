import pandas as pd

# Partidos de México desde Qatar 2022 hasta preparativos Mundial 2026
# Fuentes: Excélsior, ESPN, Wikipedia, FMFStateOfMind
# Algunos amistosos con datos aproximados cuando el score no fue confirmado en fuentes consultadas

PARTIDOS_POST_2022 = [
    # 2023 - era Cocca
    dict(fecha="2023-01-23", rival="Perú",          rank_rival=24, gf=4, ga=1, tipo="amistoso",  resultado="G"),
    dict(fecha="2023-03-23", rival="Jamaica",        rank_rival=61, gf=2, ga=1, tipo="amistoso",  resultado="G"),
    dict(fecha="2023-03-27", rival="Surinam",        rank_rival=85, gf=3, ga=0, tipo="amistoso",  resultado="G"),
    dict(fecha="2023-05-26", rival="Alemania",       rank_rival=16, gf=2, ga=3, tipo="amistoso",  resultado="P"),
    dict(fecha="2023-05-30", rival="Australia",      rank_rival=27, gf=2, ga=0, tipo="amistoso",  resultado="G"),
    dict(fecha="2023-06-07", rival="Guatemala",      rank_rival=72, gf=2, ga=1, tipo="amistoso",  resultado="G"),
    dict(fecha="2023-06-10", rival="Camerún",        rank_rival=43, gf=1, ga=1, tipo="amistoso",  resultado="E"),
    dict(fecha="2023-06-15", rival="Honduras",       rank_rival=80, gf=3, ga=0, tipo="Nations L", resultado="G"),
    dict(fecha="2023-06-19", rival="EUA",            rank_rival=13, gf=0, ga=3, tipo="Nations L", resultado="P"),  # semifinal
    dict(fecha="2023-06-22", rival="Canadá",         rank_rival=41, gf=2, ga=1, tipo="Nations L", resultado="G"),  # 3er lugar
    # Gold Cup 2023
    dict(fecha="2023-06-26", rival="Honduras",       rank_rival=80, gf=0, ga=0, tipo="Gold Cup",  resultado="E"),
    dict(fecha="2023-07-01", rival="Haití",          rank_rival=83, gf=1, ga=0, tipo="Gold Cup",  resultado="G"),
    dict(fecha="2023-07-04", rival="Qatarl",         rank_rival=68, gf=4, ga=0, tipo="Gold Cup",  resultado="G"),
    dict(fecha="2023-07-08", rival="El Salvador",    rank_rival=70, gf=3, ga=0, tipo="Gold Cup",  resultado="G"),
    dict(fecha="2023-07-13", rival="Jamaica",        rank_rival=61, gf=3, ga=0, tipo="Gold Cup",  resultado="G"),  # semifinal
    dict(fecha="2023-07-16", rival="Panamá",         rank_rival=77, gf=1, ga=0, tipo="Gold Cup",  resultado="G"),  # final - campeon
    dict(fecha="2023-09-09", rival="Bolivia",        rank_rival=88, gf=1, ga=0, tipo="amistoso",  resultado="G"),
    dict(fecha="2023-09-12", rival="El Salvador",    rank_rival=70, gf=1, ga=0, tipo="amistoso",  resultado="G"),
    dict(fecha="2023-10-12", rival="Uzbekistán",     rank_rival=73, gf=1, ga=0, tipo="amistoso",  resultado="G"),
    dict(fecha="2023-10-16", rival="Polonia",        rank_rival=26, gf=0, ga=1, tipo="amistoso",  resultado="P"),
    dict(fecha="2023-11-16", rival="Venezuela",      rank_rival=52, gf=3, ga=2, tipo="amistoso",  resultado="G"),
    dict(fecha="2023-11-20", rival="Colombia",       rank_rival=14, gf=3, ga=2, tipo="amistoso",  resultado="G"),

    # 2024 - era Lozano → Aguirre (julio)
    dict(fecha="2024-02-01", rival="El Salvador",    rank_rival=70, gf=1, ga=0, tipo="amistoso",  resultado="G"),
    dict(fecha="2024-02-07", rival="Paraguay",       rank_rival=55, gf=2, ga=0, tipo="amistoso",  resultado="G"),
    dict(fecha="2024-03-23", rival="Bolivia",        rank_rival=88, gf=0, ga=1, tipo="Nations L", resultado="P"),
    dict(fecha="2024-03-26", rival="Venezuela",      rank_rival=52, gf=1, ga=0, tipo="Nations L", resultado="G"),
    dict(fecha="2024-05-31", rival="Bolivia",        rank_rival=88, gf=1, ga=0, tipo="amistoso",  resultado="G"),
    dict(fecha="2024-06-05", rival="Uruguay",        rank_rival=12, gf=0, ga=0, tipo="amistoso",  resultado="E"),
    dict(fecha="2024-06-08", rival="Brasil",         rank_rival=4,  gf=2, ga=3, tipo="amistoso",  resultado="P"),
    # Copa América 2024
    dict(fecha="2024-06-22", rival="Jamaica",        rank_rival=61, gf=1, ga=0, tipo="Copa Amér", resultado="G"),
    dict(fecha="2024-06-26", rival="Venezuela",      rank_rival=52, gf=0, ga=1, tipo="Copa Amér", resultado="P"),
    dict(fecha="2024-06-30", rival="Ecuador",        rank_rival=35, gf=0, ga=0, tipo="Copa Amér", resultado="E"),  # eliminados
    # era Aguirre
    dict(fecha="2024-09-10", rival="Nueva Zelanda",  rank_rival=90, gf=2, ga=0, tipo="amistoso",  resultado="G"),
    dict(fecha="2024-09-13", rival="Canadá",         rank_rival=22, gf=0, ga=0, tipo="amistoso",  resultado="E"),
    dict(fecha="2024-10-13", rival="EUA",            rank_rival=16, gf=0, ga=0, tipo="amistoso",  resultado="E"),
    dict(fecha="2024-10-15", rival="EUA",            rank_rival=16, gf=1, ga=0, tipo="amistoso",  resultado="G"),
    dict(fecha="2024-11-14", rival="Honduras",       rank_rival=80, gf=1, ga=0, tipo="Nations L", resultado="G"),
    dict(fecha="2024-11-19", rival="Canadá",         rank_rival=22, gf=2, ga=0, tipo="Nations L", resultado="G"),

    # 2025 - era Aguirre
    dict(fecha="2025-01-16", rival="Inter P.Alegre", rank_rival=99, gf=2, ga=0, tipo="amistoso",  resultado="G"),
    dict(fecha="2025-01-21", rival="River Plate",    rank_rival=99, gf=0, ga=2, tipo="amistoso",  resultado="P"),
    # Nations League 2024-25 Final Four
    dict(fecha="2025-03-20", rival="Canadá",         rank_rival=22, gf=2, ga=0, tipo="Nations L", resultado="G"),  # semifinal
    dict(fecha="2025-03-23", rival="Panamá",         rank_rival=77, gf=2, ga=1, tipo="Nations L", resultado="G"),  # final - campeón
    # Gold Cup 2025 (México invicto, 7G-1E)
    dict(fecha="2025-06-14", rival="Guatemala",      rank_rival=72, gf=2, ga=0, tipo="Gold Cup",  resultado="G"),
    dict(fecha="2025-06-17", rival="Cuba",           rank_rival=95, gf=4, ga=0, tipo="Gold Cup",  resultado="G"),
    dict(fecha="2025-06-21", rival="Trinidad y T.",  rank_rival=78, gf=3, ga=0, tipo="Gold Cup",  resultado="G"),
    dict(fecha="2025-06-24", rival="Costa Rica",     rank_rival=55, gf=1, ga=1, tipo="Gold Cup",  resultado="E"),  # 1/4
    dict(fecha="2025-06-28", rival="Honduras",       rank_rival=80, gf=2, ga=0, tipo="Gold Cup",  resultado="G"),  # SF
    dict(fecha="2025-07-06", rival="EUA",            rank_rival=16, gf=2, ga=1, tipo="Gold Cup",  resultado="G"),  # final - campeón
    # amistosos segundo semestre 2025
    dict(fecha="2025-09-09", rival="Corea del Sur",  rank_rival=25, gf=2, ga=2, tipo="amistoso",  resultado="E"),
    dict(fecha="2025-10-11", rival="Colombia",       rank_rival=12, gf=0, ga=4, tipo="amistoso",  resultado="P"),
    dict(fecha="2025-10-14", rival="Ecuador",        rank_rival=21, gf=1, ga=1, tipo="amistoso",  resultado="E"),
    dict(fecha="2025-11-15", rival="Uruguay",        rank_rival=11, gf=0, ga=0, tipo="amistoso",  resultado="E"),
    dict(fecha="2025-11-18", rival="Paraguay",       rank_rival=30, gf=1, ga=2, tipo="amistoso",  resultado="P"),

    # preparativos 2026 WC (era Aguirre)
    dict(fecha="2026-02-05", rival="Islandia",       rank_rival=95, gf=4, ga=0, tipo="amistoso",  resultado="G"),
    dict(fecha="2026-03-20", rival="Portugal",       rank_rival=6,  gf=0, ga=0, tipo="amistoso",  resultado="E"),
    dict(fecha="2026-04-02", rival="Bélgica",        rank_rival=9,  gf=1, ga=1, tipo="amistoso",  resultado="E"),
    dict(fecha="2026-05-27", rival="Australia",      rank_rival=31, gf=1, ga=0, tipo="amistoso",  resultado="G"),
    dict(fecha="2026-06-01", rival="Ghana",          rank_rival=44, gf=2, ga=0, tipo="amistoso",  resultado="G"),
]


def get_df():
    df = pd.DataFrame(PARTIDOS_POST_2022)
    df["fecha"] = pd.to_datetime(df["fecha"])
    df["año"] = df["fecha"].dt.year
    df["diferencia_goles"] = df["gf"] - df["ga"]
    return df


def resumen_por_tipo():
    df = get_df()
    return df.groupby("tipo").agg(
        partidos=("resultado", "count"),
        victorias=("resultado", lambda x: (x == "G").sum()),
        empates=("resultado",  lambda x: (x == "E").sum()),
        derrotas=("resultado", lambda x: (x == "P").sum()),
        gf=("gf", "sum"),
        ga=("ga", "sum"),
    ).reset_index()


def forma_ultimos_n(n=10):
    df = get_df().sort_values("fecha").tail(n)
    return df


def rendimiento_por_año():
    df = get_df()
    return df.groupby("año").agg(
        partidos=("resultado", "count"),
        victorias=("resultado", lambda x: (x == "G").sum()),
        empates=("resultado",  lambda x: (x == "E").sum()),
        derrotas=("resultado", lambda x: (x == "P").sum()),
        gf=("gf", "sum"),
        ga=("ga", "sum"),
    ).reset_index()
