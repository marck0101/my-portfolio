import { BrowserRouter, Routes, Route } from "react-router-dom";
import Teste from "./Teste";

function RoutesApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Teste />} />
      </Routes>
    </BrowserRouter>
  );
}
export default RoutesApp;
