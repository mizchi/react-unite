import React, { useState, useLayoutEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { EditableGrid } from "./EditableGrid";
import { Grid, GridArea } from "./Grid";

// --- components

function DummyPane() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        padding: "10px",
        border: "3px solid white",
        boxSizing: "border-box",
        backgroundColor: "rgba(0, 128, 0, 0.4)"
      }}
    >
      Dummy Pane
    </div>
  );
}

const root = document.querySelector(".root");
const rows = ["1fr", "2fr", "1fr"];
const columns = ["100px", "1fr", "1fr", "100px"];
const areas = [
  ["a", "b", "c", "d"],
  ["e", "f", "g", "h"],
  ["j", "k", "l", "m"]
];

ReactDOM.render(
  <>
    <h1>EditableGrid: Example</h1>
    <hr />
    {/* Editable pane */}
    EditableGrid (640px, 480px)
    <EditableGrid
      width={640}
      height={480}
      spacerSize={16}
      rows={rows}
      columns={columns}
      areas={areas}
    >
      <GridArea name="a">
        <DummyPane />
      </GridArea>
      <GridArea name="b">
        <DummyPane />
      </GridArea>
      <GridArea name="d">
        <DummyPane />
      </GridArea>
      <GridArea name="f">
        <DummyPane />
      </GridArea>
      <GridArea name="h">
        <DummyPane />
      </GridArea>
      <GridArea name="l">
        <DummyPane />
      </GridArea>
    </EditableGrid>
    <hr />
    Stacic Grid (100%, 300px)
    {/* Static pane */}
    <Grid
      width={"100%"}
      height={300}
      rows={rows}
      columns={columns}
      areas={areas}
    >
      <GridArea name="a">
        <DummyPane />
      </GridArea>
      <GridArea name="b">
        <DummyPane />
      </GridArea>
      <GridArea name="d">
        <DummyPane />
      </GridArea>
      <GridArea name="f">
        <DummyPane />
      </GridArea>
      <GridArea name="h">
        <DummyPane />
      </GridArea>
      <GridArea name="l">
        <DummyPane />
      </GridArea>
    </Grid>
  </>,
  root
);
