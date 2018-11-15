import "./elements";

import React, { useRef, useLayoutEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  EditableGrid,
  GridArea,
  pixelToNumber,
  GridData,
  pixelsToFractions
} from "../src";

const root = document.querySelector(".root");
const columns = ["1fr", "1.5fr"];
const rows = ["40px", "1fr", "1fr"];
const areas = [
  ["header", "header"],
  ["preview", "inspector"],
  ["assets", "inspector"]
];

const intialGridData: GridData = {
  rows,
  columns,
  areas
};

const UnityEditor = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [width, height] = useWindowSize(ref);

  const [currentGridData, setGridData] = useState(intialGridData);

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
        onChangeGridData={data => {
          // console.log("data", data);
          const compiled = {
            ...data,
            rows: pixelsToFractions(data.rows),
            columns: pixelsToFractions(data.columns)
          };
          // console.log("compiled", compiled);
          setGridData(compiled);
        }}
        {...currentGridData}
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
      const s = window.getComputedStyle(ref.current);
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
