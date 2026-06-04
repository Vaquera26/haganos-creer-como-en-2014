import os
import numpy as np
from scipy.stats import poisson
import matplotlib.pyplot as plt
import matplotlib as mpl

VERDE  = '#006847'
ROJO   = '#CE1126'
ORO    = '#FFD700'
AZUL   = '#58a6ff'
GRIS   = '#8b949e'
BG_DARK  = '#0d1117'
BG_PANEL = '#161b22'
TEXT_CLR  = '#c9d1d9'
GRID_CLR  = '#21262d'
BORDER_CLR = '#30363d'

PALETA_MX = [VERDE, ORO, ROJO, AZUL, '#a371f7', '#f78166', '#56d364']


def setup_estilo():
    mpl.rcParams.update({
        'figure.facecolor':  BG_DARK,
        'axes.facecolor':    BG_PANEL,
        'text.color':        TEXT_CLR,
        'axes.labelcolor':   TEXT_CLR,
        'xtick.color':       TEXT_CLR,
        'ytick.color':       TEXT_CLR,
        'axes.edgecolor':    BORDER_CLR,
        'grid.color':        GRID_CLR,
        'axes.titlecolor':   TEXT_CLR,
        'legend.facecolor':  BG_PANEL,
        'legend.edgecolor':  BORDER_CLR,
        'axes.titlesize':    13,
        'axes.labelsize':    11,
        'xtick.labelsize':   9,
        'ytick.labelsize':   9,
        'font.family':       'DejaVu Sans',
        'axes.grid':         True,
        'grid.linewidth':    0.5,
        'grid.alpha':        0.4,
    })


def elo_desde_ranking(rank):
    # rank 1 → ~1800, rank 100 → ~1008; calibrado contra histórico FIFA/Elo
    return max(1008, 1800 - (rank - 1) * 8)


def prob_resultado(rank_a, rank_b, ventaja_local=False, altitud_bonus=0):
    bonus = (60 if ventaja_local else 0) + altitud_bonus
    elo_a = elo_desde_ranking(rank_a) + bonus
    elo_b = elo_desde_ranking(rank_b)

    p_base = 1.0 / (1.0 + 10.0 ** ((elo_b - elo_a) / 400.0))

    desequilibrio = abs(p_base - 0.5) * 2.0
    p_empate = 0.26 * (1.0 - desequilibrio * 0.55)

    p_win = p_base * (1.0 - p_empate)
    p_los = (1.0 - p_base) * (1.0 - p_empate)

    return round(p_win, 4), round(p_empate, 4), round(p_los, 4)


def xg_partido(rank_a, rank_b, ventaja_local=False, altitud_bonus=0):
    bonus = (60 if ventaja_local else 0) + altitud_bonus
    elo_a = elo_desde_ranking(rank_a) + bonus
    elo_b = elo_desde_ranking(rank_b)
    ratio = elo_a / elo_b
    # mundial promedia ~2.4 goles; ~1.2 por equipo en fuerzas iguales
    xg_a = 1.2 * (ratio ** 0.65)
    xg_b = 1.2 * ((1.0 / ratio) ** 0.65)
    return xg_a, xg_b


def simular_marcador(rank_a, rank_b, ventaja_local=False, altitud_bonus=0, n=1):
    xg_a, xg_b = xg_partido(rank_a, rank_b, ventaja_local, altitud_bonus)
    g_a = poisson.rvs(xg_a, size=n)
    g_b = poisson.rvs(xg_b, size=n)
    return g_a, g_b


def clasificar_resultado(g_a, g_b):
    if hasattr(g_a, '__len__'):
        return np.where(g_a > g_b, 'G', np.where(g_a == g_b, 'E', 'P'))
    return 'G' if g_a > g_b else ('E' if g_a == g_b else 'P')


def guardar_figura(fig, nombre, dpi=150):
    outdir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'outputs')
    os.makedirs(outdir, exist_ok=True)
    path = os.path.join(outdir, nombre)
    fig.savefig(path, dpi=dpi, bbox_inches='tight', facecolor=fig.get_facecolor())
    print(f"  -> {path}")
    return path


def color_dificultad(valor, vmin=0, vmax=1):
    # verde (facil) → rojo (difícil)
    t = max(0, min(1, (valor - vmin) / (vmax - vmin)))
    r = int(0x00 + t * (0xCE - 0x00))
    g = int(0x68 + (1 - t) * (0xFF - 0x68))
    b = int(0x47 * (1 - t))
    return f'#{r:02x}{g:02x}{b:02x}'
