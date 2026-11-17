import { useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Hero from "../../components/Hero";
import Filtros from "../../components/Filtros";
import Grade from "../../components/Grade";
import useCatalogo from "../../hooks/useCatalogo";
import { PERIODO_PADRAO, periodos as criarPeriodos } from "../../utils/periodos";
import "./home.css";

function dataCurta(d) {
  return d ? d.split("-").reverse().join("/") : "…";
}

// Catálogo: destaque do período + filtros + grade. O filtro vive na URL
// (?de=2026-01-01&ate=2026-12-31&genero=28&ordem=popularity.desc), então dá
// para compartilhar o link e o botão voltar funciona.
function Home() {
  const [params, setParams] = useSearchParams();
  const periodos = useMemo(() => criarPeriodos(), []);
  const padrao = periodos.find((p) => p.id === PERIODO_PADRAO);

  const filtros = {
    de: params.has("de") ? params.get("de") : padrao.de,
    ate: params.has("ate") ? params.get("ate") : padrao.ate,
    genero: params.get("genero") || "",
    ordem: params.get("ordem") || "popularity.desc",
  };

  const periodoAtivo = periodos.find((p) => p.de === filtros.de && p.ate === filtros.ate)?.id ?? null;
  const datasValidas = !(filtros.de && filtros.ate && filtros.de > filtros.ate);

  const { filmes, total, carregando, erro, temMais, carregarMais, tentarDeNovo } = useCatalogo({
    ...filtros,
    ativo: datasValidas,
  });

  const mudar = useCallback(
    (mudanca) => {
      const prox = new URLSearchParams(params);
      Object.entries(mudanca).forEach(([k, v]) => {
        if (v === "" && (k === "genero")) prox.delete(k);
        else prox.set(k, v);
      });
      if (prox.get("ordem") === "popularity.desc") prox.delete("ordem");
      setParams(prox, { replace: true });
    },
    [params, setParams]
  );

  const limpar = useCallback(() => setParams({}, { replace: true }), [setParams]);

  const rotuloPeriodo = periodoAtivo
    ? periodos.find((p) => p.id === periodoAtivo).label
    : `${dataCurta(filtros.de)} a ${dataCurta(filtros.ate)}`;

  useEffect(() => {
    document.title = `${rotuloPeriodo} · Next Movies`;
  }, [rotuloPeriodo]);

  const destaque = filmes.find((f) => f.backdrop_path) || null;

  return (
    <main>
      {datasValidas && (filmes.length > 0 || carregando) ? (
        <Hero filme={destaque} rotulo={`Destaque · ${rotuloPeriodo}`} />
      ) : (
        <div className="home__espaco-topo" />
      )}

      <Filtros
        filtros={filtros}
        periodos={periodos}
        periodoAtivo={periodoAtivo}
        total={datasValidas ? total : null}
        onChange={mudar}
        onLimpar={limpar}
      />

      <div className="home__catalogo conteudo">
        <h2 className="sr-only">Filmes: {rotuloPeriodo}</h2>

        {erro && (
          <div className="home__aviso" role="alert">
            <p>Não consegui carregar os filmes agora.</p>
            <button type="button" className="btn btn--destaque" onClick={tentarDeNovo}>
              Tentar de novo
            </button>
          </div>
        )}

        {!erro && !carregando && datasValidas && filmes.length === 0 && (
          <div className="home__aviso">
            <p>Nenhum filme nesse período com esses filtros.</p>
            <button type="button" className="btn btn--vidro" onClick={limpar}>
              Voltar para “Em cartaz”
            </button>
          </div>
        )}

        <Grade filmes={filmes} carregando={carregando} temMais={temMais} onMais={carregarMais} />
      </div>
    </main>
  );
}

export default Home;
