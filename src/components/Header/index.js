import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import useMinhaLista from "../../hooks/useMinhaLista";
import "./header.css";

function Header() {
  const [rolou, setRolou] = useState(false);
  const { lista } = useMinhaLista();

  // Transparente sobre o destaque; sólido depois de rolar
  useEffect(() => {
    const onScroll = () => setRolou(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const classe = ({ isActive }) => `topo__link${isActive ? " topo__link--ativo" : ""}`;

  return (
    <header className={`topo${rolou ? " topo--solido" : ""}`}>
      <div className="topo__barra conteudo">
        <Link className="topo__logo" to="/" aria-label="Next Movies, início">
          Next<span>Movies</span>
        </Link>
        <nav aria-label="Principal">
          <ul className="topo__nav">
            <li>
              <NavLink to="/" end className={classe}>
                Catálogo
              </NavLink>
            </li>
            <li>
              <NavLink to="/minha-lista" className={classe}>
                Minha lista
                {lista.length > 0 && <span className="topo__contador mono">{lista.length}</span>}
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
