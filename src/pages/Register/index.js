import react from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebaseConnection"; // pra conectar com o firebase
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  async function headleRegister(e) {
    // como estamos tratando de uma submit, precisa passar um event
    e.preventDefault(); // para não recarregaar a pagina
    if (email !== "" && password !== "") {
      await createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          alert("sucesso ao Registrar");

          navigate("/admin", { replace: true });
        })
        .cach(() => {
          alert("erro ao fazer cadastro");
        });
    } else {
      alert("algum campo vazio");
    }
  }

  return (
    <div className="home-container">
      <h1>cadastre-se</h1>
      <span>Vamos criar sua conta.</span>

      <form className="form" onSubmit={headleRegister}>
        <input
          type="text"
          placeholder="digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          // autoComplete={false}
          type="password"
          placeholder="******"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Cadastrar</button>
        <Link className="button-link" to="/">
          Já possui uma conta? Faça login!
        </Link>
      </form>
    </div>
  );
}
