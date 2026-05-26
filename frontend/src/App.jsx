import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Cargando from "./pages/Cargando";
import Compras from "./pages/compras";
import DashboardGuard from "./pages/dashboard/DashboardGuard";
import DashboardLogin from "./pages/dashboard/DashboardLogin";
import EventosDashboard from "./pages/dashboard/EventosDashboard";
import IndexDashboard from "./pages/dashboard/IndexDashboard";
import UsuariosDashboard from "./pages/dashboard/UsuariosDashboard";
import Evento1 from "./pages/eventos/Evento1";
import Evento3 from "./pages/eventos/Evento3";
import Evento4 from "./pages/eventos/evento4";
import Evento5 from "./pages/eventos/Evento5";
import Evento6 from "./pages/eventos/Evento6";
import Informacion from "./pages/Informacion";
import Inicio from "./pages/Inicio";
import Login from "./pages/Login";
import PaginaNoEncontrada from "./pages/PaginaNoEncontrada";
import Perfil from "./pages/Perfil";
import Registro from "./pages/Registro";
import VerBoletos from "./pages/VerBoletos";
import PoliticaCompra from "./pages/PoliticaCompra";
import PoliticaPrivacidad from "./pages/PoliticaPrivacidad";
import TerminosUso from "./pages/TerminosUso";
import AvisoLegal from "./pages/AvisoLegal";

function RouteTransition() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const loading = location.pathname !== displayLocation.pathname;

  useEffect(() => {
    if (location.pathname === displayLocation.pathname) {
      return;
    }

    const timer = window.setTimeout(() => {
      setDisplayLocation(location);
    }, 50);

    return () => window.clearTimeout(timer);
  }, [location, displayLocation.pathname]);

  return (
    <>
      <Routes location={displayLocation}>
        <Route path="/" element={<Inicio />} />
        <Route path="/nosotros" element={<Informacion />} />
        <Route path="/compras" element={<Compras />} />
        <Route path="/login" element={<Login />} />
        <Route path="/ver-boletos" element={<VerBoletos />} />
        <Route path="/evento-1" element={<Evento1 />} />
        <Route path="/evento-3" element={<Evento3 />} />
        <Route path="/evento-4" element={<Evento4 />} />
        <Route path="/evento-5" element={<Evento5 />} />
        <Route path="/evento-6" element={<Evento6 />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/dashboard/login" element={<DashboardLogin />} />
        <Route path="/politica-compra" element={<PoliticaCompra />} />
        <Route path="/politica-privacidad" element={<PoliticaPrivacidad />} />
        <Route path="/aviso-legal" element={<AvisoLegal />} />
        <Route path="/terminos-uso" element={<TerminosUso />} />
        

        <Route element={<DashboardGuard />}>
          <Route path="/dashboard" element={<IndexDashboard />} />
          <Route path="/dashboard/eventos" element={<EventosDashboard />} />
          <Route path="/dashboard/usuarios" element={<UsuariosDashboard />} />
        </Route>

        <Route path="*" element={<PaginaNoEncontrada />} />
      </Routes>

      {loading && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100"
          style={{ zIndex: 2000 }}
        >
          <Cargando />
        </div>
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <RouteTransition />
    </BrowserRouter>
  );
}

export default App;
