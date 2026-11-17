import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowLeft, FaCheck, FaPlay, FaPlus, FaStar, FaUser } from "react-icons/fa";
import {
  REGIAO,
  classificacaoBR,
  detalhesDoFilme,
  escolherTrailer,
  imagem,
  lancamentoBR,
} from "../../services/tmdb";
import { ano, dataLonga, dolares, duracao, idioma, nota, numero } from "../../utils/formato";
import useMinhaLista from "../../hooks/useMinhaLista";
import useSeo, { resumir, SITE } from "../../hooks/useSeo";
import Classificacao from "../../components/Classificacao";
import Fileira from "../../components/Fileira";
import MovieCard from "../../components/MovieCard";
import Trailer from "../../components/Trailer";
import "./filme-info.css";

const TIPOS_ONDE = [
  { chave: "flatrate", rotulo: "Assinatura" },
  { chave: "free", rotulo: "Grátis" },
  { chave: "ads", rotulo: "Com anúncios" },
  { chave: "rent", rotulo: "Alugar" },
  { chave: "buy", rotulo: "Comprar" },
];

// Título, descrição e JSON-LD Movie da página do filme. A nota do TMDB NÃO vai
// como aggregateRating: o Google proíbe marcar avaliações vindas de outro site.
function dadosSeo(f) {
  const crew = f.credits?.crew || [];
  const direcao = [...new Set(crew.filter((p) => p.job === "Director").map((p) => p.name))];
  const generos = (f.genres || []).map((g) => g.name);
  const classificacao = classificacaoBR(f.release_dates);
  const trailer = escolherTrailer(f.videos);
  const url = `${SITE}/filme/${f.id}`;
  const anoFilme = ano(f.release_date);

  const partes = [duracao(f.runtime), generos.slice(0, 2).join(" e "), direcao.length ? `direção de ${direcao[0]}` : null]
    .filter(Boolean)
    .join(", ");
  const titulo = `${f.title}${anoFilme ? ` (${anoFilme})` : ""} · Next Movies`;
  const descricao = resumir(`${f.title}${anoFilme ? ` (${anoFilme})` : ""}${partes ? `: ${partes}.` : "."} ${f.overview || ""}`);

  const jsonld = JSON.parse(
    JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Movie",
      "@id": `${url}#filme`,
      url,
      name: f.title,
      alternateName: f.original_title !== f.title ? f.original_title : undefined,
      description: f.overview || undefined,
      image: f.poster_path ? imagem(f.poster_path, "w500") : undefined,
      datePublished: f.release_date || undefined,
      genre: generos.length ? generos : undefined,
      duration: f.runtime ? `PT${Math.floor(f.runtime / 60)}H${f.runtime % 60}M` : undefined,
      inLanguage: f.original_language || undefined,
      contentRating: classificacao ? `ClassInd ${classificacao}` : undefined,
      director: direcao.length ? direcao.map((name) => ({ "@type": "Person", name })) : undefined,
      actor: (f.credits?.cast || []).slice(0, 8).map((p) => ({ "@type": "Person", name: p.name })),
      productionCompany: (f.production_companies || []).slice(0, 3).map((c) => ({ "@type": "Organization", name: c.name })),
      trailer: trailer
        ? {
            "@type": "VideoObject",
            name: trailer.name,
            embedUrl: `https://www.youtube-nocookie.com/embed/${trailer.key}`,
            thumbnailUrl: `https://i.ytimg.com/vi/${trailer.key}/hqdefault.jpg`,
            uploadDate: (trailer.published_at || f.release_date || "").slice(0, 10) || undefined,
          }
        : undefined,
      sameAs: `https://www.themoviedb.org/movie/${f.id}`,
    })
  );

  return {
    titulo,
    descricao,
    imagem: f.backdrop_path ? imagem(f.backdrop_path, "w780") : f.poster_path ? imagem(f.poster_path, "w500") : undefined,
    jsonld,
  };
}

function nomesPorFuncao(crew, funcoes) {
  const nomes = crew.filter((p) => funcoes.includes(p.job)).map((p) => p.name);
  return [...new Set(nomes)];
}

