import React from "react";
import "./style.css";
// import { Link } from "react-router-dom";

function Header() {
  // function cardClicavel() {
  //   // console.log("eu vou para o google");
  //   window.location = "http://localhost:3000"; // acessar menu de relatório, dia, semana mês
  // }
  return (
    <>
      <header>
        <div>
          <h2>Marcos Henrique</h2>
        </div>

        {/* <div>
          <Link to="/">Home</Link>
          <Link to="/cadastroRelatorios">Cadastro</Link>
          <Link to="/ChartLine">ChartLine</Link>
        </div> */}
      </header>
    </>
  );
}
export default Header;
