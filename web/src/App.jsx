import './App.css'
import Footer from "./components/Footer.jsx";
import imgCampeon   from "./mundiales/mexico-campeon-1.jpg";
import imgLogoMx    from "./mundiales/logo-hero.png";
import imgEmblem    from "./mundiales/FWC26_Official_Emblem_6.webp";
import imgWeAre26   from "./mundiales/Fifa26_1.png";
import imgLogoClean from "./mundiales/fifa-world-cup-2026.7042846f.png";
import imgRfm       from "./mundiales/rfm_panini.jpg";
import imgCuah      from "./mundiales/cuah_panini.avif";
import imgAlexis    from "./mundiales/alexis_panini.jpeg";
import imgLuisMi    from "./mundiales/luis_mi_pannini.jpg";
import imgVela      from "./mundiales/calritos_vela_panini.jpg";
import imgCh14      from "./mundiales/ch24panini.webp";

function Sticker({ src, alt, size, rotate = 0, style = {} }) {
  return (
    <img src={src} alt={alt} style={{
      width: size, height: size, objectFit: "contain", display: "block",
      transform: `rotate(${rotate}deg)`,
      filter: "drop-shadow(0 3px 10px rgba(0,0,0,0.18))",
      flexShrink: 0,
      ...style,
    }} />
  );
}

function Panini({ src, alt, rotate = 0 }) {
  return (
    <div style={{
      transform: `rotate(${rotate}deg)`,
      flexShrink: 0,
      boxShadow: "0 6px 20px rgba(0,0,0,0.22), 0 1px 4px rgba(0,0,0,0.12)",
      lineHeight: 0,
      transition: "transform 0.2s",
      cursor: "default",
    }}>
      <img src={src} alt={alt} style={{
        width: 90, height: 120,
        objectFit: "cover", objectPosition: "top",
        display: "block",
      }} />
    </div>
  );
}
import Hero from "./components/sections/Hero.jsx";
import S01 from "./components/sections/S01_RutaQuintoPartido.jsx";
import S02 from "./components/sections/S02_MapaDificultad.jsx";
import S03 from "./components/sections/S03_ProbabilidadPartido.jsx";
import S04 from "./components/sections/S04_EscenariosClasificacion.jsx";
import S05 from "./components/sections/S05_IndiceRiesgo.jsx";
import S06 from "./components/sections/S06_ArbolCaminos.jsx";
import S07 from "./components/sections/S07_MexicoVsHistoria.jsx";
import S08 from "./components/sections/S08_EfectoLocalia.jsx";
import S09 from "./components/sections/S09_RadiografiaGrupo.jsx";
import S10 from "./components/sections/S10_PuntosNecesarios.jsx";
import S11 from "./components/sections/S11_ProbabilidadPenales.jsx";
import S12 from "./components/sections/S12_GolesEsperados.jsx";
import S13 from "./components/sections/S13_RankingRivales.jsx";
import S15 from "./components/sections/S15_MexicoCampeonBracket.jsx";

