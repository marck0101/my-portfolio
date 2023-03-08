import { useState, useEffect } from "react";
import "./admin.css";
import { CiCircleCheck, CiEdit } from "react-icons/ci";
import { auth, db } from "../../firebaseConnection";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";


import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

export default function Admin() {
  const [tarefaInput, setTarefaInput] = useState("");
  const [user, setUser] = useState({});
  const [edit, setEdit] = useState({});

  const [tarefas, setTarefas] = useState([]);

  useEffect(() => {
    async function loadTarefas() {
      const userDetail = localStorage.getItem("@detailUser");
      setUser(JSON.parse(userDetail));
      if (userDetail) {
        const data = JSON.parse(userDetail);
        const tarefaRef = collection(db, "tarefas");
        const q = query(
          tarefaRef,
          orderBy("created", "desc"),
          where("userUid", "==", data?.uid)
        );
        const unsub = onSnapshot(q, (snapshot) => {
          let lista = [];
          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              tarefa: doc.data().tarefa,
              userUid: doc.data().userUid,
            });
          });
          setTarefas(lista);
        });
      }
    }
    loadTarefas();
  }, []);

  async function handleRegister(e) {
    e.preventDefault();

    if (tarefaInput === "") {
      toast.warn("Digite sua tarefa...");
      // se não for digitado nada, ele para a execução do codigo
      return;
    }

    // caso não tenha o ID só vai adicionar uma tarefa nova
    if (edit?.id) {
      // se tiver o Id significa que eu estou querendo editar
      handleUpdateTarefa();
      return; // para a execução do cod por aqui
    }

    // adicionando um documento, coleção chamada tarefas
    // o que queremos colocar dentrodessas tarefas
    await addDoc(collection(db, "tarefas"), {
      tarefa: tarefaInput, // a tarefa criada
      created: new Date(), // data da criação da tarefa
      userUid: user?.uid, // o ponto de interrogação para não quebrar a tela, quando demorar a receber
    })
      .then(() => {
        // alert("TAREFA REGISTRADA");
        setTarefaInput("");
      })
      .catch((error) => {
        toast.error("ERRO AO REGISTRAR " + error);
      });
  }

  async function handleLogout() {
    await signOut(auth); // vai deslogar o usuário
  }

  async function deleteTarefa(id) {
    const docRef = doc(db, "tarefas", id);
    await deleteDoc(docRef);
  }

  function editTarefa(item) {
    setTarefaInput(item.tarefa);
    setEdit(item);
  }

  async function handleUpdateTarefa() {
    // acessa o banco, acessa a tarefa, acessa o Id que eu quero editar
    const docRef = doc(db, "tarefas", edit?.id);
    await updateDoc(docRef, {
      // Aqui estou dizendo que quero atualizar a tarefa, com o que eu acabei de digitar, o tarefaInput
      tarefa: tarefaInput,
    })
      .then(() => {
        // alert("TAREFA ATUALIZADA");
        setTarefaInput(""); // zerando o input para informar que não estou mais editando essa tarefa.
        setEdit({}); // esse tinha os dados que eu estava editando, volta vazia para poder editar outras tarefas também
      })
      .catch(() => {
        toast.error("ERRO AO ATUALIZAR");
        // erro ao atualizar, e garantindo que os campos vão voltar vazios
        setTarefaInput("");
        setEdit({});
      });
  }

  return (
    <div className="admin-container">
      <h1>Minhas tarefas</h1>

      <form className="form" onSubmit={handleRegister}>
        <textarea
          placeholder="Digite sua Tarefa..."
          value={tarefaInput}
          onChange={(e) => setTarefaInput(e.target.value)}
        />
        {/* só vai ser acionado essa operação quado clicado no botão de editar tarefa */}
        {Object.keys(edit).length > 0 ? ( // aqui um req para saber se está vazio ou tem algo dentro, significa que tem algo dentro do objeto.
          <button
            className="btn-register"
            style={{ backgroundColor: "#6add39" }}
            type="submit"
          >
            Atualizar tarefa
          </button>
        ) : (
          <button className="btn-register" type="submit">
            Registrar tarefa
          </button>
        )}
      </form>

      {tarefas.map((item) => (
        <article key={item.id} className="list">
          <p>{item.tarefa}</p>

          <div>
            <button onClick={() => editTarefa(item)}>
              Editar <CiEdit style={{ marginBottom: -2 }} size={18} />
            </button>
            <button
              onClick={() => deleteTarefa(item.id)}
              className="btn-delete"
            >
              Concluir <CiCircleCheck style={{ marginBottom: -2 }} size={18} />
            </button>
          </div>
        </article>
      ))}

      <button className="btn-logout" onClick={handleLogout}>
        Sair
      </button>
    </div>
  );
}
