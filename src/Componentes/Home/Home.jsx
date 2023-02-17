// import React, { useEffect, useState } from 'react';
import React from "react";
import { Card, Grid } from "@mui/material";

export default function Home() {
  const testeA = [
    { id: 1, texto: "a", country: "Austria" },
    { id: 2, texto: "b", country: "Belgium" },
    { id: 3, texto: "c", country: "Canada" },
    { id: 4, texto: "d", country: "Denmark" },
    { id: 5, texto: "e", country: "Egypt" },
    { id: 6, texto: "f", country: "Austria" },
    { id: 7, texto: "g", country: "Belgium" },
    { id: 8, texto: "h", country: "Canada" },
    { id: 9, texto: "i", country: "Denmark" },
    { id: 10, texto: "j", country: "Egypt" },
    // { id: 11, texto: "j", country: "Egypt" },
  ];

  // const [numbers, setNumbers] =useState ();
  // console.log(testeA.length);
  return (
    <>
      <Grid container style={{ padding: 50 }}>
        <Grid
          item
          xs={12}
          lg={12}
          style={{ display: "flex" /*, flexWrap: "wrap"*/ }}
        >
          {testeA.map((item) => {
            return (
              <>
                <Grid container>
                  <Grid
                    item
                    xs={12}
                    lg={12}
                    style={{ width: "100%", height: 80 }}
                  >
                    {testeA.length <= 10 ? (
                      <Card>
                        <Grid container spacing={2}>
                          <Grid
                            item
                            xs={12}
                            lg={12}
                            key={item.id}
                            style={{
                              textAlign: "center",
                              marginTop: 30,
                            }}
                          >
                            {item.texto}
                          </Grid>
                        </Grid>
                      </Card>
                    ) : (
                      <>
                        <h5>erro no tamanho</h5>
                      </>
                    )}
                  </Grid>
                </Grid>
              </>
            );
          })}
        </Grid>
      </Grid>
    </>
  );
}
