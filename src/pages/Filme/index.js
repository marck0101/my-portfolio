import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./filme-info.css";
import api from "../../services/api";
import { toast } from "react-toastify";

function Filme() {
  const { id } = useParams(); // Aqui pega o parametro id do filme escolhido
  const navigate = useNavigate();

  const [filme, setFilme] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFilme() {
      await api.get(`/movie/${id}`, {
          // espera a requisiçao, pega o fillme de tal 'id'
          params: {
            api_key: "ac9e5e514ef9fdf5c60f3e541419fba0", // passa a nossa  chave de acesso a API
            language: "pt-BR", // e trazer resulltados na lilngua portuguesa
          },
        })
        .then((response) => {
          //se encontrar o filme entra aqui
          setFilme(response.data);
          setLoading(false);
        })
        .catch(() => {
          // caso não encontre ele vai entrar aqui
          console.log("FILME NAO ENCONTRADO");
          navigate("/", { replace: true }); // vai redirecionar para a página de home
          return; // e o return vai parar a execução do codigo.
        });
    }

    loadFilme();

    return () => {
      console.log("COMPONENTE FOI DESMONTADO");
    };
  }, [navigate, id]);

  function salvarFilme() {
    const minhaLista = localStorage.getItem("@primeflix");

    let filmesSalvos = JSON.parse(minhaLista) || []; // se tiver dados pega de minhaLista, se não inicia como array vazio

    const hasFilme = filmesSalvos.some(
      (filmesSalvo) => filmesSalvo.id === filme.id); // validação para verificar se não há filmes duplicados
    // o metodo some é para verificar se há pelo menos um item com a comparação que eu fizer
    if (hasFilme) { // se já ouver algum filme na minha lista de salvo
      toast.warn("Esse filme já está na sua lista!");
      return;
    }

    filmesSalvos.push(filme);
    localStorage.setItem("@primeflix", JSON.stringify(filmesSalvos));
    toast.success("Filme salvo com sucesso!");
  }

  if (loading) {
    return (
      <div className="filme-info">
        <h1>Carregando detalhes...</h1>
      </div>
    );
  }

  return (
    <div className="filme-info">
      <h1>{filme.title}</h1>
      <img
        src={`https://image.tmdb.org/t/p/original/${filme.backdrop_path}`}
        alt={filme.title}
      />

      <h3>Sinopse</h3>
      <span>{filme.overview}</span>
      <strong>Avalição: {filme.vote_average} / 10</strong>

      <div className="area-buttons">
        <button onClick={salvarFilme}>Salvar</button>
        <button>
          <a
            target="blank"
            rel="external"
            href={`https://youtube.com/results?search_query=${filme.title} Trailer`}
          >
            Trailer
          </a>
        </button>
      </div>
    </div>
  );
}

export default Filme;
