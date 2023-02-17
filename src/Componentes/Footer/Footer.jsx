import React from "react";
import { Button, Grid, TextareaAutosize, TextField } from "@mui/material";
import "./style.css";

export default function Footer() {
  const estilo = {
    justifyContent: "center",
  };
  return (
    <footer>
      <div>
        <h2>Contate-me</h2>
        <Grid style={estilo}>
          <Grid>
            <TextField id="Nome" name="Nome" label="Seu Nome" />
            <TextField id="email" name="email" label="Email" />
          </Grid>
          <Grid>
            <TextareaAutosize
              maxRows={4}
              // aria-label="maximum height"
              // placeholder="Maximum 4 rows"
              // defaultValue=""
              style={{ width: 420, height: 70 }}
            />
          </Grid>
          <Button variant="enviar">Enviar</Button>
        </Grid>
      </div>
    </footer>
  );
}
