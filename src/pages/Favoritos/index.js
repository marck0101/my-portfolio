import { Link } from "react-router-dom";
import Grade from "../../components/Grade";
import useMinhaLista from "../../hooks/useMinhaLista";
import useSeo from "../../hooks/useSeo";
import "./favoritos.css";

// Minha lista: filmes salvos neste navegador (localStorage)
function Favoritos() {
  const { lista } = useMinhaLista();

  // Lista pessoal (localStorage): fora do índice dos buscadores
  useSeo({
    titulo: "Minha lista · Next Movies",
    descricao: "Filmes que você salvou neste navegador para ver depois.",
    caminho: "/minha-lista",
    indexar: false,
  });

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
