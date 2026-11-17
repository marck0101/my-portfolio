import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./erro.css";

function Erro() {
  useEffect(() => {
    document.title = "Página não encontrada · Next Movies";
  }, []);

  return (
    <main className="erro conteudo">
      <p className="erro__codigo mono">404</p>
      <h1>Essa página não está em cartaz</h1>
      <p>O endereço não existe ou o filme saiu do catálogo.</p>
      <Link to="/" className="btn btn--destaque">
        Ver o catálogo
      </Link>
    </main>
  );
}

export default Erro;
