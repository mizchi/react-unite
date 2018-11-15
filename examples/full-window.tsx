import "./elements";

import React, { useRef, useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";
import { EditableGrid, GridArea, pixelToNumber } from "../src";

const root = document.querySelector(".root");
const rows = ["1fr", "2fr", "1fr"];
const columns = ["100px", "1fr", "1fr", "100px"];
const areas = [
  ["a", "b", "c", "d"],
  ["e", "f", "g", "h"],
  ["j", "f", "l", "l"]
];

const useWindowSize = (ref: any): [string, string] => {
  const [state, setState] = useState<[string, string]>([
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

  return state;
};

const FullWindow = () => {
  const ref: any = useRef(null);

  const [width, height] = useWindowSize(ref);

  return (
    <div
      ref={ref as any}
      style={{
        width: "100vw",
        height: "100vh"
      }}
    >
      <EditableGrid
        key={`${width}-${height}`}
        width={pixelToNumber(width)}
        height={pixelToNumber(height)}
        spacerSize={8}
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
          <x-pane style={{ backgroundColor: "#ccc" }}>l</x-pane>
        </GridArea>
      </EditableGrid>
    </div>
  );
};

ReactDOM.render(<FullWindow />, root);
