import { useCallback, useEffect, useRef, useState } from "react";
import { descobrir } from "../services/tmdb";

// Lista paginada do discover. Trocar o filtro recomeça do zero (e cancela o
// pedido anterior, para uma resposta atrasada não sobrescrever a nova).
// `ativo` = false segura a busca (ex.: datas invertidas no filtro)
export default function useCatalogo({ de, ate, genero, ordem, ativo = true }) {
  const [filmes, setFilmes] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [total, setTotal] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const controle = useRef(null);

  const carregar = useCallback(
    async (proxima, reiniciar) => {
      controle.current?.abort();
      const ctrl = new AbortController();
      controle.current = ctrl;
      setCarregando(true);
      setErro(null);
      try {
        const dados = await descobrir({ de, ate, genero, ordem, pagina: proxima }, ctrl.signal);
        setFilmes((atuais) => {
          const base = reiniciar ? [] : atuais;
          const vistos = new Set(base.map((f) => f.id));
          return [...base, ...dados.results.filter((f) => !vistos.has(f.id))];
        });
        setPagina(proxima);
        // O TMDB não entrega além da página 500
        setTotalPaginas(Math.min(dados.total_pages, 500));
        setTotal(dados.total_results);
        setCarregando(false);
      } catch (e) {
        if (e.name === "AbortError") return;
        setErro(e);
        setCarregando(false);
      }
    },
    [de, ate, genero, ordem]
  );

  useEffect(() => {
    setFilmes([]);
    setTotal(null);
    setPagina(0);
    if (!ativo) {
      setCarregando(false);
      return;
    }
    carregar(1, true);
    return () => controle.current?.abort();
  }, [carregar, ativo]);

  const temMais = ativo && pagina < totalPaginas;

  const carregarMais = useCallback(() => {
    if (!carregando && !erro && temMais) carregar(pagina + 1, false);
  }, [carregando, erro, temMais, pagina, carregar]);

  const tentarDeNovo = useCallback(() => carregar(pagina + 1 || 1, pagina === 0), [carregar, pagina]);

  return { filmes, total, carregando, erro, temMais, carregarMais, tentarDeNovo };
}
