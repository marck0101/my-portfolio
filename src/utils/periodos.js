// Atalhos de período para o filtro de datas. Datas em AAAA-MM-DD (fuso local).

export function iso(d) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${dia}`;
}

function somarDias(dias) {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return iso(d);
}

export function periodos() {
  const anoAtual = new Date().getFullYear();
  return [
    { id: "em-cartaz", label: "Em cartaz", de: somarDias(-45), ate: somarDias(0) },
    { id: "em-breve", label: "Em breve", de: somarDias(1), ate: somarDias(120) },
    { id: "este-ano", label: String(anoAtual), de: `${anoAtual}-01-01`, ate: `${anoAtual}-12-31` },
    { id: "ano-passado", label: String(anoAtual - 1), de: `${anoAtual - 1}-01-01`, ate: `${anoAtual - 1}-12-31` },
    { id: "anos-2010", label: "Anos 2010", de: "2010-01-01", ate: "2019-12-31" },
    { id: "anos-2000", label: "Anos 2000", de: "2000-01-01", ate: "2009-12-31" },
    { id: "anos-90", label: "Anos 90", de: "1990-01-01", ate: "1999-12-31" },
  ];
}

export const PERIODO_PADRAO = "em-cartaz";

export const ORDENS = [
  { value: "popularity.desc", label: "Mais populares" },
  { value: "primary_release_date.desc", label: "Lançamento: mais recentes" },
  { value: "primary_release_date.asc", label: "Lançamento: mais antigos" },
  { value: "vote_average.desc", label: "Mais bem avaliados" },
];
