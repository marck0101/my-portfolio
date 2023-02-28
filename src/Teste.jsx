import React from "react";
import { Button, Grid } from "@mui/material";

export default function Teste() {
  const estilo = {
    margin: "auto",
    padding: 40,
    /* backgroundColor: "red",*/
  };
  function pagNutri() {
    window.location.href = "http://localhost:3000/nutri";
  }
  function pagList() {
    window.location.href = "http://localhost:3000/listaCompras";
  }
  return (
    <>
      <div style={estilo}>
        <Grid container spacing={2}>
          <Grid item>
            <Button onClick={() => pagNutri()}>Acessar pag nutri</Button>
            <Button onClick={() => pagList()}>Acessar pag lista</Button>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
