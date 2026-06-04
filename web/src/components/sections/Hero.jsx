import Flag from "../ui/Flag.jsx";

const PARTIDOS = [
  { fecha: "11 Jun", rival: "Sudáfrica", flagCode: "za", sede: "Azteca" },
  { fecha: "18 Jun", rival: "Corea del Sur", flagCode: "kr", sede: "Guadalajara" },
  { fecha: "24 Jun", rival: "Chequia", flagCode: "cz", sede: "Azteca" },
];

export default function Hero() {
  return (
    <div className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* fondo decorativo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-mx-green opacity-[0.04] blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-mx-red opacity-[0.03] blur-[100px]" />
        {/* líneas decorativas */}
        <div className="absolute inset-0" style={{
          backgroundImage: "repeating-linear-gradient(90deg, rgba(0,104,71,0.03) 0px, rgba(0,104,71,0.03) 1px, transparent 1px, transparent 80px)",
        }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 pt-24 pb-16">
        {/* badge + bandera */}
        <div className="flex items-center gap-4 mb-8">
          <Flag code="mx" className="w-12 h-8 rounded shadow-lg" alt="México" />
          <div className="h-px flex-1 bg-gradient-to-r from-mx-green via-mx-gold to-mx-red opacity-40" />
          <span className="text-xs tracking-widest uppercase text-gray-500 font-semibold">FIFA World Cup 2026</span>
        </div>

        {/* título principal */}
        <h1 className="text-5xl sm:text-7xl font-black leading-[0.9] tracking-tighter mb-6">
          <span className="block text-white">Haganos</span>
          <span className="block text-gradient-mx">Creer</span>
          <span className="block text-white">Como en 2014.</span>
        </h1>

        {/* narrativa */}
        <p className="max-w-2xl text-lg sm:text-xl text-gray-300 leading-relaxed mb-4">
          Desde aquel penal de Robben que no existió, México lleva cargando la misma herida:
          el quinto partido. Siete mundiales seguidos llegando al mismo muro. Siete veces el mismo avión de regreso.
        </p>
        <p className="max-w-2xl text-lg sm:text-xl text-gray-300 leading-relaxed mb-12">
          El 2026 es diferente. <span className="text-mx-gold font-bold">Somos sede.</span> El Azteca vuelve a rugir.
          Los rivales llegan sin aire a 2,240 metros sobre el nivel del mar. Si hay un año para romper la maldición,
          es este. Aquí está el análisis completo — con números, con probabilidades y con todo el corazón verde-blanco-rojo.
        </p>

        {/* partidos fixture */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-12">
          {PARTIDOS.map((p) => (
            <div key={p.rival}
              className="flex items-center gap-4 bg-mx-card border border-mx-border rounded-xl p-4 glow-green">
              <Flag code={p.flagCode} className="w-10 h-7 rounded shadow" alt={p.rival} />
              <div>
                <p className="text-xs text-gray-500 font-medium">{p.fecha} · {p.sede}</p>
                <p className="text-sm font-bold text-white">vs {p.rival}</p>
              </div>
            </div>
          ))}
        </div>

        {/* stats rápidas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "FIFA Ranking", value: "#15", accent: "text-mx-green" },
            { label: "P(Clasificar)", value: "92%", accent: "text-mx-green" },
            { label: "P(R16)", value: "43%", accent: "text-mx-gold" },
            { label: "P(Campeón)", value: "1.4%", accent: "text-gray-300" },
          ].map((s) => (
            <div key={s.label} className="bg-mx-card border border-mx-border rounded-xl p-4 text-center">
              <p className={`text-3xl font-black ${s.accent}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>

        {/* scroll indicator */}
        <div className="flex justify-center mt-16">
          <div className="flex flex-col items-center gap-2 text-gray-600 animate-bounce">
            <span className="text-xs tracking-widest uppercase">Ver el análisis</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
