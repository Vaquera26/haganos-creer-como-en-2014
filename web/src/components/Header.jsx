const SECTIONS = [
  { id: "s09", label: "El Grupo" },
  { id: "s03", label: "Los Partidos" },
  { id: "s10", label: "Los Puntos" },
  { id: "s04", label: "Escenarios" },
  { id: "s08", label: "Localía" },
  { id: "s07", label: "Historia" },
  { id: "s02", label: "El Camino" },
  { id: "s06", label: "Los Rivales" },
  { id: "s13", label: "Ranking" },
  { id: "s12", label: "xG" },
  { id: "s05", label: "Riesgo" },
  { id: "s11", label: "Penales" },
  { id: "s01", label: "El Quinto" },
  { id: "s15", label: "El Sueño" },
];

export default function Header() {
  return (
    <header style={{
      borderBottom: "2px solid var(--text)",
      background: "var(--bg)",
      position: "sticky",
      top: 0,
      zIndex: 50,
      padding: "16px 5vw 0",
    }}>
      {/* fila superior */}
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
        <div>
          <p style={{
            fontFamily: "var(--mono)", fontSize: 8, fontWeight: 700,
            letterSpacing: "0.25em", textTransform: "uppercase",
            color: "var(--silver)", marginBottom: 4,
          }}>
            México · FIFA World Cup 2026 · Análisis Estadístico
          </p>
          <h1 style={{
            fontFamily: "var(--sans)", fontSize: 20, fontWeight: 900,
            letterSpacing: "-0.02em", textTransform: "uppercase",
            color: "var(--text)", lineHeight: 1,
          }}>
            Háganos Creer{" "}
            <em style={{ color: "var(--on-color)", fontStyle: "italic" }}>Como en 2014</em>
          </h1>
        </div>

        {/* métricas rápidas */}
        <div style={{ display: "flex", gap: 0, border: "1px solid var(--border-mid)", borderRadius: 8, overflow: "hidden", background: "var(--bg)" }}>
          {[
            { label: "FIFA Rank",  value: "#15",   color: "var(--on-color)" },
            { label: "P(Clasif.)", value: "92%",   color: "var(--on-color)" },
            { label: "P(R16)",     value: "43.4%", color: "var(--med-color)" },
            { label: "P(Campeón)", value: "1.4%",  color: "var(--red-color)" },
          ].map((s, i) => (
            <div key={s.label} style={{
              padding: "8px 16px", textAlign: "center",
              borderLeft: i > 0 ? "1px solid var(--border)" : "none",
            }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: 16, fontWeight: 900, color: s.color, letterSpacing: "-0.02em" }}>{s.value}</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 1 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* nav */}
      <div style={{
        display: "flex", gap: 20, borderTop: "1px solid var(--border-mid)",
        paddingTop: 8, paddingBottom: 12, overflowX: "auto", flexWrap: "nowrap",
      }}>
        {SECTIONS.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="nav-link">{s.label}</a>
        ))}
      </div>
    </header>
  );
}
