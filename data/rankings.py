# Rankings FIFA abril 2026 (Grupo A confirmados; resto aproximados)
# Fuente base: FIFA/Coca-Cola World Ranking - lanzamiento 1 abril 2026

EQUIPOS = {
    "Argentina":          {"rank": 1,   "conf": "CONMEBOL", "grupo": "J"},
    "Francia":            {"rank": 2,   "conf": "UEFA",     "grupo": "I"},
    "España":             {"rank": 3,   "conf": "UEFA",     "grupo": "H"},
    "Brasil":             {"rank": 4,   "conf": "CONMEBOL", "grupo": "C"},
    "Inglaterra":         {"rank": 5,   "conf": "UEFA",     "grupo": "L"},
    "Portugal":           {"rank": 6,   "conf": "UEFA",     "grupo": "K"},
    "Alemania":           {"rank": 7,   "conf": "UEFA",     "grupo": "E"},
    "Países Bajos":       {"rank": 8,   "conf": "UEFA",     "grupo": "F"},
    "Bélgica":            {"rank": 9,   "conf": "UEFA",     "grupo": "G"},
    "Croacia":            {"rank": 10,  "conf": "UEFA",     "grupo": "L"},
    "Uruguay":            {"rank": 11,  "conf": "CONMEBOL", "grupo": "H"},
    "Colombia":           {"rank": 12,  "conf": "CONMEBOL", "grupo": "K"},
    "Marruecos":          {"rank": 13,  "conf": "CAF",      "grupo": "C"},
    "Suiza":              {"rank": 14,  "conf": "UEFA",     "grupo": "B"},
    "México":             {"rank": 15,  "conf": "CONCACAF", "grupo": "A"},
    "EUA":                {"rank": 16,  "conf": "CONCACAF", "grupo": "D"},
    "Senegal":            {"rank": 17,  "conf": "CAF",      "grupo": "I"},
    "Austria":            {"rank": 18,  "conf": "UEFA",     "grupo": "J"},
    "Japón":              {"rank": 19,  "conf": "AFC",      "grupo": "F"},
    "Noruega":            {"rank": 20,  "conf": "UEFA",     "grupo": "I"},
    "Ecuador":            {"rank": 21,  "conf": "CONMEBOL", "grupo": "E"},
    "Canadá":             {"rank": 22,  "conf": "CONCACAF", "grupo": "B"},
    "Turquía":            {"rank": 23,  "conf": "UEFA",     "grupo": "D"},
    "Costa de Marfil":    {"rank": 24,  "conf": "CAF",      "grupo": "E"},
    "Corea del Sur":      {"rank": 25,  "conf": "AFC",      "grupo": "A"},
    "Suecia":             {"rank": 26,  "conf": "UEFA",     "grupo": "F"},
    "Argelia":            {"rank": 27,  "conf": "CAF",      "grupo": "J"},
    "Escocia":            {"rank": 28,  "conf": "UEFA",     "grupo": "C"},
    "Irán":               {"rank": 29,  "conf": "AFC",      "grupo": "G"},
    "Paraguay":           {"rank": 30,  "conf": "CONMEBOL", "grupo": "D"},
    "Australia":          {"rank": 31,  "conf": "AFC",      "grupo": "D"},
    "Egipto":             {"rank": 32,  "conf": "CAF",      "grupo": "G"},
    "Arabia Saudita":     {"rank": 33,  "conf": "AFC",      "grupo": "H"},
    "Túnez":              {"rank": 34,  "conf": "CAF",      "grupo": "F"},
    "Cabo Verde":         {"rank": 39,  "conf": "CAF",      "grupo": "H"},
    "Chequia":            {"rank": 41,  "conf": "UEFA",     "grupo": "A"},
    "Ghana":              {"rank": 44,  "conf": "CAF",      "grupo": "L"},
    "Sudáfrica":          {"rank": 60,  "conf": "CAF",      "grupo": "A"},
    "Bosnia-Herzegovina": {"rank": 62,  "conf": "UEFA",     "grupo": "B"},
    "Congo RD":           {"rank": 64,  "conf": "CAF",      "grupo": "K"},
    "Irak":               {"rank": 68,  "conf": "AFC",      "grupo": "I"},
    "Qatar":              {"rank": 71,  "conf": "AFC",      "grupo": "B"},
    "Uzbekistán":         {"rank": 76,  "conf": "AFC",      "grupo": "K"},
    "Panamá":             {"rank": 78,  "conf": "CONCACAF", "grupo": "L"},
    "Haití":              {"rank": 90,  "conf": "CONCACAF", "grupo": "C"},
    "Nueva Zelanda":      {"rank": 95,  "conf": "OFC",      "grupo": "G"},
    "Jordania":           {"rank": 100, "conf": "AFC",      "grupo": "J"},
    "Curazao":            {"rank": 108, "conf": "CONCACAF", "grupo": "E"},
}


def get_rank(nombre):
    return EQUIPOS.get(nombre, {}).get("rank", 60)


def equipos_por_grupo(grupo):
    return {k: v for k, v in EQUIPOS.items() if v.get("grupo") == grupo}


def ranking_promedio_grupo(grupo):
    equipos = equipos_por_grupo(grupo)
    if not equipos:
        return 50
    ranks = [v["rank"] for v in equipos.values()]
    return sum(ranks) / len(ranks)
