import "./elements";

import React, { useRef, useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";
import { EditableGrid, GridArea, pixelToNumber } from "../src";

const root = document.querySelector(".root");
const rows = ["40px", "1fr", "1fr"];
const columns = ["1fr", "1fr"];
const areas = [
  ["header", "header"],
  ["preview", "inspector"],
  ["assets", "inspector"]
];

const UnityEditor = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [width, height] = useWindowSize(ref);

  return (
    <x-view
      ref={ref}
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
        // showHorizontal={false}
        // showVertical={false}
      >
        <GridArea name="header">
          <x-pane>header</x-pane>
        </GridArea>
        <GridArea name="inspector">
          <x-pane>inspector</x-pane>
        </GridArea>
        <GridArea name="preview">
          <x-pane>preivew</x-pane>
        </GridArea>
        <GridArea name="assets">
          <x-pane>assets</x-pane>
        </GridArea>
      </EditableGrid>
    </x-view>
  );
};

ReactDOM.render(<UnityEditor />, root);

function useWindowSize(ref: React.RefObject<HTMLDivElement>): [string, string] {
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
}