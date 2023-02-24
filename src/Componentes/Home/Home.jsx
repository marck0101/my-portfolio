/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Card, Grid } from "@mui/material";

export default function Home() {
  // const listCard = [
  //   { id: 1, texto: "Em desencolvimento!!", country: "Austria" },
  //   { id: 2, texto: "Em desencolvimento!!", country: "Belgium" },
  //   { id: 3, texto: "Em desencolvimento!!", country: "Canada" },
  //   { id: 4, texto: "Em desencolvimento!!", country: "Denmark" },
  //   { id: 5, texto: "Em desencolvimento!!", country: "Egypt" },
  //   { id: 6, texto: "Em desencolvimento!!", country: "Austria" },
  //   { id: 7, texto: "Em desencolvimento!!", country: "Belgium" },
  //   { id: 8, texto: "Em desencolvimento!!", country: "Canada" },
  //   { id: 9, texto: "Em desencolvimento!!", country: "Denmark" },
  //   { id: 10, texto: "Em desencolvimento!!", country: "Egypt" },
  //   // { id: 11, texto: "j", country: "Egypt" },
  // ];

  const estiloContainer = {
    backgroundColor: "red",
    height: "100vh",
    marginTop: 25,
    // padding: 20,
    display: "flex",
    flexWrap: "wrap",
    textAlign: "center",
    flexDirection: "row",
    // flexDirection: "column",
  };

  const estilo = {
    backgroundColor: "blue",
    color: "yellow",
    // alignText: "center",
    height: 100,
    margin: 20,
    // width: 100,
  };

  // console.log(testeA.length);
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} lg={12} style={estiloContainer}>
          <Grid container spacing={2} style={{ padding: 10 }}>
            <Grid item xs={6} lg={6}>
              <Card style={{ estilo }}>
                <h5>merda bosta</h5>
              </Card>
            </Grid>

            <Grid item xs={6} lg={6}>
              <Card style={{ estilo }}>
                <h5>merda bosta</h5>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
