import React from "react";
import { Card, Grid } from "@mui/material";

export default function Home() {
  const listCard = [
    { id: 1, texto: "Em desencolvimento!!", country: "Austria" },
    { id: 2, texto: "Em desencolvimento!!", country: "Belgium" },
    { id: 3, texto: "Em desencolvimento!!", country: "Canada" },
    { id: 4, texto: "Em desencolvimento!!", country: "Denmark" },
    { id: 5, texto: "Em desencolvimento!!", country: "Egypt" },
    { id: 6, texto: "Em desencolvimento!!", country: "Austria" },
    { id: 7, texto: "Em desencolvimento!!", country: "Belgium" },
    { id: 8, texto: "Em desencolvimento!!", country: "Canada" },
    { id: 9, texto: "Em desencolvimento!!", country: "Denmark" },
    { id: 10, texto: "Em desencolvimento!!", country: "Egypt" },
    // { id: 11, texto: "j", country: "Egypt" },
  ];

  const estiloContainer = {
    marginTop: 25,
    // padding: 20,
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    textAlign: "center",
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
          {listCard.map((item) => {
            return (
              <>
                <Grid xs={6} lg={3}>
                  <Card key={item.id} style={estilo}>
                    {item.texto}
                  </Card>
                </Grid>
              </>
            );
          })}
        </Grid>
      </Grid>
    </>
  );
}
