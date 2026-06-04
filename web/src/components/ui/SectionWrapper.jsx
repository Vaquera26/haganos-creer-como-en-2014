export default function SectionWrapper({ id, number, title, subtitle, quote, children, accent = "green" }) {
  const accentClass = {
    green:  "text-mx-green border-mx-green",
    red:    "text-mx-red   border-mx-red",
    gold:   "text-mx-gold  border-mx-gold",
  }[accent] ?? "text-mx-green border-mx-green";

  return (
    <section id={id} className="relative py-20 px-4 sm:px-8 max-w-5xl mx-auto">
      <div className="flex items-start gap-6 mb-10">
        <span className="section-number hidden sm:block">{String(number).padStart(2, "0")}</span>
        <div className="flex-1">
          <span className={`text-xs font-semibold tracking-widest uppercase border-b pb-1 ${accentClass}`}>
            Análisis #{String(number).padStart(2, "0")}
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-black leading-tight text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 text-base text-gray-400 max-w-2xl leading-relaxed">{subtitle}</p>
          )}
        </div>
      </div>

      {quote && (
        <blockquote className="mb-10 pl-4 border-l-2 border-mx-green">
          <p className="text-lg font-medium text-gray-300 italic">"{quote}"</p>
        </blockquote>
      )}

      {children}
    </section>
  );
}
