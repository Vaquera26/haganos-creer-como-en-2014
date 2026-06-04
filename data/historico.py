import pandas as pd

# registros por torneo - pre-1994 son aproximados, era moderna es precisa
HISTORICO = [
    dict(año=1930, sede="Uruguay",      ronda="Grupos",  w=1, d=0, l=2, gf=4,  ga=13, host=False, penales=False, eliminado_por=None),
    dict(año=1950, sede="Brasil",       ronda="Grupos",  w=0, d=0, l=3, gf=2,  ga=10, host=False, penales=False, eliminado_por=None),
    dict(año=1954, sede="Suiza",        ronda="Grupos",  w=0, d=0, l=3, gf=2,  ga=8,  host=False, penales=False, eliminado_por=None),
    dict(año=1958, sede="Suecia",       ronda="Grupos",  w=0, d=1, l=2, gf=1,  ga=8,  host=False, penales=False, eliminado_por=None),
    dict(año=1962, sede="Chile",        ronda="Grupos",  w=1, d=0, l=2, gf=3,  ga=9,  host=False, penales=False, eliminado_por=None),
    dict(año=1966, sede="Inglaterra",   ronda="Grupos",  w=0, d=1, l=2, gf=1,  ga=5,  host=False, penales=False, eliminado_por=None),
    dict(año=1970, sede="México",       ronda="Cuartos", w=3, d=0, l=1, gf=6,  ga=4,  host=True,  penales=False, eliminado_por="Italia"),
    dict(año=1978, sede="Argentina",    ronda="Grupos",  w=1, d=0, l=2, gf=4,  ga=8,  host=False, penales=False, eliminado_por=None),
    dict(año=1986, sede="México",       ronda="Cuartos", w=4, d=0, l=2, gf=7,  ga=4,  host=True,  penales=True,  eliminado_por="Alemania Occ."),
    dict(año=1994, sede="EUA",          ronda="Octavos", w=1, d=2, l=1, gf=4,  ga=4,  host=False, penales=True,  eliminado_por="Bulgaria"),
    dict(año=1998, sede="Francia",      ronda="Octavos", w=2, d=1, l=1, gf=10, ga=5,  host=False, penales=False, eliminado_por="Alemania"),
    dict(año=2002, sede="Corea/Japón",  ronda="Octavos", w=2, d=1, l=1, gf=7,  ga=3,  host=False, penales=False, eliminado_por="EUA"),
    dict(año=2006, sede="Alemania",     ronda="Octavos", w=2, d=1, l=1, gf=7,  ga=5,  host=False, penales=False, eliminado_por="Argentina"),
    dict(año=2010, sede="Sudáfrica",    ronda="Octavos", w=3, d=1, l=1, gf=8,  ga=7,  host=False, penales=False, eliminado_por="Argentina"),
    dict(año=2014, sede="Brasil",       ronda="Octavos", w=2, d=1, l=1, gf=5,  ga=5,  host=False, penales=False, eliminado_por="Países Bajos"),
    dict(año=2018, sede="Rusia",        ronda="Octavos", w=2, d=0, l=2, gf=4,  ga=4,  host=False, penales=False, eliminado_por="Brasil"),
    dict(año=2022, sede="Qatar",        ronda="Grupos",  w=1, d=1, l=1, gf=2,  ga=3,  host=False, penales=False, eliminado_por=None),
]

RONDA_ORDEN = {
    "Grupos": 1, "R32": 2, "Octavos": 3,
    "Cuartos": 4, "Semifinal": 5, "Final": 6, "Campeón": 7,
}

