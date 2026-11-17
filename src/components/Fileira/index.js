import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./fileira.css";

// Fileira horizontal com rolagem (toque/trackpad) e setas no desktop
function Fileira({ titulo, children, largura = "item" }) {
  const trilho = useRef(null);
  const [inicio, setInicio] = useState(true);
  const [fim, setFim] = useState(false);

  function atualizar() {
    const el = trilho.current;
    if (!el) return;
    setInicio(el.scrollLeft < 8);
    setFim(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }

  useEffect(() => {
    atualizar();
    window.addEventListener("resize", atualizar);
    return () => window.removeEventListener("resize", atualizar);
  }, [children]);

  function rolar(direcao) {
    const el = trilho.current;
    el.scrollBy({ left: direcao * el.clientWidth * 0.85, behavior: "smooth" });
  }

  return (
    <section className="fileira">
      <h2 className="fileira__titulo conteudo">{titulo}</h2>
      <div className="fileira__moldura">
        <button
          type="button"
          className="fileira__seta fileira__seta--esq"
          onClick={() => rolar(-1)}
          disabled={inicio}
          aria-label="Voltar"
        >
          <FaChevronLeft aria-hidden="true" />
        </button>
        <div className={`fileira__trilho fileira__trilho--${largura}`} ref={trilho} onScroll={atualizar}>
          {children}
        </div>
        <button
          type="button"
          className="fileira__seta fileira__seta--dir"
          onClick={() => rolar(1)}
          disabled={fim}
          aria-label="Avançar"
        >
          <FaChevronRight aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

export default Fileira;
