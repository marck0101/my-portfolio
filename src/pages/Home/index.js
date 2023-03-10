import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import "./home.css";
import { Grid } from "@mui/material";
//minha key URL DA API:https://api.themoviedb.org/3/movie/550?api_key=cc11476b835ab07d6e712d9d4d7ae788  &language=pt-BR
// nova chaave => ac9e5e514ef9fdf5c60f3e541419fba0

function Home() {
  const [filmes, setFilmes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFilmes() {
      //                              o movie/now_playing é a rota de get do site https://developers.themoviedb.org/3/movies/get-now-playing que é de filmes em cartaz
      const response = await api.get("/movie/upcoming", {
      // const response = await api.get("movie/now_playing", {
        params: {
          // atualizei a key para pegar com a minha conta
          api_key: "ac9e5e514ef9fdf5c60f3e541419fba0",
          language: "pt-BR",
          page: 1,
        },
      });
      setFilmes(response.data.results.slice(0, 10))
      setLoading(false);
    }

    loadFilmes();
  }, []);

  if (loading) {
    return (
      <>
        <Skeleton variant="rectangular" width={"100%"} height={318} />
      </>
    );
  }

  return (
    <div className="container">
      <div className="lista-filmes">
        {filmes.map((filme) => {
          return (
            <article key={filme?.id}>
              <strong>{filme?.title}</strong>
              <img
                src={`https://image.tmdb.org/t/p/original/${filme?.poster_path}`}
                alt={filme?.title}
              />
              <Link to={`/filme/${filme.id}`}>Acessar</Link>
              <h5>{filme.overview}</h5>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
