import { useState, useEffect } from "react";
import Flag from "./ui/Flag.jsx";

const NAV = [
  { id: "s01", label: "Ruta" },
  { id: "s02", label: "Dificultad" },
  { id: "s03", label: "Partidos" },
  { id: "s04", label: "Escenarios" },
  { id: "s05", label: "Riesgo" },
  { id: "s06", label: "Caminos" },
  { id: "s07", label: "Historia" },
  { id: "s08", label: "Localía" },
  { id: "s09", label: "Grupo A" },
  { id: "s10", label: "Puntos" },
  { id: "s11", label: "Penales" },
  { id: "s12", label: "xG" },
  { id: "s13", label: "Rivales" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${scrolled ? "bg-mx-dark/95 backdrop-blur-md border-b border-mx-border shadow-lg shadow-black/40" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-14">
          {/* logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <Flag code="mx" className="w-8 h-6 rounded shadow" alt="México" />
            <span className="text-sm font-black tracking-tight text-white group-hover:text-mx-green transition-colors">
              MX<span className="text-mx-green">2026</span>
            </span>
          </a>

          {/* nav */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="px-2.5 py-1 text-xs font-medium text-gray-500 hover:text-mx-green
                  rounded-md hover:bg-mx-green/5 transition-colors whitespace-nowrap"
              >
                {n.label}
              </a>
            ))}
          </nav>

          {/* badge */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 border border-mx-green/30 rounded-full px-3 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-mx-green animate-pulse" />
              <span className="text-xs font-semibold text-mx-green">FIFA Rank #15</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
