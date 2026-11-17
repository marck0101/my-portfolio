import { useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import "./trailer.css";

// Trailer do YouTube num <dialog> (Esc e clique fora fecham).
// youtube-nocookie: o YouTube não grava cookie até a pessoa dar play.
function Trailer({ video, aberto, onFechar }) {
  const dialogo = useRef(null);

  useEffect(() => {
    const el = dialogo.current;
    if (!el) return;
    if (aberto && !el.open) el.showModal();
    if (!aberto && el.open) el.close();
  }, [aberto]);

  if (!video) return null;

  return (
    <dialog
      ref={dialogo}
      className="trailer"
      onClose={onFechar}
      onClick={(e) => e.target === dialogo.current && onFechar()}
      aria-label={video.name}
    >
      <div className="trailer__caixa">
        <button type="button" className="trailer__fechar" onClick={onFechar} aria-label="Fechar trailer">
          <FaTimes aria-hidden="true" />
        </button>
        {aberto && (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.key}?autoplay=1&rel=0`}
            title={video.name}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        )}
      </div>
    </dialog>
  );
}

export default Trailer;
