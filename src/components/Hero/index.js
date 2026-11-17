import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaCheck, FaInfoCircle, FaPlus, FaStar } from "react-icons/fa";
import { imagem } from "../../services/tmdb";
import { ano, duracao, listaNomes, nota } from "../../utils/formato";
import useExtras from "../../hooks/useExtras";
import useMinhaLista from "../../hooks/useMinhaLista";
import Classificacao from "../Classificacao";
import "./hero.css";

// Destaque do período: o filme mais relevante do filtro atual, em tela cheia
function Hero({ filme, rotulo }) {
  const extras = useExtras(filme?.id, !!filme);
  const { naLista, alternar } = useMinhaLista();

  if (!filme) {
    return <section className="hero hero--vazio esqueleto" aria-hidden="true" />;
  }

  const salvo = naLista(filme.id);

  function onLista() {
    const adicionou = alternar(filme);
    toast(adicionou ? `${filme.title} entrou na sua lista` : `${filme.title} saiu da sua lista`, {
      toastId: `lista-${filme.id}`,
    });
  }

  const fundo = imagem(filme.backdrop_path, "w1280");
  const fundoPequeno = imagem(filme.backdrop_path, "w780");

  return (
    <section className="hero" aria-label={`Destaque: ${filme.title}`}>
      {fundo && (
        <img
          className="hero__fundo"
          src={fundo}
          srcSet={`${fundoPequeno} 780w, ${fundo} 1280w`}
          sizes="100vw"
          alt=""
          fetchpriority="high"
        />
      )}
      <div className="hero__veu" />

      <div className="hero__conteudo conteudo">
        <p className="hero__rotulo mono">{rotulo}</p>
        <h1 className="hero__titulo">{filme.title}</h1>

        <p className="hero__meta mono">
          {filme.vote_average > 0 && (
            <span className="hero__nota">
              <FaStar aria-hidden="true" /> {nota(filme.vote_average)}
            </span>
          )}
          {ano(filme.release_date) && <span>{ano(filme.release_date)}</span>}
          {extras?.duracao && <span>{duracao(extras.duracao)}</span>}
          {extras?.classificacao && <Classificacao valor={extras.classificacao} grande />}
          {extras?.generos?.length > 0 && <span>{extras.generos.slice(0, 3).join(" · ")}</span>}
        </p>

        {filme.overview && <p className="hero__sinopse">{filme.overview}</p>}

        {extras?.direcao?.length > 0 && (
          <p className="hero__direcao">
            <span>Direção</span> {listaNomes(extras.direcao, 3)}
          </p>
        )}

        <div className="hero__acoes">
          <Link to={`/filme/${filme.id}`} className="btn btn--primario">
            <FaInfoCircle aria-hidden="true" /> Ver detalhes
          </Link>
          <button type="button" className="btn btn--vidro" onClick={onLista} aria-pressed={salvo}>
            {salvo ? <FaCheck aria-hidden="true" /> : <FaPlus aria-hidden="true" />}
            {salvo ? "Na minha lista" : "Minha lista"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
