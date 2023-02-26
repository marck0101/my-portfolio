/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useMemo, useState } from "react";
import { Button, Grid, TextField } from "@mui/material";

export default function DocTeste() {
  const [lista, setLista] = useState([]);
  const [item, setItem] = useState("");
  const totalItens = useMemo(() => lista.length, [lista]);
  //o useMemo só vai atualizar o valor necessário sem ter que forçar
  //toda o render da tela, mas apenas do valor necessário

  useEffect(() => {
    const tarefasStorage = localStorage.getItem("lista");
    if (tarefasStorage) {
      setLista(JSON.parse(tarefasStorage));
    }
  }, []);

  useEffect(() => {
    if (lista != "") {
      localStorage.setItem("lista", JSON.stringify(lista)); // se lista estiver vazio ele vai setar vazio
    }
    console.log("lista", lista);
  }, [lista]);

  function handleAdd() {
    if (item !== "") {
      setLista([...lista, item]);
      setItem("");
    } else {
      alert("Digite algo para ser inserido!");
    }
  }
  function handleDelete() {
    localStorage.removeItem("lista"); // se lista estiver vazio ele vai setar vazio
    setLista([]);
  }

  return (
    <>
      <Grid container style={{ display: "flex", flexDirection: "column" }}>
        <Grid item>
          <Grid container spacing={1}>
            <Grid item>
              <TextField
                id="newItem"
                label="Inserir item"
                size="small"
                variant="outlined"
                value={item}
                onChange={(e) => setItem(e.target.value)}
              />
            </Grid>
            <Grid item>
              <Button
                onClick={() => handleAdd()}
                variant="contained"
                size="large"
              >
                Inserir
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={() => handleDelete()}
                variant="contained"
                size="large"
                color="error"
              >
                Deletar Lista
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <h5>Itens listados: {totalItens}</h5>
          <br />
        </Grid>

        <Grid item>
          {lista.map((item) => {
            return (
              <>
                <div>
                  <ul>
                    <li key={item}>{item}</li>
                  </ul>
                </div>
              </>
            );
          })}
        </Grid>
      </Grid>
    </>
  );
}
