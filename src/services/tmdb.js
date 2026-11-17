// Camada de dados do TMDB (https://developer.themoviedb.org/reference).
// A chave v3 é pública por natureza num site estático; pode ser trocada por
// REACT_APP_TMDB_KEY no ambiente de build sem mexer no código.
const API = "https://api.themoviedb.org/3";
const KEY = process.env.REACT_APP_TMDB_KEY || "ac9e5e514ef9fdf5c60f3e541419fba0";

export const REGIAO = "BR";

export function imagem(path, size = "w500") {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
}

async function get(path, params = {}, signal) {
  const query = new URLSearchParams({ api_key: KEY, language: "pt-BR" });
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") query.set(k, v);
  });
  const res = await fetch(`${API}${path}?${query}`, { signal });
  if (!res.ok) {
    const erro = new Error(`TMDB respondeu ${res.status}`);
    erro.status = res.status;
    throw erro;
  }
  return res.json();
}

// Catálogo com filtro de período (data de lançamento), gênero e ordem
export function descobrir({ de, ate, genero, ordem, pagina = 1 }, signal) {
  return get(
    "/discover/movie",
    {
      // Sem `region`: com ele o TMDB troca o release_date pela estreia no
      // Brasil, e o ano do card deixa de bater com o filtro (estreia mundial).
      // A data brasileira aparece na ficha do filme (lancamentoBR).
      include_adult: "false",
      include_video: "false",
      sort_by: ordem || "popularity.desc",
      "primary_release_date.gte": de,
      "primary_release_date.lte": ate,
      with_genres: genero,
      // "Mais bem avaliados" sem piso de votos traz filme com 1 voto nota 10
      "vote_count.gte": ordem === "vote_average.desc" ? 150 : undefined,
      page: pagina,
    },
    signal
  );
}

let generosPromise;
export function listarGeneros() {
  if (!generosPromise) {
    generosPromise = get("/genre/movie/list")
      .then((d) => d.genres)
      .catch((e) => {
        generosPromise = undefined;
        throw e;
      });
  }
  return generosPromise;
}

// --- dados extras do card (duração, direção, classificação) ---------------
// A listagem do discover não traz isso: cada card pede quando aparece na tela.
// Cache em memória + promessa compartilhada (o mesmo filme não é pedido 2x).

const cacheExtras = new Map();

export function classificacaoBR(releaseDates) {
  const br = releaseDates?.results?.find((r) => r.iso_3166_1 === REGIAO);
  return br?.release_dates?.map((r) => r.certification).find(Boolean) || null;
}

export function lancamentoBR(releaseDates) {
  const br = releaseDates?.results?.find((r) => r.iso_3166_1 === REGIAO);
  // 3 = cinema, 2 = cinema limitado, 4 = digital
  const datas = br?.release_dates || [];
  const cinema = datas.find((r) => r.type === 3) || datas.find((r) => r.type === 2) || datas[0];
  return cinema?.release_date?.slice(0, 10) || null;
}

function resumir(d) {
  return {
    duracao: d.runtime || null,
    direcao: (d.credits?.crew || []).filter((p) => p.job === "Director").map((p) => p.name),
    classificacao: classificacaoBR(d.release_dates),
    generos: (d.genres || []).map((g) => g.name),
  };
}

export function extrasDoFilme(id) {
  if (!cacheExtras.has(id)) {
    const p = get(`/movie/${id}`, { append_to_response: "credits,release_dates" })
      .then(resumir)
      .catch((e) => {
        cacheExtras.delete(id);
        throw e;
      });
    cacheExtras.set(id, p);
  }
  return cacheExtras.get(id);
}

// --- página do filme -------------------------------------------------------

export async function detalhesDoFilme(id, signal) {
  const d = await get(
    `/movie/${id}`,
    {
      append_to_response: "credits,videos,release_dates,watch/providers,recommendations",
      include_video_language: "pt,en,null",
    },
    signal
  );
  // Aproveita para preencher o cache do card
  cacheExtras.set(d.id, Promise.resolve(resumir(d)));
  return d;
}

// Trailer no YouTube: dublado/legendado em português primeiro, depois inglês
export function escolherTrailer(videos) {
  const lista = (videos?.results || []).filter((v) => v.site === "YouTube");
  const ordem = (v) =>
    (v.iso_639_1 === "pt" ? 0 : 2) + (v.type === "Trailer" ? 0 : 1) + (v.official ? 0 : 0.5);
  return lista.sort((a, b) => ordem(a) - ordem(b))[0] || null;
}
