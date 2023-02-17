import { Link } from "react-router-dom";
import "./style.css";

function Header() {
  function CardClicavel() {
    // console.log("eu vou para o google");
    window.location = "http://localhost:3000";
  }
  return (
    <header>
      <div class="clicavel" onClick={CardClicavel}>
        <h2>Marcos Henrique C.</h2>
      </div>

      <div className="menu">
        <Link to="/">Home</Link>
        <Link to="/contato">Contate-me</Link>
        <Link to="/teste">Teste</Link>
        {/* <Link to="/relatorios">Relatórios</Link> */}
      </div>
    </header>
  );
}

export default Header;
