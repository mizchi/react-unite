import "./elements";

import React, { useState, useCallback, useContext, useRef } from "react";
import ReactDOM from "react-dom";
import {
  LayoutData,
  EditableGrid,
  GridArea,
  GridData,
  LayoutSystem,
  WindowManager,
  useElementSize,
  useWindowSize
} from "../src";
import Modal from "react-modal";
Modal.setAppElement("#modal");

const GridContext = React.createContext<[GridData, (d: GridData) => void]>(
  null as any
);

function Workbench() {
  const [grid, setGrid] = useState<GridData>(childGridData);
  const size = useWindowSize();

  return (
    <GridContext.Provider value={[grid, setGrid]}>
      <LayoutSystem
        width={size.width}
        height={size.height}
        windowManager={windowManager}
        initialLayout={initialLayoutData}
      />
    </GridContext.Provider>
  );
}

function Inspector() {
  const [grid] = useContext(GridContext);
  return (
    <x-view style={{ height: "100%", width: "100%", padding: 13 }}>
      <h1>Inspector</h1>
      <x-view>
        <pre>
          areas:
          <code>{JSON.stringify(grid.areas)}</code>
          <br />
          rows: <code>{JSON.stringify(grid.rows)}</code>
          <br />
          columns: <code>{JSON.stringify(grid.columns)}</code>
        </pre>
        yar
      </x-view>
      <hr />
      <x-view>
        <pre>
          <code>
            CSS Expression
            {`
.grid {
  grid-template-areas: ${grid.areas
    .map(a => a.join(" "))
    .map(a => `'${a}'`)
    .join(" ")};
  grid-template-rows: ${grid.rows.join(" ")};
  grid-template-columns: ${grid.columns.join(" ")};
}          
          `}
          </code>
        </pre>
      </x-view>
    </x-view>
  );
}
function Scene_A_Inner() {
  const ref = useRef(null);
  const size = useElementSize(ref);
  const grid = childGridData;
  return (
    <div style={{ width: "100%", height: "100%" }} ref={ref}>
      {size && (
        <EditableGrid
          width={size.width}
          height={size.height}
          spacerSize={10}
          rows={grid.rows}
          columns={grid.columns}
          fixedColumns={grid.fixedColumns}
          fixedRows={grid.fixedRows}
          areas={grid.areas}
          // onChangeGridData={onChangeGridData}
        >
          <GridArea name="a">
            <Scene_A />
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
      )}
    </div>
  );
}
function Scene_A() {
  const ref = useRef(null);
  const size = useElementSize(ref);
  const [opened, setOpened] = useState(false);
  const grid = childGridData;
  console.log(size);
  return (
    <x-pane>
      <button onClick={() => setOpened(true)}>Open</button>
      <Modal
        isOpen={opened}
        onRequestClose={() => {
          setOpened(false);
        }}
      >
        <Scene_A_Inner />
      </Modal>
    </x-pane>
  );
}

function Scene() {
  const ref = useRef<HTMLDivElement>(null);
  const size = useElementSize(ref);
  const [grid, setGrid] = useContext(GridContext);
  const onChangeGridData = useCallback(newGrid => {
    setGrid(newGrid);
  }, []);
  return (
    <div ref={ref} style={{ width: "100%", height: "100%" }}>
      {size && (
        <EditableGrid
          width={size.width}
          height={size.height}
          spacerSize={10}
          rows={grid.rows}
          columns={grid.columns}
          fixedColumns={grid.fixedColumns}
          fixedRows={grid.fixedRows}
          areas={grid.areas}
          onChangeGridData={onChangeGridData}
        >
          <GridArea name="a">
            <Scene_A />
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
      )}
    </div>
  );
}

const initialLayoutData: LayoutData = {
  grid: {
    columns: ["1fr", "1fr"],
    fixedColumns: [false, false],
    rows: ["40px", "1fr", "1fr"],
    fixedRows: [true, false, false],
    areas: [
      ["header", "header"],
      ["preview", "inspector"],
      ["assets", "inspector"]
    ]
  },
  windows: {
    "#scene": { displayName: "Scene", id: "#scene" },
    "#project": { displayName: "Project", id: "#project" },
    "#hierachy": { displayName: "Hierachy", id: "#hierachy" },
    "#inspector": { displayName: "Inspector", id: "#inspector" },
    "#services": { displayName: "Services", id: "#services" }
  },
  panes: [
    {
      // TODO: containerType: tabs | one
      id: "preview",
      displayName: "Preview",
      selectedId: "#scene",
      windowIds: ["#scene"],
      showTab: false
    },
    {
      id: "assets",
      displayName: "Preview",
      selectedId: "#project",
      windowIds: ["#project", "#hierachy"],
      showTab: true
    },
    {
      id: "inspector",
      displayName: "Inspector",
      selectedId: "#inspector",
      windowIds: ["#inspector", "#services"],
      showTab: true
    }
  ]
};

const childGridData: GridData = {
  rows: ["1fr", "2fr", "1fr"],
  fixedRows: [true, false, false],
  columns: ["100px", "1fr", "1fr", "100px"],
  fixedColumns: [true, false, true, true],
  areas: [
    ["a", "b", "c", "d"],
    ["e", "b", "g", "d"],
    ["j", "k", "l", "l"]
  ]
};

const windowManager = new WindowManager();
windowManager.registerWindow("#scene", Scene as any);
windowManager.registerWindow("#inspector", Inspector as any);
const root = document.querySelector(".root");
ReactDOM.render(<Workbench />, root);
