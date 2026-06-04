import Flag from "./ui/Flag.jsx";

export default function Footer() {
  return (
    <footer className="border-t border-mx-border mt-20 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Flag code="mx" className="w-8 h-6 rounded shadow" alt="México" />
            <div>
              <p className="text-sm font-black text-white">Haganos Creer Como en 2014</p>
              <p className="text-xs text-gray-600">México · FIFA World Cup 2026</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-600 leading-relaxed max-w-sm">
              Análisis generado con simulaciones Monte Carlo (100,000 iteraciones),
              modelo Elo-Poisson y datos FIFA abril 2026.
            </p>
            <p className="text-xs text-gray-700 mt-1">
              Los números son modelos, no profecías. El fútbol los rompe todos.
            </p>
          </div>

          <div className="text-right">
            <p className="text-2xl font-black text-gradient-mx">1.4%</p>
            <p className="text-xs text-gray-600">probabilidad de ser campeón</p>
            <p className="text-xs text-mx-green font-semibold mt-1">Pero el Azteca no sabe de porcentajes.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
