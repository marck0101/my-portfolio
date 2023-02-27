import React from "react";
import { Grid } from "@mui/material";
import DocTeste from "./DocTeste";
// import ExemploUdemy from "./ExemploUdemy";

export default function Teste() {
  const estilo = {
    margin: "auto",
    padding: 40,
    /* backgroundColor: "red",*/
  };
  return (
    <>
      <div style={estilo}>
        <Grid container spacing={2}>
          <Grid item>
            <DocTeste />
            {/* <h5>--------------</h5>
            <strong>Melhorias:</strong>
            <p>Poder deletar item a item</p>
            <p>Com checkbox colocar em cada item</p>
            <p>quando checked mudam para listas de concluidos</p>
            <p>
              quando na lista de concluidos clicar para não checked volta para
              lista original
            </p> */}
            {/* <ExemploUdemy /> */}
          </Grid>
        </Grid>
      </div>
    </>
  );
}
