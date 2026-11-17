import { useEffect, useRef } from "react";
import MovieCard, { MovieCardEsqueleto } from "../MovieCard";
import "./grade.css";

// Grade fluida de capas, com rolagem infinita (sentinela no fim da lista)
function Grade({ filmes, carregando, temMais, onMais, esqueletos = 12 }) {
  const sentinela = useRef(null);

  useEffect(() => {
    const el = sentinela.current;
    if (!el || !onMais || !("IntersectionObserver" in window)) return;
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && onMais(), {
      rootMargin: "800px 0px",
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [onMais]);

  return (
    <>
      <div className="grade">
        {filmes.map((filme, i) => (
          <MovieCard key={filme.id} filme={filme} prioridade={i < 6} />
        ))}
        {carregando &&
          Array.from({ length: filmes.length ? 6 : esqueletos }, (_, i) => <MovieCardEsqueleto key={`e${i}`} />)}
      </div>
      {onMais && temMais && (
        <div ref={sentinela} className="grade__mais">
          {!carregando && (
            <button type="button" className="btn btn--vidro" onClick={onMais}>
              Carregar mais filmes
            </button>
          )}
        </div>
      )}
    </>
  );
}

export default Grade;
