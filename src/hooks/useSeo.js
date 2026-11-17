import { useEffect } from "react";

// SEO por página numa SPA: atualiza <title>, description, canonical, Open Graph,
// robots e (opcional) um JSON-LD da página. O Google executa o JavaScript e lê
// essas tags. O HTML base (public/index.html) traz os valores padrão para quem
// não executa JS.
export const SITE = "https://filmes-lancamentos-atualizados.netlify.app";
const IMAGEM_PADRAO = `${SITE}/og-image.png`;

function meta(attr, chave, valor) {
  let el = document.head.querySelector(`meta[${attr}="${chave}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, chave);
    document.head.appendChild(el);
  }
  el.setAttribute("content", valor);
}

function canonical(url) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
}

export function resumir(texto, max = 155) {
  if (!texto) return "";
  const limpo = texto.replace(/\s+/g, " ").trim();
  return limpo.length <= max ? limpo : `${limpo.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

export default function useSeo({ titulo, descricao, caminho, imagem, indexar = true, jsonld = null }) {
  useEffect(() => {
    if (!titulo) return;
    const url = `${SITE}${caminho || window.location.pathname + window.location.search}`;
    document.title = titulo;
    meta("name", "description", descricao);
    meta("name", "robots", indexar ? "index, follow, max-image-preview:large" : "noindex, follow");
    meta("property", "og:title", titulo);
    meta("property", "og:description", descricao);
    meta("property", "og:url", url);
    meta("property", "og:image", imagem || IMAGEM_PADRAO);
    meta("name", "twitter:title", titulo);
    meta("name", "twitter:description", descricao);
    meta("name", "twitter:image", imagem || IMAGEM_PADRAO);
    canonical(url);

    let script;
    if (jsonld) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.pagina = "1";
      script.textContent = JSON.stringify(jsonld);
      document.head.appendChild(script);
    }
    return () => script?.remove();
  }, [titulo, descricao, caminho, imagem, indexar, jsonld]);
}
