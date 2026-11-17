/*
 * Pós-build (roda no `npm run build`, também no Netlify): sitemap.xml e llms.txt.
 *
 * Os filmes vêm do TMDB em tempo real, então o sitemap lista as páginas fixas
 * + os filmes em cartaz e em breve no Brasil NO MOMENTO DO BUILD (o Netlify
 * refaz a cada push). Se o TMDB falhar, gera só com as páginas fixas: o deploy
 * nunca quebra por causa disso.
 *
 * Sem dependências (usa o fetch do Node 18+).
 */
const fs = require("fs");
const path = require("path");

const SITE = "https://filmes-lancamentos-atualizados.netlify.app";
const BUILD = path.join(__dirname, "..", "build");
const KEY = process.env.REACT_APP_TMDB_KEY || "ac9e5e514ef9fdf5c60f3e541419fba0";
const HOJE = new Date().toISOString().slice(0, 10);
const ANO = new Date().getFullYear();

async function tmdb(rota, params = {}) {
  const q = new URLSearchParams({ api_key: KEY, language: "pt-BR", region: "BR", ...params });
  const res = await fetch(`https://api.themoviedb.org/3${rota}?${q}`, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`TMDB ${rota}: ${res.status}`);
  return res.json();
}

async function listar(rota, paginas) {
  const todas = await Promise.all(Array.from({ length: paginas }, (_, i) => tmdb(rota, { page: i + 1 })));
  return todas.flatMap((d) => d.results);
}

const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Atalhos de período com datas fixas (os relativos, "em cartaz" e "em breve",
// mudam todo dia e não entram no sitemap)
const PERIODOS = [
  [`${ANO}`, `${ANO}-01-01`, `${ANO}-12-31`],
  [`${ANO - 1}`, `${ANO - 1}-01-01`, `${ANO - 1}-12-31`],
  ["Anos 2010", "2010-01-01", "2019-12-31"],
  ["Anos 2000", "2000-01-01", "2009-12-31"],
  ["Anos 90", "1990-01-01", "1999-12-31"],
].map(([rotulo, de, ate]) => ({ rotulo, url: `${SITE}/?de=${de}&ate=${ate}` }));

async function main() {
  let emCartaz = [];
  let emBreve = [];
  try {
    [emCartaz, emBreve] = await Promise.all([listar("/movie/now_playing", 3), listar("/movie/upcoming", 2)]);
  } catch (e) {
    console.warn(`pós-build: TMDB indisponível (${e.message}); sitemap só com páginas fixas`);
  }

  const vistos = new Set();
  const filmes = [...emCartaz, ...emBreve].filter((f) => !vistos.has(f.id) && vistos.add(f.id));

  // --- sitemap.xml ---
  const urls = [
    { loc: `${SITE}/`, prioridade: "1.0", freq: "daily" },
    ...PERIODOS.map((p) => ({ loc: p.url, prioridade: "0.6", freq: "weekly" })),
    ...filmes.map((f) => ({ loc: `${SITE}/filme/${f.id}`, prioridade: "0.7", freq: "weekly" })),
  ];
  fs.writeFileSync(
    path.join(BUILD, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${esc(u.loc)}</loc>
    <lastmod>${HOJE}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.prioridade}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`
  );

  // --- llms.txt ---
  const linha = (f) => `- [${f.title}${f.release_date ? ` (${f.release_date.slice(0, 4)})` : ""}](${SITE}/filme/${f.id})`;
  const llms = `# Next Movies

> Catálogo de filmes em português com filtro por período de lançamento, gênero e nota. Cada filme mostra duração, direção, classificação indicativa brasileira, elenco, trailer, títulos semelhantes e onde assistir no Brasil (assinatura, aluguel ou compra). Dados do TMDB, atualizados em tempo real no site.

- Site: ${SITE}/
- Feito por: Marcos Henrique Corrêa, programador full stack (https://marck0101.com.br/programador)
- Código: https://github.com/marck0101/my-portfolio
- Dados: TMDB (https://www.themoviedb.org/). Este produto usa a API do TMDB, mas não é endossado nem certificado pelo TMDB. "Onde assistir": JustWatch, via TMDB.
- Gratuito, sem cadastro. "Minha lista" fica salva só no navegador de cada pessoa.

## Como usar pela URL

- Página de um filme: ${SITE}/filme/{id do filme no TMDB}
- Catálogo filtrado: ${SITE}/?de=AAAA-MM-DD&ate=AAAA-MM-DD&genero={id do gênero TMDB}&ordem={ordem}
  - ordem: popularity.desc (mais populares, padrão), primary_release_date.desc, primary_release_date.asc, vote_average.desc (mais bem avaliados)
  - sem "de" e "ate": filmes em cartaz (últimos 45 dias)

## Atalhos de período

- [Em cartaz](${SITE}/)
${PERIODOS.map((p) => `- [${p.rotulo}](${p.url})`).join("\n")}

## Em cartaz no Brasil (lista de ${HOJE}; o site mostra a lista atual)

${emCartaz.length ? emCartaz.slice(0, 20).map(linha).join("\n") : "- Consulte o site."}

## Estreias em breve (lista de ${HOJE})

${emBreve.length ? emBreve.slice(0, 15).map(linha).join("\n") : "- Consulte o site."}
`;
  fs.writeFileSync(path.join(BUILD, "llms.txt"), llms);

  console.log(`pós-build: sitemap.xml (${urls.length} URLs) e llms.txt`);
}

main().catch((e) => {
  // Nunca derruba o deploy por causa do SEO
  console.warn(`pós-build: ${e.message}`);
});