export default function App() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* ── Barra superior FIFA WC26 ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 5vw", height: 44,
        background: "var(--bg)", borderBottom: "1px solid var(--border-mid)",
      }}>
        <img src={imgLogoClean} alt="FIFA World Cup 2026" style={{ height: 30, objectFit: "contain" }} />
        <div style={{ display: "flex", gap: 20 }}>
          {[
            { id: "s09", label: "El Grupo" }, { id: "s03", label: "Partidos" },
            { id: "s08", label: "Localía" }, { id: "s07", label: "Historia" },
            { id: "s01", label: "El Quinto" }, { id: "s15", label: "El Sueño" },
          ].map(s => (
            <a key={s.id} href={`#${s.id}`} className="nav-link">{s.label}</a>
          ))}
        </div>
      </div>

      <main>
        <Hero />

        {/* Sticker 1 — después del Hero */}
        <div style={{
          display: "flex", alignItems: "flex-end", gap: 14,
          padding: "14px 5vw", background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border)",
        }}>
          <Sticker src={imgLogoMx} alt="FIFA WC26 Mexico City" size={72} rotate={-4} />
          <Sticker src={imgWeAre26} alt="We Are 26" size={64} rotate={3} />
          <Panini src={imgCuah} alt="Cuauhtémoc Blanco" rotate={-3} />
          <div style={{ flex: 1 }} />
          <span style={{
            fontFamily: "var(--mono)", fontSize: 10, fontWeight: 700,
            letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)",
            alignSelf: "center",
          }}>
            Grupo A · Ciudad de México · 11 Jun — 24 Jun 2026
          </span>
        </div>

        {/* 1. El grupo — quiénes somos, contra quién jugamos */}
        <S09 />
        {/* 2. Los tres partidos, uno por uno */}
        <S03 />
        {/* 3. Cuántos puntos necesitamos y qué pasa con cada resultado */}
        <S10 />
        <S04 />

        {/* Sticker 2 — antes de Localía e Historia */}
        <div style={{
          display: "flex", alignItems: "flex-end",
          gap: 12, padding: "10px 5vw",
          background: "var(--bg)", borderBottom: "1px solid var(--border)",
        }}>
          <Panini src={imgLuisMi} alt="Luis Hernández" rotate={3} />
          <Panini src={imgRfm}    alt="Rafael Márquez" rotate={-2} />
          <div style={{ flex: 1 }} />
          <Sticker src={imgEmblem} alt="FIFA WC26 Emblem" size={80} rotate={5} />
          <Sticker src={imgLogoMx} alt="FIFA WC26 Mexico City" size={56} rotate={-2} />
        </div>

        {/* 4. Jugar en casa: el argumento más sólido */}
        <S08 />
        {/* 5. El espejo histórico */}
        <S07 />
        {/* 6. Si pasamos — el camino y los posibles rivales */}
        <S02 />
        <S06 />
        <S13 />
        {/* 7. Los números que importan: cómo ataca y defiende México */}
        <S12 />
        {/* 8. Los riesgos reales */}
        <S05 />
        <S11 />

        {/* Sticker 3 — antes del quinto partido */}
        <div style={{
          display: "flex", alignItems: "flex-end", gap: 14,
          padding: "10px 5vw", background: "var(--bg-surface)",
          borderBottom: "1px solid var(--border)",
        }}>
          <Sticker src={imgWeAre26} alt="We Are 26" size={70} rotate={-3} />
          <Panini src={imgVela}   alt="Carlos Vela"  rotate={2} />
          <Panini src={imgAlexis} alt="Alexis Vega"  rotate={-4} />
          <Panini src={imgCh14}   alt="Chicharito"   rotate={3} />
          <div style={{ flex: 1 }} />
          <Sticker src={imgLogoClean} alt="FIFA WC26" size={52} rotate={-2} />
        </div>

        {/* 9. El quinto partido — lo que el modelo dice */}
        <S01 />
        {/* 10. El sueño — México campeón */}
        <S15 />

        {/* Conclusión */}
        <div style={{
          padding: "64px 5vw 56px",
          borderTop: "1px solid var(--border-mid)",
          borderBottom: "1px solid var(--border-mid)",
          background: "var(--bg)",
        }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <p style={{
            fontFamily: "var(--mono)", fontSize: 9, fontWeight: 700,
            letterSpacing: "0.25em", textTransform: "uppercase",
            color: "var(--silver)", marginBottom: 20,
          }}>
            Conclusión · Análisis 2026
          </p>

          <h2 style={{
            fontFamily: "var(--sans)", fontSize: "clamp(26px, 3.5vw, 38px)",
            fontWeight: 900, letterSpacing: "-0.025em", textTransform: "uppercase",
            color: "var(--text)", lineHeight: 1.05, marginBottom: 28,
          }}>
            Ganar el Mundial es imposible.<br />
            <em style={{ color: "var(--on-color)", fontStyle: "italic" }}>
              Un quinto partido no lo es.
            </em>
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 700 }}>
            <p style={{ fontFamily: "var(--serif)", fontSize: 15, color: "var(--text-sec)", lineHeight: 1.78 }}>
              Nadie en su sano juicio va a decir que México va a ganar este Mundial. Eso no es pesimismo —
              es honestidad. Argentina, Francia, España, Brasil, Inglaterra están en otro nivel. Pero el quinto
              partido es otra conversación. El quinto partido es real. Los números lo dicen, el grupo lo permite,
              la localía lo justifica. Por primera vez en mucho tiempo hay razones concretas, no solo ilusiones
              de aficionado.
            </p>
            <p style={{ fontFamily: "var(--serif)", fontSize: 15, color: "var(--text-sec)", lineHeight: 1.78 }}>
              Dicho eso, hay cosas que no cuadran. Javier Aguirre dirige a México en su tercer Mundial. Tres
              mundiales con el mismo técnico en distintos ciclos no es un reconocimiento — es una señal de que
              algo no está funcionando en la estructura del fútbol mexicano. Y la situación del co-anfitrionazgo
              lo dice todo: México comparte el torneo con Estados Unidos y Canadá, pero el reparto no es
              equitativo. 78 de 104 partidos son en suelo americano. México recibe 13, los menos de los tres.
              De cuartos de final en adelante, todo se juega en Estados Unidos — incluyendo la final en Nueva
              Jersey. Si México llega a cuartos, ya no hay Azteca, ya no hay altitud, ya no hay afición propia.
              Ser co-anfitrión no es lo mismo que ser anfitrión.
            </p>
            <p style={{ fontFamily: "var(--serif)", fontSize: 15, color: "var(--text-sec)", lineHeight: 1.78 }}>
              La convocatoria genera más dudas que certezas. Santiago Giménez llega con casi nueve meses sin
              marcar después de una temporada para olvidar en el AC Milán. Raúl Jiménez sigue siendo convocado
              más por nombre que por nivel. Ochoa está en su sexto Mundial a los 40 años. Son decisiones
              difíciles de defender con el balance de los últimos años.
            </p>
            <p style={{ fontFamily: "var(--serif)", fontSize: 15, color: "var(--text-sec)", lineHeight: 1.78 }}>
              Pero la esperanza tiene nombre y apellido: Gilberto Mora. Diecisiete años, titular en Tijuana,
              el jugador más joven en la historia de México en un Mundial. Si hay algo genuinamente distinto
              en esta generación respecto a Qatar y Rusia, es ver a un chico de 17 años jugando sin miedo junto
              a Roberto Alvarado, Chino Huerta o Brian Gutiérrez. Son pocos, pero son los que mejor llegan.
            </p>
            <p style={{ fontFamily: "var(--serif)", fontSize: 15, color: "var(--text-sec)", lineHeight: 1.78 }}>
              El modelo dice que en casi la mitad de las simulaciones México llega a octavos. Juega en casa.
              El grupo es el más alcanzable en años. Y hay jugadores que en un buen día le pueden ganar a
              cualquiera en la ronda de 32. Lo demás — el quinto partido, lo que venga después — ya es
              territorio del fútbol. Y eso, en el fondo, es exactamente como debe ser.
            </p>
          </div>
          </div>
        </div>

        {/* Cierre */}
        <div style={{ position: "relative", height: "70vh", overflow: "hidden" }}>
          <img
            src={imgCampeon}
            alt="México Campeón"
            style={{
              width: "100%", height: "100%", objectFit: "cover", display: "block",
              filter: "brightness(0.45)",
            }}
          />
          {/* Sticker emblem — esquina superior derecha */}
          <img src={imgEmblem} alt="FIFA WC26" style={{
            position: "absolute", top: 24, right: 32,
            width: 110, height: 110, objectFit: "contain",
            filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.4))",
            transform: "rotate(6deg)",
          }} />

          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 16,
          }}>
            <p style={{
              fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700,
              letterSpacing: "0.3em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.6)",
            }}>
              México · FIFA World Cup 2026
            </p>
            <h2 style={{
              fontFamily: "var(--sans)", fontWeight: 900,
              fontSize: "clamp(40px, 7vw, 88px)",
              letterSpacing: "-0.03em", textTransform: "uppercase",
              color: "#ffffff", lineHeight: 1, textAlign: "center",
              margin: 0,
            }}>
              Háganos creer<br />
              <em style={{ color: "#4ade80", fontStyle: "italic" }}>como en 2014.</em>
            </h2>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
