import { BrowserRouter, Routes, Route } from "react-router-dom";
import Erro from "./Componentes/Erro/Erro";
// import Footer from "./Componentes/Footer/Footer";
import Header from "./Componentes/Header/Header";
import Home from "./Componentes/Home/Home";

import Teste from "./Teste";

function RoutesApp() {
  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/teste" element={<Teste />} />

        <Route path="*" errorElement={<Erro />} />
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  );
}
export default RoutesApp;
