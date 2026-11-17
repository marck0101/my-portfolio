import { useEffect, useState } from "react";
import { FaCalendarAlt, FaTimes } from "react-icons/fa";
import { listarGeneros } from "../../services/tmdb";
import { ORDENS } from "../../utils/periodos";
import { numero } from "../../utils/formato";
import "./filtros.css";

// Barra de filtros: atalhos de período, datas livres (de/até), gênero e ordem.
// Quem guarda o estado é a URL (Home): aqui só lemos e avisamos a mudança.
function Filtros({ filtros, periodos, periodoAtivo, total, onChange, onLimpar }) {
  const [generos, setGeneros] = useState([]);
  const [abertoDatas, setAbertoDatas] = useState(periodoAtivo === null);

  useEffect(() => {
    listarGeneros()
      .then(setGeneros)
      .catch(() => setGeneros([]));
  }, []);

  useEffect(() => {
    if (periodoAtivo === null) setAbertoDatas(true);
  }, [periodoAtivo]);

  const datasInvalidas = filtros.de && filtros.ate && filtros.de > filtros.ate;
  const personalizado = periodoAtivo === null;

  return (
    <section className="filtros conteudo" aria-label="Filtros do catálogo">
      <div className="filtros__periodos" role="group" aria-label="Período de lançamento">
        {periodos.map((p) => (
          <button
            key={p.id}
            type="button"
            className="filtros__chip"
            aria-pressed={periodoAtivo === p.id}
            onClick={() => onChange({ de: p.de, ate: p.ate })}
          >
            {p.label}
          </button>
        ))}
        <button
          type="button"
          className="filtros__chip filtros__chip--datas"
          aria-pressed={personalizado}
          aria-expanded={abertoDatas}
          aria-controls="filtros-datas"
          onClick={() => setAbertoDatas((v) => !v)}
        >
          <FaCalendarAlt aria-hidden="true" /> Escolher datas
        </button>
      </div>

      <div className="filtros__linha">
        {abertoDatas && (
          <div className="filtros__datas" id="filtros-datas">
            <label className="filtros__campo">
              <span>De</span>
              <input
                type="date"
                value={filtros.de || ""}
                max={filtros.ate || undefined}
                onChange={(e) => onChange({ de: e.target.value })}
              />
            </label>
            <label className="filtros__campo">
              <span>Até</span>
              <input
                type="date"
                value={filtros.ate || ""}
                min={filtros.de || undefined}
                onChange={(e) => onChange({ ate: e.target.value })}
              />
            </label>
          </div>
        )}

        <label className="filtros__campo">
          <span>Gênero</span>
          <select value={filtros.genero || ""} onChange={(e) => onChange({ genero: e.target.value })}>
            <option value="">Todos</option>
            {generos.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </label>

        <label className="filtros__campo">
          <span>Ordenar</span>
          <select value={filtros.ordem} onChange={(e) => onChange({ ordem: e.target.value })}>
            {ORDENS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <div className="filtros__resumo">
          {datasInvalidas ? (
            <p className="filtros__erro" role="alert">
              A data inicial é depois da final.
            </p>
          ) : (
            total !== null && (
              <p className="mono" aria-live="polite">
                {numero(total)} {total === 1 ? "filme" : "filmes"}
              </p>
            )
          )}
          {(personalizado || filtros.genero) && (
            <button type="button" className="filtros__limpar" onClick={onLimpar}>
              <FaTimes aria-hidden="true" /> Limpar filtros
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

export default Filtros;
