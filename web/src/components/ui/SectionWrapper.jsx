export default function SectionWrapper({ id, number, title, subtitle, image, imageLeft = false, children }) {
  const texto = (
    <div style={{
      padding: "48px 5vw",
      display: "flex", flexDirection: "column", justifyContent: "center",
      background: "var(--bg-surface)",
      borderBottom: "1px solid var(--border)",
    }}>
      <h2 className="section-title" style={{ marginBottom: subtitle ? 14 : 0 }}>{title}</h2>
      {subtitle && <p className="section-desc">{subtitle}</p>}
    </div>
  );

  const foto = (
    <div className="img-col" style={{ position: "relative", overflow: "hidden" }}>
      <img
        src={image}
        alt={title}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.42)" }} />
    </div>
  );

  return (
    <section id={id} className="section" style={{ padding: image ? 0 : undefined }}>

      {image ? (
        <div className="img-section-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: 340 }}>
          {imageLeft ? foto : texto}
          {imageLeft ? texto : foto}
        </div>
      ) : (
        <div className="section-head">
          <h2 className="section-title" style={{ marginBottom: subtitle ? 10 : 0 }}>{title}</h2>
          {subtitle && <p className="section-desc" style={{ marginTop: 8 }}>{subtitle}</p>}
        </div>
      )}

      <div style={{ padding: image ? "40px 5vw 48px" : 0 }}>
        {children}
      </div>

    </section>
  );
}
