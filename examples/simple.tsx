import "./elements";

import React from "react";
import ReactDOM from "react-dom";
import { EditableGrid, Grid, GridArea } from "../src";

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
        <x-pane>a</x-pane>
      </GridArea>
      <GridArea name="b">
        <x-pane>b</x-pane>
      </GridArea>
      <GridArea name="d">
        <x-pane>d</x-pane>
      </GridArea>
      <GridArea name="f">
        <x-pane>f</x-pane>
      </GridArea>
      <GridArea name="h">
        <x-pane>h</x-pane>
      </GridArea>
      <GridArea name="l">
        <x-pane>l</x-pane>
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
        <x-pane>a</x-pane>
      </GridArea>
      <GridArea name="b">
        <x-pane>b</x-pane>
      </GridArea>
      <GridArea name="d">
        <x-pane>d</x-pane>
      </GridArea>
      <GridArea name="f">
        <x-pane>f</x-pane>
      </GridArea>
      <GridArea name="h">
        <x-pane>h</x-pane>
      </GridArea>
      <GridArea name="l">
        <x-pane>l</x-pane>
      </GridArea>
    </Grid>
  </>,
  root
);
