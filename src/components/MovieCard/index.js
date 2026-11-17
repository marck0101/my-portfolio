import { memo, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaCheck, FaPlus, FaStar } from "react-icons/fa";
import { imagem } from "../../services/tmdb";
import { ano, duracao, listaNomes, nota } from "../../utils/formato";
import useEmTela from "../../hooks/useEmTela";
import useExtras from "../../hooks/useExtras";
import useMinhaLista from "../../hooks/useMinhaLista";
import Classificacao from "../Classificacao";
import "./movie-card.css";

// Capa do filme no catálogo. Poster + nota; embaixo, ano · duração ·
// classificação e direção (pedidos só quando o card chega na tela).
// No hover (mouse), a sinopse e os gêneros sobem sobre o poster.
function MovieCard({ filme, prioridade = false }) {
  const ref = useRef(null);
  const visivel = useEmTela(ref);
  const extras = useExtras(filme.id, visivel);
  const { naLista, alternar } = useMinhaLista();
  const salvo = naLista(filme.id);

  const poster = imagem(filme.poster_path, "w342");
  const posterGrande = imagem(filme.poster_path, "w500");
  const carregandoExtras = visivel && !extras;

  function onLista() {
    const adicionou = alternar(filme);
    toast(adicionou ? `${filme.title} entrou na sua lista` : `${filme.title} saiu da sua lista`, {
      toastId: `lista-${filme.id}`,
    });
  }

  return (
    <article className="card" ref={ref}>
      <Link to={`/filme/${filme.id}`} className="card__link">
        <div className="card__poster">
          {poster ? (
            <img
              src={poster}
              srcSet={`${poster} 342w, ${posterGrande} 500w`}
              sizes="(max-width: 600px) 45vw, 220px"
              alt=""
              loading={prioridade ? "eager" : "lazy"}
              width="342"
              height="513"
            />
          ) : (
            <div className="card__sem-poster" aria-hidden="true">
              {filme.title}
            </div>
          )}

          {filme.vote_average > 0 && (
            <span className="card__nota mono" aria-label={`Nota ${nota(filme.vote_average)} de 10`}>
              <FaStar aria-hidden="true" /> {nota(filme.vote_average)}
            </span>
          )}

          <div className="card__hover" aria-hidden="true">
            {extras?.generos?.length > 0 && (
              <p className="card__generos">{extras.generos.slice(0, 3).join(" · ")}</p>
            )}
            {filme.overview && <p className="card__sinopse">{filme.overview}</p>}
          </div>
        </div>

        <div className="card__info">
          <h3 className="card__titulo">{filme.title}</h3>
          <p className="card__meta mono">
            {ano(filme.release_date) && <span>{ano(filme.release_date)}</span>}
            {extras?.duracao && <span>{duracao(extras.duracao)}</span>}
            {extras?.classificacao && <Classificacao valor={extras.classificacao} />}
            {carregandoExtras && <span className="esqueleto card__esq" aria-hidden="true" />}
          </p>
          <p className="card__direcao">
            {extras?.direcao?.length > 0 ? (
              <>
                <span className="card__rotulo">Direção</span> {listaNomes(extras.direcao)}
              </>
            ) : carregandoExtras ? (
              <span className="esqueleto card__esq card__esq--longo" aria-hidden="true" />
            ) : null}
          </p>
        </div>
      </Link>

      <button
        type="button"
        className="card__lista"
        onClick={onLista}
        aria-pressed={salvo}
        aria-label={salvo ? `Tirar ${filme.title} da minha lista` : `Adicionar ${filme.title} à minha lista`}
        title={salvo ? "Na minha lista" : "Adicionar à minha lista"}
      >
        {salvo ? <FaCheck aria-hidden="true" /> : <FaPlus aria-hidden="true" />}
      </button>
    </article>
  );
}

export function MovieCardEsqueleto() {
  return (
    <div className="card" aria-hidden="true">
      <div className="card__poster esqueleto" />
      <div className="card__info">
        <span className="esqueleto card__esq card__esq--titulo" />
        <span className="esqueleto card__esq" />
      </div>
    </div>
  );
}

export default memo(MovieCard);
