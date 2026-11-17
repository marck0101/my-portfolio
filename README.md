# Next Movies

Catálogo de filmes no estilo dos serviços de streaming, feito em React com dados do [TMDB](https://www.themoviedb.org/).

**No ar:** https://filmes-lancamentos-atualizados.netlify.app

## O que faz

- **Catálogo filtrável por período.** Atalhos (Em cartaz, Em breve, ano atual, ano passado, Anos 2010, 2000 e 90) ou datas livres de/até. Também filtra por gênero e ordena por popularidade, data ou nota.
- **Filtro na URL.** `/?de=1990-01-01&ate=1999-12-31&genero=18&ordem=vote_average.desc` abre o catálogo já filtrado. Dá para compartilhar o link e o botão voltar funciona.
- **Capas com informação.** Nota, ano, duração, classificação indicativa brasileira (selos do ClassInd) e direção. No hover (mouse), a sinopse e os gêneros sobem sobre o pôster.
- **Destaque do período.** O filme mais relevante do filtro atual aparece em tela cheia no topo.
- **Página do filme.** Fundo em tela cheia, ficha técnica (direção, roteiro, música, estreia no Brasil e mundial, idioma, produção, orçamento, bilheteria), onde assistir no Brasil, elenco, trailer e títulos semelhantes.
- **Minha lista.** Filmes salvos no navegador (localStorage), sem login.
- **Responsivo e fluido.** A grade ajusta o número de colunas à tela, tem rolagem infinita e esqueletos de carregamento. Os dados extras de cada capa só são pedidos quando ela aparece na tela.

## Rodar localmente

Requer Node 18 ou mais novo.

```bash
npm install
npm start          # http://localhost:3000
npm run build      # gera build/ (é o que o Netlify publica)
```

A chave da API do TMDB já vem com um valor padrão em `src/services/tmdb.js`. Para usar outra, crie um `.env.local`:

```
REACT_APP_TMDB_KEY=sua_chave_v3
```

> A chave v3 do TMDB fica visível no navegador em qualquer site estático. Ela é de leitura e tem limite de uso, então não é um segredo. Mesmo assim, não reutilize uma chave com outras permissões.

## Estrutura

```
src/
├── index.js / App.js / routes.js   # entrada, toasts, rotas, header e rodapé
├── index.css                       # tokens de cor/fonte, botões, esqueleto
├── services/tmdb.js                # TODAS as chamadas à API + cache dos extras
├── hooks/
│   ├── useCatalogo.js              # lista paginada do /discover (filtro → página 1, cancela pedido antigo)
│   ├── useExtras.js                # duração, direção, classificação de um filme
│   ├── useEmTela.js                # IntersectionObserver: o card chegou na tela?
│   └── useMinhaLista.js            # "Minha lista" no localStorage, sincronizada entre abas
├── utils/
│   ├── periodos.js                 # atalhos de período e opções de ordem
│   └── formato.js                  # duração, datas, nota, moeda, idioma em pt-BR
├── components/
│   ├── Header, Footer
│   ├── Hero/                       # destaque do período
│   ├── Filtros/                    # chips de período, datas, gênero, ordem
│   ├── Grade/                      # grade fluida + rolagem infinita
│   ├── MovieCard/                  # a capa do filme
│   ├── Fileira/                    # fileira horizontal (elenco, semelhantes)
│   ├── Trailer/                    # <dialog> com o trailer do YouTube
│   └── Classificacao.js            # selo L/10/12/14/16/18
└── pages/
    ├── Home/        → /                 catálogo
    ├── Filme/       → /filme/:id        detalhes
    ├── Favoritos/   → /minha-lista      (e /favoritos, endereço antigo)
    └── Erro/        → *                 404
```

## SEO e GEO

- **Por página, no navegador** (`src/hooks/useSeo.js`): título, descrição, canonical, Open Graph e robots. Página de filme com JSON-LD `Movie` (direção, elenco, duração, classificação, trailer). "Minha lista" e 404 com `noindex`.
- **HTML base** (`public/index.html`): valores padrão, JSON-LD `WebSite` + `WebApplication` ligado ao autor (mesma identidade do marck0101.com.br) e texto no `<noscript>` para quem não executa JavaScript.
- **No build** (`scripts/pos-build.js`): `sitemap.xml` (início, atalhos de período e os filmes em cartaz e em breve no momento do build) e `llms.txt` (resumo para assistentes de IA). Se o TMDB falhar, gera só com as páginas fixas.
- `public/robots.txt`: libera buscadores e bots de IA, aponta o sitemap e tira `/minha-lista` do índice.

## Endpoints do TMDB usados

| Uso | Endpoint |
|---|---|
| Catálogo | `GET /discover/movie` com `primary_release_date.gte/lte`, `with_genres`, `sort_by`, `page` |
| Gêneros do filtro | `GET /genre/movie/list` |
| Extras da capa | `GET /movie/{id}?append_to_response=credits,release_dates` |
| Página do filme | `GET /movie/{id}?append_to_response=credits,videos,release_dates,watch/providers,recommendations` |

Tudo em `language=pt-BR`. Imagens em `image.tmdb.org/t/p/{tamanho}`.

## Créditos

Dados e imagens: TMDB. Este produto usa a API do TMDB, mas não é endossado nem certificado pelo TMDB. Dados de "onde assistir": JustWatch, via TMDB.

Feito por [Marcos Henrique Corrêa](https://marck0101.com.br).
