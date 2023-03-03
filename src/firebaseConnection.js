import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // pra  poder ter conexão com o banco

const firebaseConfig = {
  apiKey: "AIzaSyB4NIPpFGZDctwDjdi6ajTvW1t4z8HFXZQ",
  authDomain: "curso-35ef6.firebaseapp.com",
  projectId: "curso-35ef6",
  storageBucket: "curso-35ef6.appspot.com",
  messagingSenderId: "368683986860",
  appId: "1:368683986860:web:4a88a8b79b86848d0e9409",
  measurementId: "G-RG7RKTBDEM",
};

// inicializou o firebase
const firebaseApp = initializeApp(firebaseConfig);
// inicializando as  configurações
const db = getFirestore(firebaseApp);
export { db }; // pra poder consumir os dados do firebase
