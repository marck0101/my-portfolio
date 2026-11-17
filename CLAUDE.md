# CLAUDE.md — Next Movies (repo `my-portfolio`)

Contexto do projeto para o Claude Code. Leia antes de mexer. Visão geral e instruções de uso: `README.md`.

O nome do repositório (`my-portfolio`) é histórico. O app é o **Next Movies**, um catálogo de filmes que aparece como projeto no portfólio pessoal (marck0101.com.br → /portfolio).

---

## 1. Stack

| Tecnologia | Uso |
|---|---|
| React 18 (`createRoot`) | UI |
| Create React App 5 (react-scripts) | build; `CI=true npm run build` trata warning como erro |
| react-router-dom 6 | rotas; o filtro do catálogo vive em `useSearchParams` |
| react-icons (`fa`) | ícones |
| react-toastify | avisos de "entrou/saiu da lista" |
| CSS puro por componente | um `.css` ao lado de cada `index.js`, classes BEM em português (`card__poster`) |

- Sem axios: as chamadas usam `fetch` (`src/services/tmdb.js`).
- Sem Material UI, emotion, uuid: foram removidos em 2026-11-16 (não eram usados).
- **Um lockfile só: `package-lock.json` (npm).** O `yarn.lock` foi apagado porque estava desatualizado. Não recriar: o Netlify usa yarn quando encontra `yarn.lock`.

## 2. Dados (TMDB)

- **Toda** chamada à API passa por `src/services/tmdb.js`. Componente nenhum monta URL do TMDB.
- Chave: `process.env.REACT_APP_TMDB_KEY` com valor padrão no código (chave v3, pública por natureza).
- `descobrir()` filtra por `primary_release_date` (estreia mundial) e **não manda `region`**. Com `region`, o TMDB troca o `release_date` pela estreia no Brasil e o ano do card deixa de bater com o filtro (ex.: "À Espera de um Milagre" aparecia como 2000 em "Anos 90").
- Dados brasileiros vêm do detalhe: `classificacaoBR()` e `lancamentoBR()` leem `release_dates` do país `BR`; "onde assistir" lê `watch/providers.results.BR`.
- **Extras da capa** (duração, direção, classificação, gêneros) não vêm no discover. `extrasDoFilme(id)` busca quando o card entra na tela (`useEmTela` + `useExtras`). O cache em memória guarda a promessa, então o mesmo filme nunca é pedido duas vezes. A página do filme preenche esse cache.
- "Mais bem avaliados" usa `vote_count.gte=150`, senão filme com 1 voto nota 10 aparece no topo.
- O TMDB não entrega além da página 500 (`useCatalogo` limita).
- Rodapé com atribuição do TMDB e do JustWatch: **obrigatória**, não remover.

## 3. Catálogo (Home)

- Estado do filtro na URL: `de`, `ate` (AAAA-MM-DD), `genero` (id), `ordem` (`sort_by` do TMDB; padrão `popularity.desc`, omitido da URL).
- Sem `de`/`ate` na URL = atalho "Em cartaz" (últimos 45 dias). Atalhos em `utils/periodos.js`; o atalho ativo é o que tem as mesmas datas da URL. Datas que não batem com nenhum atalho = "Escolher datas" (personalizado).
- `de > ate`: mostra aviso e **não** busca (`useCatalogo({ ativo: false })`).
- Trocar filtro → página 1, lista zerada, pedido anterior cancelado (AbortController). Rolagem infinita pela sentinela da `Grade` (IntersectionObserver, 800px antes do fim) + botão "Carregar mais" de reserva.
- O destaque (Hero) é o primeiro filme do resultado que tem `backdrop_path`.

## 4. Minha lista

- `localStorage["@primeflix"]`: a chave é da versão antiga, mantida para ninguém perder a lista salva.
- Guarda só os campos que o card usa (`resumo()` em `useMinhaLista.js`). Itens antigos (objeto completo do filme) continuam funcionando.
- `useSyncExternalStore`: header (contador), cards e página do filme ficam em sincronia, inclusive entre abas.
- Rota nova `/minha-lista`; `/favoritos` continua funcionando (links antigos).

## 5. Visual

- Tema escuro único. Tokens em `src/index.css` (`--fundo`, `--superficie`, `--texto`, `--destaque` etc.); componentes usam só tokens.
- Acento tijolo (`--destaque: #e8693f`), da mesma família da marca marck0101. Fontes: Fraunces (títulos grandes), IBM Plex Sans (texto), IBM Plex Mono (números, datas, metadados).
- **Não imitar marca de streaming** (logo, vermelho da Netflix, layout idêntico). O estilo é próprio.
- Responsivo: grade `repeat(auto-fill, minmax(clamp(140px, 30vw, 190px), 1fr))` (2 colunas a partir de ~320px). Hover só em `(hover: hover) and (pointer: fine)`; no toque, as informações ficam sempre visíveis embaixo do pôster.
- Classificação indicativa nas cores oficiais do ClassInd (`components/classificacao.css`).
- `prefers-reduced-motion` desliga animações.

## 6. Deploy

| Campo | Valor |
|---|---|
| URL | https://filmes-lancamentos-atualizados.netlify.app |
| Host | Netlify (SPA: `public/_redirects` manda tudo para `index.html`) |
| Build | Netlify roda `npm run build` → `build/` a cada push (`netlify.toml`); a pasta `build/` não vai para o git |
| Repositório | https://github.com/marck0101/my-portfolio |

Confirmar no painel do Netlify se o deploy é automático no push da `main` antes de dar push.

## 7. Como testar uma mudança visual

1. `CI=true npm run build` (warning quebra o build no Netlify).
2. Servir `build/` e conferir: catálogo padrão, um período antigo (`/?de=1990-01-01&ate=1999-12-31`), datas invertidas, página de um filme (`/filme/278`), Minha lista vazia e com itens, em ~375px e ~1440px.

## 8. Histórico

| Data | Mudança |
|---|---|
| 2023-03 | Versão inicial: 10 filmes de `/movie/upcoming` em coluna única, detalhe simples, favoritos |
| 2026-11-16 | Reescrita como catálogo estilo streaming: filtro de período/gênero/ordem na URL, capas com duração, direção e classificação, destaque, rolagem infinita, página do filme com ficha técnica, onde assistir, elenco, trailer e semelhantes. axios → fetch; MUI, emotion, uuid e `yarn.lock` removidos; README e CLAUDE.md escritos |
