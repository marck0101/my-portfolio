import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import "./home.css";

// URL DA API: /movie/now_playing?api_key=28fc232cc001c31e8a031f419d0a14ca&language=pt-BR

function Home() {
  const [filmes, setFilmes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teste, setTeste] = useState();

  useEffect(() => {
    async function loadFilmes() {
      //                              o movie/now_playing é a rota de get do site https://developers.themoviedb.org/3/movies/get-now-playing que é de filmes em cartaz
      const response = await api.get("movie/now_playing", {
        params: {
          // atualizei a key para pegar com a minha conta
          api_key: "cc11476b835ab07d6e712d9d4d7ae788",
          language: "pt-BR",
          page: 1,
        },
      });

      //console.log(response.data.results.slice(0, 10));

      // console.log('AQUI=>',response.data.results)
      setFilmes(response.data.results.slice(0, 10));
      setLoading(false);

      setTeste(response.data.results);
      // console.log("AQUI=>", teste);

      console.log("response.data.results", response.data.results);
      console.log("response.data", response.data);
      console.log("response", response);
    }

    loadFilmes();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <h2>Carregando filmes...</h2>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="lista-filmes">
        {filmes.map((filme) => {
          return (
            <article key={filme.id}>
              <h5>{filme.overview}</h5>
              <strong>{filme.title}</strong>
              <img
                src={`https://image.tmdb.org/t/p/original/${filme.poster_path}`}
                alt={filme.title}
              />
              <Link to={`/filme/${filme.id}`}>Acessar</Link>
            </article>
          );
        })}
        <button onClick={teste}>teste</button>
      </div>
    </div>
  );
}

export default Home;
