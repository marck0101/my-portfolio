import { useState } from "react";
import { db } from "./firebaseConnection"; // importação com o banco
import "./app.css";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore"; // para cadastrar um item novo
import { async } from "@firebase/util";

function App() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [posts, setPosts] = useState([]);
  const [idPost, setIdPost] = useState([]);

  async function heandleAdd() {
    // await setDoc(doc(db, "posts", "12345"), { // gerando id manualmente
    //   titulo: titulo,
    //   autor: autor,
    // })
    //   .then(() => {
    //     alert("dados registrados no banco");
    //   })
    //   .catch((error) => {
    //     alert(error);
    //   });

    // addDoc é o metodo de adicionar, db autenticação, post é onde vamos inserir um novo documento
    await addDoc(collection(db, "posts"), {
      // em que  local vai ser adicionado
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        alert("dados registrados no banco");
        setAutor("");
        setTitulo("");
      })
      .catch((error) => {
        alert(error);
      });
  }

  async function buscarPost() {
    //Buscando apenas um post
    // doc é o metodo, db são  as credenciais do  banco, post é o documento onde vamos buscar uma coleçao
    // const postRef = doc(db, "posts", "12345");
    // await getDoc(postRef)
    //   .then((snapshot) => {
    //     setAutor(snapshot.data().autor);
    //     setTitulo(snapshot.data().titulo);
    //   })
    //   .catch((error) => {
    //     alert(error);
    //   });

    const postsRef = collection(db, "posts");
    await getDocs(postsRef)
      .then((snapshoot) => {
        let lista = [];
        snapshoot.forEach((doc) => {
          lista.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor,
          });
        });
        setPosts(lista);
      })
      .catch((error) => {
        alert(error);
      });
  }

  async function editPost() {
    const docRef = doc(db, "posts", idPost);
    await updateDoc(docRef, {
      titulo: titulo,
      autor: autor,
    })
      .then(() => {
        alert("post atualizado");
        setIdPost("");
        setTitulo("");
        setAutor("");
      })
      .catch((erro) => {
        console.erro(erro);
      });
  }
  async function deletePost(id) {
    alert("id: " + id);
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef)
      .then(() => {
        alert("post deletado com sucesso");
      })
      .catch((erro) => {
        alert(erro);
      });
  }

  return (
    <div>
      <h1> react + firebase</h1>
      <div className="container">
        <label>Informe o ID</label>
        <input
          value={idPost}
          onChange={(e) => setIdPost(e.target.value)}
          placeholder="Digite o id do post"
        />{" "}
        <br />
        <label>Titulo:</label>
        <textarea
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          type="text"
          placeholder="Digite o texto"
        />
        <label>Autor</label>
        <input
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
          type="text"
          placeholder="autor do post"
        />
        <button onClick={() => heandleAdd()}>cadastrar</button>
        <button onClick={() => buscarPost()}>Buscar Post</button> <br />
        <button onClick={() => editPost()}>Atualizar Post</button>
        {posts.map((post) => {
          return (
            <ul>
              <li key={post.id}>
                <strong>ID: {post.id}</strong> <br />
                <span>Titulo: {post.titulo}</span>
                <br />
                <span>Autor: {post.autor}</span>
                <br />
                <button onClick={() => deletePost(post.id)}>
                  Excluir Post
                </button>
                <br />
              </li>
            </ul>
          );
        })}
      </div>
    </div>
  );
}

export default App;
