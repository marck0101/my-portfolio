import "./classificacao.css";

// Selo da classificação indicativa brasileira (L, 10, 12, 14, 16, 18),
// nas cores oficiais do ClassInd
const NOMES = {
  L: "Livre para todos os públicos",
  10: "Não recomendado para menores de 10 anos",
  12: "Não recomendado para menores de 12 anos",
  14: "Não recomendado para menores de 14 anos",
  16: "Não recomendado para menores de 16 anos",
  18: "Não recomendado para menores de 18 anos",
};

function Classificacao({ valor, grande = false }) {
  if (!valor) return null;
  const chave = String(valor).toUpperCase();
  return (
    <span
      className={`classificacao classificacao--${chave}${grande ? " classificacao--grande" : ""}`}
      title={NOMES[chave] || `Classificação ${valor}`}
      aria-label={NOMES[chave] || `Classificação ${valor}`}
    >
      {chave}
    </span>
  );
}

export default Classificacao;
