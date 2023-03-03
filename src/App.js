import { useState } from "react";
import { db } from "./firebaseConnection"; // importação com o banco
import "./app.css";
import { doc, setDoc, collection, addDoc, getDoc } from "firebase/firestore"; // para cadastrar um item novo

function App() {
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");

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
    const postRef = doc(db, "posts", "12345");
    await getDoc(postRef)
      .then((snapshot) => {
        setAutor(snapshot.data().autor);
        setTitulo(snapshot.data().titulo);
      })
      .catch((error) => {
        alert(error);
      });
  }

  return (
    <div>
      <h1> react + firebase</h1>
      <div className="container">
        <label>titulo:</label>
        <textarea
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          type="text"
          placeholder="Digite o texto"
        />
        <label>autor</label>
        <input
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
          type="text"
          placeholder="autor do post"
        ></input>
        <button onClick={() => heandleAdd()}>cadastrar</button>
        <button onClick={() => buscarPost()}>Buscar post</button>
      </div>
    </div>
  );
}

export default App;
