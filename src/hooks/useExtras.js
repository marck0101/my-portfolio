import { useEffect, useState } from "react";
import { extrasDoFilme } from "../services/tmdb";

// Duração, direção, classificação e gêneros de um filme, só quando `ativo`
export default function useExtras(id, ativo = true) {
  const [extras, setExtras] = useState(null);

  useEffect(() => {
    if (!id || !ativo) return;
    let vivo = true;
    extrasDoFilme(id)
      .then((e) => vivo && setExtras(e))
      .catch(() => vivo && setExtras({ erro: true }));
    return () => {
      vivo = false;
    };
  }, [id, ativo]);

  return extras;
}