# resultados post-Qatar 2022 hasta preparativos para 2026
FORMA_RECIENTE = {
    "periodo": "2023-2026",
    "titulos": ["Nations League 2024", "Gold Cup 2023", "Gold Cup 2025"],
    "oficiales": dict(w=7, d=1, l=0),    # Nations League + Gold Cup 2025 undefeated
    "ultimos_10": dict(w=7, d=2, l=1, gf=17, ga=5),
    "prep_2026": [
        dict(rival="Islandia",   rank=95,  resultado="4-0", tipo="amistoso"),
        dict(rival="Portugal",   rank=6,   resultado="0-0", tipo="amistoso"),
        dict(rival="Bélgica",    rank=9,   resultado="1-1", tipo="amistoso"),
        dict(rival="Australia",  rank=31,  resultado="1-0", tipo="amistoso"),
        dict(rival="Ghana",      rank=44,  resultado="2-0", tipo="amistoso"),
    ],
}

# selecciones anfitrionas en mundiales (rendimiento para el análisis de localía)
HOSTS_HISTORICO = [
    dict(año=1930, pais="Uruguay",    ronda_alcanzada="Campeón",   rank_previo=None),
    dict(año=1934, pais="Italia",     ronda_alcanzada="Campeón",   rank_previo=None),
    dict(año=1938, pais="Francia",    ronda_alcanzada="Cuartos",   rank_previo=None),
    dict(año=1950, pais="Brasil",     ronda_alcanzada="Final",     rank_previo=None),
    dict(año=1954, pais="Suiza",      ronda_alcanzada="Cuartos",   rank_previo=None),
    dict(año=1958, pais="Suecia",     ronda_alcanzada="Final",     rank_previo=None),
    dict(año=1962, pais="Chile",      ronda_alcanzada="Semifinal", rank_previo=None),
    dict(año=1966, pais="Inglaterra", ronda_alcanzada="Campeón",   rank_previo=None),
    dict(año=1970, pais="México",     ronda_alcanzada="Cuartos",   rank_previo=None),
    dict(año=1974, pais="Alemania",   ronda_alcanzada="Campeón",   rank_previo=None),
    dict(año=1978, pais="Argentina",  ronda_alcanzada="Campeón",   rank_previo=None),
    dict(año=1982, pais="España",     ronda_alcanzada="Segunda",   rank_previo=None),
    dict(año=1986, pais="México",     ronda_alcanzada="Cuartos",   rank_previo=None),
    dict(año=1990, pais="Italia",     ronda_alcanzada="Semifinal", rank_previo=None),
    dict(año=1994, pais="EUA",        ronda_alcanzada="Octavos",   rank_previo=None),
    dict(año=1998, pais="Francia",    ronda_alcanzada="Campeón",   rank_previo=2),
    dict(año=2002, pais="Corea",      ronda_alcanzada="Semifinal", rank_previo=40),
    dict(año=2002, pais="Japón",      ronda_alcanzada="Octavos",   rank_previo=35),
    dict(año=2006, pais="Alemania",   ronda_alcanzada="Semifinal", rank_previo=16),
    dict(año=2010, pais="Sudáfrica",  ronda_alcanzada="Grupos",    rank_previo=83),
    dict(año=2014, pais="Brasil",     ronda_alcanzada="Semifinal", rank_previo=3),
    dict(año=2018, pais="Rusia",      ronda_alcanzada="Cuartos",   rank_previo=65),
    dict(año=2022, pais="Qatar",      ronda_alcanzada="Grupos",    rank_previo=50),
]


def get_df():
    df = pd.DataFrame(HISTORICO)
    df["ronda_num"] = df["ronda"].map(RONDA_ORDEN)
    df["pts"] = df["w"] * 3 + df["d"]
    df["partidos"] = df["w"] + df["d"] + df["l"]
    df["rendimiento"] = df["pts"] / (df["partidos"] * 3)
    df["gd"] = df["gf"] - df["ga"]
    return df


def era_moderna():
    return get_df()[get_df()["año"] >= 1994].copy()


def partidos_de_grupos(df=None):
    if df is None:
        df = get_df()
    d = df.copy()
    d["w_g"] = d["w"].clip(upper=3)
    d["d_g"] = d["d"].clip(upper=3)
    d["l_g"] = d["l"].clip(upper=3)
    return d
