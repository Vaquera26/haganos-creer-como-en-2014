import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Hero from "./components/sections/Hero.jsx";
import S01_RutaQuintoPartido from "./components/sections/S01_RutaQuintoPartido.jsx";
import S02_MapaDificultad from "./components/sections/S02_MapaDificultad.jsx";
import S03_ProbabilidadPartido from "./components/sections/S03_ProbabilidadPartido.jsx";
import S04_EscenariosClasificacion from "./components/sections/S04_EscenariosClasificacion.jsx";
import S05_IndiceRiesgo from "./components/sections/S05_IndiceRiesgo.jsx";
import S06_ArbolCaminos from "./components/sections/S06_ArbolCaminos.jsx";
import S07_MexicoVsHistoria from "./components/sections/S07_MexicoVsHistoria.jsx";
import S08_EfectoLocalia from "./components/sections/S08_EfectoLocalia.jsx";
import S09_RadiografiaGrupo from "./components/sections/S09_RadiografiaGrupo.jsx";
import S10_PuntosNecesarios from "./components/sections/S10_PuntosNecesarios.jsx";
import S11_ProbabilidadPenales from "./components/sections/S11_ProbabilidadPenales.jsx";
import S12_GolesEsperados from "./components/sections/S12_GolesEsperados.jsx";
import S13_RankingRivales from "./components/sections/S13_RankingRivales.jsx";

const DIVIDER = () => (
  <div className="max-w-5xl mx-auto px-4 sm:px-8">
    <div className="h-px bg-gradient-to-r from-transparent via-mx-border to-transparent" />
  </div>
);

export default function App() {
  return (
    <div className="min-h-screen bg-mx-dark">
      <Header />
      <main>
        <Hero />
        <DIVIDER />
        <S01_RutaQuintoPartido />
        <DIVIDER />
        <S03_ProbabilidadPartido />
        <DIVIDER />
        <S09_RadiografiaGrupo />
        <DIVIDER />
        <S04_EscenariosClasificacion />
        <DIVIDER />
        <S10_PuntosNecesarios />
        <DIVIDER />
        <S02_MapaDificultad />
        <DIVIDER />
        <S06_ArbolCaminos />
        <DIVIDER />
        <S07_MexicoVsHistoria />
        <DIVIDER />
        <S08_EfectoLocalia />
        <DIVIDER />
        <S05_IndiceRiesgo />
        <DIVIDER />
        <S12_GolesEsperados />
        <DIVIDER />
        <S11_ProbabilidadPenales />
        <DIVIDER />
        <S13_RankingRivales />
      </main>
      <Footer />
    </div>
  );
}
