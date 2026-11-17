import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import Filme from "./pages/Filme";
import Favoritos from "./pages/Favoritos";
import Erro from "./pages/Erro";

import Header from "./components/Header";
import Footer from "./components/Footer";

// Página nova começa do topo (o catálogo só muda a query, então não rola)
function TopoAoTrocarPagina() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function RoutesApp() {
  return (
    <BrowserRouter>
      <TopoAoTrocarPagina />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/filme/:id" element={<Filme />} />
        <Route path="/minha-lista" element={<Favoritos />} />
        {/* endereço antigo da lista */}
        <Route path="/favoritos" element={<Favoritos />} />
        <Route path="*" element={<Erro />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default RoutesApp;
