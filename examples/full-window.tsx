import React, { useRef, useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";
import { EditableGrid, GridArea, pixelToNumber } from "../src";

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
  ["j", "f", "l", "l"]
];

const FullWindow = () => {
  const ref: any = useRef(null);
  const [state, setState] = useState<null | [string, string]>([
    window.innerWidth,
    window.innerHeight
  ] as any);
  useLayoutEffect(() => {
    if (ref.current) {
      console.log(ref.current);
      const s = window.getComputedStyle(ref.current);
      console.log(s.width, s.height);
      setState([s.width, s.height] as any);
    }

    const onresize = () => {
      setState([window.innerWidth, window.innerHeight] as any);
    };
    window.addEventListener("resize", onresize);
    return () => window.removeEventListener("resize", onresize);
  }, []);

  return (
    <div
      ref={ref as any}
      style={{
        width: "100vw",
        height: "100vh"
      }}
    >
      {state == null && <span>Loading...</span>}
      {state && (
        <EditableGrid
          key={state.join("-")}
          width={pixelToNumber(state[0])}
          height={pixelToNumber(state[1])}
          spacerSize={6}
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
      )}
    </div>
  );
};

ReactDOM.render(<FullWindow />, root);
