import "./admin.css";

export default function Admin() {
  const [tarefaInput, setTarefaInput] = useState("");
  function handleRegister(e) {
    e.preventDefault();
    alert("clicou");
  }

  return (
    <>
      <div className="admin-container">
        <h1>Minhas Tarefas</h1>
        <form className="form" onSubmit={handleRegister}>
          <textarea
            placeholder="Digite a sua tarefa"
            value={tarefaInput}
            onChange={(e) => setTarefaInput(e.target.value)}
          />

          <button className="btn-regiter" type="submit">
            Registrar tarefa
          </button>
        </form>
      </div>
    </>
  );
}
