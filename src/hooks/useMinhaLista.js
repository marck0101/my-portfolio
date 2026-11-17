import { useCallback, useSyncExternalStore } from "react";

// "Minha lista" no localStorage. A chave "@primeflix" é a mesma da versão
// antiga: quem já tinha filmes salvos não perde nada.
const CHAVE = "@primeflix";
const EVENTO = "minha-lista";

let cacheBruto = null;
let cacheLista = [];

function ler() {
  let bruto = null;
  try {
    bruto = localStorage.getItem(CHAVE);
  } catch (e) {
    /* sem localStorage */
  }
  if (bruto !== cacheBruto) {
    cacheBruto = bruto;
    try {
      cacheLista = JSON.parse(bruto) || [];
    } catch (e) {
      cacheLista = [];
    }
  }
  return cacheLista;
}

function gravar(lista) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(lista));
  } catch (e) {
    /* vale só nesta visita */
  }
  window.dispatchEvent(new Event(EVENTO));
}

function assinar(onChange) {
  window.addEventListener(EVENTO, onChange);
  window.addEventListener("storage", onChange); // outra aba
  return () => {
    window.removeEventListener(EVENTO, onChange);
    window.removeEventListener("storage", onChange);
  };
}

// Guarda só o necessário para desenhar o card
function resumo(f) {
  return {
    id: f.id,
    title: f.title,
    poster_path: f.poster_path,
    backdrop_path: f.backdrop_path,
    release_date: f.release_date,
    vote_average: f.vote_average,
    overview: f.overview,
  };
}

export default function useMinhaLista() {
  const lista = useSyncExternalStore(assinar, ler, () => []);

  const naLista = useCallback((id) => lista.some((f) => f.id === id), [lista]);

  const alternar = useCallback((filme) => {
    const atual = ler();
    const existe = atual.some((f) => f.id === filme.id);
    gravar(existe ? atual.filter((f) => f.id !== filme.id) : [resumo(filme), ...atual]);
    return !existe;
  }, []);

  return { lista, naLista, alternar };
}