function Filme() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [filme, setFilme] = useState(null);
  const [erro, setErro] = useState(false);
  const [trailerAberto, setTrailerAberto] = useState(false);
  const { naLista, alternar } = useMinhaLista();

  useEffect(() => {
    const ctrl = new AbortController();
    setFilme(null);
    setErro(false);
    setTrailerAberto(false);
    window.scrollTo(0, 0);
    detalhesDoFilme(id, ctrl.signal)
      .then(setFilme)
      .catch((e) => {
        if (e.name === "AbortError") return;
        if (e.status === 404) navigate("/nao-encontrado", { replace: true });
        else setErro(true);
      });
    return () => ctrl.abort();
  }, [id, navigate]);

  const seo = useMemo(() => (filme ? dadosSeo(filme) : null), [filme]);
  useSeo({
    titulo: seo?.titulo,
    descricao: seo?.descricao,
    caminho: filme ? `/filme/${filme.id}` : undefined,
    imagem: seo?.imagem,
    jsonld: seo?.jsonld,
  });

  if (erro) {
    return (
      <main className="filme filme--aviso conteudo">
        <p>Não consegui carregar este filme agora.</p>
        <button type="button" className="btn btn--destaque" onClick={() => window.location.reload()}>
          Tentar de novo
        </button>
      </main>
    );
  }

  if (!filme) return <FilmeEsqueleto />;

  const crew = filme.credits?.crew || [];
  const direcao = nomesPorFuncao(crew, ["Director"]);
  const roteiro = nomesPorFuncao(crew, ["Screenplay", "Writer", "Story", "Novel"]);
  const musica = nomesPorFuncao(crew, ["Original Music Composer", "Music"]);
  const elenco = (filme.credits?.cast || []).slice(0, 15);
  const classificacao = classificacaoBR(filme.release_dates);
  const estreiaBR = lancamentoBR(filme.release_dates);
  const trailer = escolherTrailer(filme.videos);
  const onde = filme["watch/providers"]?.results?.[REGIAO];
  const semelhantes = (filme.recommendations?.results || []).filter((f) => f.poster_path).slice(0, 16);
  const salvo = naLista(filme.id);

  function onLista() {
    const adicionou = alternar(filme);
    toast(adicionou ? `${filme.title} entrou na sua lista` : `${filme.title} saiu da sua lista`, {
      toastId: `lista-${filme.id}`,
    });
  }

  const ficha = [
    ["Direção", direcao.join(", ")],
    ["Roteiro", roteiro.slice(0, 4).join(", ")],
    ["Música", musica.slice(0, 2).join(", ")],
    ["Estreia no Brasil", dataLonga(estreiaBR)],
    ["Estreia mundial", estreiaBR !== filme.release_date ? dataLonga(filme.release_date) : null],
    ["Idioma original", filme.original_language && idioma(filme.original_language)],
    ["Produção", (filme.production_companies || []).slice(0, 3).map((c) => c.name).join(", ")],
    ["Orçamento", dolares(filme.budget)],
    ["Bilheteria", dolares(filme.revenue)],
  ].filter(([, valor]) => valor);

  return (
    <main className="filme">
      <section className="filme__topo">
        {filme.backdrop_path && (
          <img
            className="filme__fundo"
            src={imagem(filme.backdrop_path, "w1280")}
            srcSet={`${imagem(filme.backdrop_path, "w780")} 780w, ${imagem(filme.backdrop_path, "w1280")} 1280w`}
            sizes="100vw"
            alt=""
          />
        )}
        <div className="filme__veu" />

        <div className="filme__cabecalho conteudo">
          <button type="button" className="filme__voltar" onClick={() => navigate(-1)}>
            <FaArrowLeft aria-hidden="true" /> Voltar
          </button>

          <div className="filme__principal">
            <div className="filme__poster">
              {filme.poster_path ? (
                <img src={imagem(filme.poster_path, "w500")} alt={`Pôster de ${filme.title}`} />
              ) : (
                <div className="filme__sem-poster">{filme.title}</div>
              )}
            </div>

            <div className="filme__textos">
              <h1 className="filme__titulo">{filme.title}</h1>
              {filme.original_title !== filme.title && (
                <p className="filme__original">{filme.original_title}</p>
              )}

              <p className="filme__meta mono">
                {ano(filme.release_date) && <span>{ano(filme.release_date)}</span>}
                {classificacao && <Classificacao valor={classificacao} grande />}
                {filme.runtime > 0 && <span>{duracao(filme.runtime)}</span>}
                {filme.genres?.length > 0 && <span>{filme.genres.map((g) => g.name).join(" · ")}</span>}
              </p>

              {filme.vote_average > 0 && (
                <p className="filme__nota">
                  <FaStar aria-hidden="true" />
                  <strong className="mono">{nota(filme.vote_average)}</strong>
                  <span className="mono">/10 · {numero(filme.vote_count)} votos no TMDB</span>
                </p>
              )}

              {direcao.length > 0 && (
                <p className="filme__direcao">
                  <span>Direção</span> {direcao.join(", ")}
                </p>
              )}

              {filme.tagline && <p className="filme__tagline">“{filme.tagline}”</p>}

              <div className="filme__acoes">
                {trailer && (
                  <button type="button" className="btn btn--primario" onClick={() => setTrailerAberto(true)}>
                    <FaPlay aria-hidden="true" /> Assistir trailer
                  </button>
                )}
                <button type="button" className="btn btn--vidro" onClick={onLista} aria-pressed={salvo}>
                  {salvo ? <FaCheck aria-hidden="true" /> : <FaPlus aria-hidden="true" />}
                  {salvo ? "Na minha lista" : "Minha lista"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="filme__corpo conteudo">
        <section className="filme__bloco filme__sinopse">
          <h2>Sinopse</h2>
          <p>{filme.overview || "Este filme ainda não tem sinopse em português."}</p>
        </section>

        <aside className="filme__bloco filme__lateral">
          {ficha.length > 0 && (
            <dl className="filme__ficha">
              {ficha.map(([rotulo, valor]) => (
                <div key={rotulo}>
                  <dt>{rotulo}</dt>
                  <dd>{valor}</dd>
                </div>
              ))}
            </dl>
          )}
        </aside>

        <section className="filme__bloco filme__onde">
          <h2>Onde assistir</h2>
          {onde && TIPOS_ONDE.some((t) => onde[t.chave]?.length) ? (
            <>
              {TIPOS_ONDE.filter((t) => onde[t.chave]?.length).map((t) => (
                <div key={t.chave} className="filme__provedores">
                  <h3>{t.rotulo}</h3>
                  <ul>
                    {onde[t.chave].map((p) => (
                      <li key={p.provider_id} title={p.provider_name}>
                        <img src={imagem(p.logo_path, "w92")} alt={p.provider_name} loading="lazy" />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <a className="filme__fonte" href={onde.link} target="_blank" rel="noopener noreferrer">
                Ver opções no JustWatch ↗
              </a>
            </>
          ) : (
            <p className="filme__vazio">
              Ainda não está em nenhum streaming no Brasil
              {estreiaBR && estreiaBR > new Date().toISOString().slice(0, 10)
                ? `. Estreia nos cinemas em ${dataLonga(estreiaBR)}.`
                : "."}
            </p>
          )}
        </section>
      </div>

      {elenco.length > 0 && (
        <Fileira titulo="Elenco" largura="pessoa">
          {elenco.map((p) => (
            <figure key={p.credit_id} className="pessoa">
              <div className="pessoa__foto">
                {p.profile_path ? (
                  <img src={imagem(p.profile_path, "w185")} alt="" loading="lazy" />
                ) : (
                  <FaUser aria-hidden="true" />
                )}
              </div>
              <figcaption>
                <strong>{p.name}</strong>
                {p.character && <span>{p.character}</span>}
              </figcaption>
            </figure>
          ))}
        </Fileira>
      )}

      {semelhantes.length > 0 && (
        <div className="filme__semelhantes">
          <Fileira titulo="Títulos semelhantes">
            {semelhantes.map((f) => (
              <MovieCard key={f.id} filme={f} />
            ))}
          </Fileira>
        </div>
      )}

      <p className="filme__catalogo conteudo">
        <Link to="/" className="btn btn--vidro">
          Ver o catálogo
        </Link>
      </p>

      <Trailer video={trailer} aberto={trailerAberto} onFechar={() => setTrailerAberto(false)} />
    </main>
  );
}

function FilmeEsqueleto() {
  return (
    <main className="filme" aria-busy="true">
      <section className="filme__topo">
        <div className="filme__cabecalho conteudo">
          <div className="filme__principal">
            <div className="filme__poster esqueleto" />
            <div className="filme__textos">
              <span className="esqueleto" style={{ height: "2.6rem", width: "70%" }} />
              <span className="esqueleto" style={{ height: "1rem", width: "45%" }} />
              <span className="esqueleto" style={{ height: "1rem", width: "35%" }} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Filme;
