import "./elements";

import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import {
  LayoutData,
  Windowed,
  EditableLayout,
  Fill,
  EditableGrid,
  GridArea,
  GridData,
  pixelsToFractions
} from "../src";

const initialLayoutData: LayoutData = {
  grid: {
    // TODO: implement resizable
    // rowsResizables: [false, true, true],
    // columnsResizables: [false, true],
    columns: ["1fr", "1fr"],
    rows: ["40px", "1fr", "1fr"],
    areas: [
      ["header", "header"],
      ["preview", "inspector"],
      ["assets", "inspector"]
    ]
  },
  windowMap: {
    "#scene": { displayName: "Scene", id: "#scene" },
    "#project": { displayName: "Project", id: "#project" },
    "#hierachy": { displayName: "Hierachy", id: "#hierachy" },
    "#inspector": { displayName: "Inspector", id: "#inspector" },
    "#services": { displayName: "Services", id: "#services" }
  },
  containers: [
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

const childGridData = {
  rows: ["1fr", "2fr", "1fr"],
  columns: ["100px", "1fr", "1fr", "100px"],
  areas: [["a", "b", "c", "d"], ["e", "b", "g", "d"], ["j", "k", "l", "l"]]
};

function X() {
  useEffect(() => {
    console.log("mount x");
    return () => {
      console.log("unmount x");
    }
  }, [])
  return <div>x</div>
}

const UniteEditor = () => {
  const [grid, setGrid] = useState(childGridData);
  return (
    <Windowed>
      {(width, height) => (
        <EditableLayout
          width={width}
          height={height}
          layout={initialLayoutData}
          renderTab={data => {
            return <span>{data.displayName}</span>;
          }}
          renderWindow={win => {
            if (win.id === "#project") {
              return (
                <x-view style={{ width: "100%", height: "100%" }}>
                  Project
                  <X />
                </x-view>
              );
            }
            if (win.id === "#scene") {
              return (
                <Scene
                  grid={grid}
                  onChangeGrid={data => {
                    const newRows = pixelsToFractions(data.rows);
                    const newColumns = pixelsToFractions(data.columns);
                    setGrid({ ...data, rows: newRows, columns: newColumns });
                  }}
                />
              );
            }

            if (win.id === "#inspector") {
              return <Inspector grid={grid} />;
            }
            return (
              <x-pane>
                {win.id}: {win.displayName}
              </x-pane>
            );
          }}
        />
      )}
    </Windowed>
  );
};

const root = document.querySelector(".root");
ReactDOM.render(<UniteEditor />, root);

function Inspector(props: { grid: GridData }) {
  return (
    <x-view style={{ height: "100%", width: "100%", padding: 13 }}>
      <h1>Inspector</h1>
      <x-view>
        <pre>
          areas:
          <code>{JSON.stringify(props.grid.areas)}</code>
          <br />
          rows: <code>{JSON.stringify(props.grid.rows)}</code>
          <br />
          columns: <code>{JSON.stringify(props.grid.columns)}</code>
        </pre>
      </x-view>
      <hr />
      <x-view>
        <pre>
          <code>
            CSS Expression
            {`
.grid {
  grid-template-areas: ${props.grid.areas
    .map(a => a.join(" "))
    .map(a => `'${a}'`)
    .join(" ")};
  grid-template-rows: ${props.grid.rows.join(" ")};
  grid-template-columns: ${props.grid.columns.join(" ")};
}          
          `}
          </code>
        </pre>
      </x-view>
    </x-view>
  );
}

function Scene(props: {
  grid: GridData;
  onChangeGrid: (dath: GridData) => void;
}) {
  return (
    <Fill>
      {(width, height) => {
        return (
          <EditableGrid
            key={`${width}-${height}`}
            width={width}
            height={height}
            spacerSize={10}
            rows={props.grid.rows}
            columns={props.grid.columns}
            areas={props.grid.areas}
            onChangeGridData={data => {
              props.onChangeGrid(data);
            }}
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
        );
      }}
    </Fill>
  );
}
