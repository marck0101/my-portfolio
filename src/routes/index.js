import { Routes, Route } from "react-router-dom";
import Admin from "../pages/Admin";

import Home from "../pages/Home";
import Register from "../pages/Register";

function RoutesApp() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default RoutesApp;
