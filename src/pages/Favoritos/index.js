import { useEffect } from "react";
import { Link } from "react-router-dom";
import Grade from "../../components/Grade";
import useMinhaLista from "../../hooks/useMinhaLista";
import "./favoritos.css";

// Minha lista: filmes salvos neste navegador (localStorage)
function Favoritos() {
  const { lista } = useMinhaLista();

  useEffect(() => {
    document.title = "Minha lista · Next Movies";
  }, []);

  return (
    <main className="lista conteudo">
      <header className="lista__cabecalho">
        <h1>Minha lista</h1>
        <p className="mono">
          {lista.length} {lista.length === 1 ? "filme salvo" : "filmes salvos"} neste navegador
        </p>
      </header>

      {lista.length === 0 ? (
        <div className="lista__vazia">
          <p>Sua lista está vazia. Use o botão + na capa de um filme para guardar e ver depois.</p>
          <Link to="/" className="btn btn--destaque">
            Explorar o catálogo
          </Link>
        </div>
      ) : (
        <Grade filmes={lista} carregando={false} temMais={false} />
      )}
    </main>
  );
}

export default Favoritos;
