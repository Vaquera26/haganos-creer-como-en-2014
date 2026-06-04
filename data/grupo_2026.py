# Mundial 2026 - sorteo confirmado diciembre 2025, playoffs completados marzo 2026
# Rankings: Grupo A confirmados (FIFA abril 2026), resto aproximados

GRUPO_A = {
    "México":        {"rank": 15, "conf": "CONCACAF", "host": True},
    "Corea del Sur": {"rank": 25, "conf": "AFC",      "host": False},
    "Chequia":       {"rank": 41, "conf": "UEFA",     "host": False},
    "Sudáfrica":     {"rank": 60, "conf": "CAF",      "host": False},
}

TODOS_LOS_GRUPOS = {
    "A": {"México": 15, "Corea del Sur": 25, "Chequia": 41, "Sudáfrica": 60},
    "B": {"Canadá": 22, "Suiza": 14, "Bosnia-Herzegovina": 62, "Qatar": 71},
    "C": {"Brasil": 4, "Marruecos": 13, "Escocia": 28, "Haití": 90},
    "D": {"EUA": 16, "Turquía": 23, "Paraguay": 30, "Australia": 31},
    "E": {"Alemania": 7, "Ecuador": 21, "Costa de Marfil": 24, "Curazao": 108},
    "F": {"Países Bajos": 8, "Japón": 19, "Suecia": 26, "Túnez": 34},
    "G": {"Bélgica": 9, "Irán": 29, "Egipto": 32, "Nueva Zelanda": 95},
    "H": {"España": 3, "Uruguay": 11, "Arabia Saudita": 33, "Cabo Verde": 39},
    "I": {"Francia": 2, "Senegal": 17, "Noruega": 20, "Irak": 68},
    "J": {"Argentina": 1, "Austria": 18, "Argelia": 27, "Jordania": 100},
    "K": {"Portugal": 6, "Colombia": 12, "Congo RD": 64, "Uzbekistán": 76},
    "L": {"Inglaterra": 5, "Croacia": 10, "Ghana": 44, "Panamá": 78},
}

# partidos de México en fase de grupos
FIXTURES_MEXICO = [
    dict(rival="Sudáfrica",     rank_rival=60, fecha="11 Jun", sede="Azteca (CDMX)",       altitud_m=2240, jornada=1),
    dict(rival="Corea del Sur", rank_rival=25, fecha="18 Jun", sede="Akron (Guadalajara)", altitud_m=1554, jornada=2),
    dict(rival="Chequia",       rank_rival=41, fecha="24 Jun", sede="Azteca (CDMX)",       altitud_m=2240, jornada=3),
]

# llave aproximada de R32 basada en el sorteo
# si México termina 1ro del Grupo A, enfrenta al 2do del Grupo B
# si termina 2do del Grupo A, enfrenta al 1ro del Grupo B
BRACKET_APROXIMADO = {
    "1ro_A_vs": "2do_B",
    "2do_A_vs": "1ro_B",
    "3ro_A":    "clasificación sujeta a ser top-8 terceros",
}

# rivales posibles en R32 según posición final en Grupo A
R32_CANDIDATOS = {
    "1ro": [("Suiza", 14), ("Canadá", 22), ("Bosnia-Herzegovina", 62), ("Qatar", 71)],
    "2do": [("Canadá", 22), ("Suiza", 14), ("Bosnia-Herzegovina", 62), ("Qatar", 71)],
}

# rutas posibles en octavos según bracket (R16 depende de R32)
# los rivales en R16 vendrían de los ganadores del bracket adyacente
R16_POSIBLES_GENERAL = [
    ("Brasil",        4),
    ("Marruecos",    13),
    ("Escocia",      28),
    ("EUA",          16),
    ("Turquía",      23),
    ("Paraguay",     30),
]

# cuartos, semis y final: cualquiera de los grandes puede aparecer
QF_Y_MAS = [
    ("Argentina",    1),
    ("Francia",      2),
    ("España",       3),
    ("Brasil",       4),
    ("Inglaterra",   5),
    ("Portugal",     6),
    ("Alemania",     7),
    ("Países Bajos", 8),
    ("Bélgica",      9),
    ("Croacia",      10),
    ("Uruguay",      11),
]
