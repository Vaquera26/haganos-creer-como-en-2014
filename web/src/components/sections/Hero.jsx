import imgHero from "../../mundiales/Seleccion-mexicana-HIRVING.jpeg";

export default function Hero() {
  return (
    <div className="img-section-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "68vh" }}>

      {/* Columna izquierda — texto */}
      <div style={{
        padding: "64px 6vw",
        display: "flex", flexDirection: "column", justifyContent: "center",
        background: "linear-gradient(160deg, #f2f2f7 0%, #edf5f0 60%, #f2f2f7 100%)",
        borderBottom: "1px solid var(--border-mid)",
      }}>
        <p style={{
          fontFamily: "var(--mono)", fontSize: 9, fontWeight: 700,
          letterSpacing: "0.25em", textTransform: "uppercase",
          color: "var(--silver)", marginBottom: 16,
        }}>
          México · Grupo A · Co-anfitrión · FIFA World Cup 2026
        </p>

        <h1 style={{
          fontFamily: "var(--sans)", fontSize: "clamp(32px, 4.5vw, 56px)",
          fontWeight: 900, letterSpacing: "-0.03em",
          color: "var(--text)", lineHeight: 1.0,
          textTransform: "uppercase", marginBottom: 20,
        }}>
          Háganos creer<br />
          <em style={{ fontStyle: "italic", color: "var(--on-color)" }}>como en 2014.</em>
        </h1>

        <div style={{
          width: 52, height: 3, background: "var(--on-color)", marginBottom: 22,
          boxShadow: "0 0 6px rgba(22,101,52,0.9), 0 0 18px rgba(22,101,52,0.55)",
        }} />

        <p style={{
          fontFamily: "var(--serif)", fontSize: 14,
          color: "var(--text-sec)", lineHeight: 1.78,
          maxWidth: 520, marginBottom: 14,
        }}>
          Llevamos treinta y dos años viendo el mismo partido. El cuarto. El de la
          ilusión que dura tres semanas y se acaba en noventa minutos. El de la
          caravana al aeropuerto y el aeropuerto de regreso. En 1994 nos eliminó
          Bulgaria en penales. En 2002 los propios Estados Unidos, que ni
          siquiera era potencia. En 2010 Argentina nos metió un gol de Tévez que
          estaba tres metros en fuera de lugar y el árbitro lo validó. En 2014
          fue el torneo de Ochoa, empatamos con Brasil, llegamos bien — y Robben
          se tiró en el 94 para sacar un penal que no existió. En 2018 le ganamos
          a Alemania, al campeón del mundo, y nos fuimos igual contra Brasil.
          Siempre el cuarto partido, nunca el quinto.
        </p>

        <p style={{
          fontFamily: "var(--serif)", fontSize: 14,
          color: "var(--text-sec)", lineHeight: 1.78,
          maxWidth: 520, marginBottom: 14,
        }}>
          Luego vino 2022 y ni eso. Qatar fue la peor versión de México en un
          Mundial desde 1978: cuatro puntos, diferencia de goles negativa, afuera
          en grupos. El piso se cayó por completo.
        </p>

        <p style={{
          fontFamily: "var(--serif)", fontSize: 14,
          color: "var(--text-sec)", lineHeight: 1.78,
          maxWidth: 520,
        }}>
          2026 es en casa — aunque con matices. México es co-anfitrión junto a
          Estados Unidos y Canadá, pero la distribución no es equitativa: 78 de
          104 partidos se juegan en suelo americano. México recibe 13. Los grupos
          y la ronda de 32 pueden jugarse en el Azteca o en Monterrey, pero de
          cuartos en adelante, si México llega, ya no hay Azteca. La ventaja de
          local existe, pero solo dura hasta donde dure la ilusión.
        </p>
      </div>

      {/* Columna derecha — imagen */}
      <div className="img-col" style={{ position: "relative", overflow: "hidden" }}>
        <img
          src={imgHero}
          alt="Selección Mexicana"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)" }} />
      </div>

    </div>
  );
}
