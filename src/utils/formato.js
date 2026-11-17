// Formatação em pt-BR

export function duracao(min) {
  if (!min) return null;
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (!h) return `${m}min`;
  return m ? `${h}h ${m}min` : `${h}h`;
}

export function ano(data) {
  return data ? data.slice(0, 4) : null;
}

export function dataLonga(data) {
  if (!data) return null;
  return new Date(`${data}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function nota(valor) {
  return valor ? valor.toFixed(1).replace(".", ",") : null;
}

export function numero(valor) {
  return new Intl.NumberFormat("pt-BR").format(valor);
}

export function dolares(valor) {
  if (!valor) return null;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(valor);
}

const IDIOMAS = new Intl.DisplayNames(["pt-BR"], { type: "language" });
export function idioma(codigo) {
  try {
    const nome = IDIOMAS.of(codigo);
    return nome.charAt(0).toUpperCase() + nome.slice(1);
  } catch (e) {
    return codigo;
  }
}

export function listaNomes(nomes, max = 2) {
  if (!nomes?.length) return null;
  const visiveis = nomes.slice(0, max).join(", ");
  return nomes.length > max ? `${visiveis} e outros` : visiveis;
}
