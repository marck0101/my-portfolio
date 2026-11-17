import "./footer.css";

// O TMDB exige a atribuição abaixo para uso da API
function Footer() {
  return (
    <footer className="rodape conteudo">
      <p>
        Dados e imagens do{" "}
        <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">
          TMDB
        </a>
        . Este produto usa a API do TMDB, mas não é endossado nem certificado pelo TMDB. Onde assistir:
        JustWatch.
      </p>
      <p>
        Feito por{" "}
        <a href="https://marck0101.com.br" target="_blank" rel="noopener noreferrer">
          Marcos Henrique Corrêa
        </a>{" "}
        · <span className="mono">{new Date().getFullYear()}</span>
      </p>
    </footer>
  );
}

export default Footer;
