import "./elements";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  EditableGrid,
  GridArea,
  pixelToNumber,
  GridData,
  pixelsToFractions
} from "../src";
import { WindowsContainer, Fullscreen } from "./components";

const initialGridData: GridData = {
  rows: ["40px", "1fr", "1fr"],
  columns: ["1fr", "1fr"],
  areas: [
    ["header", "header"],
    ["preview", "inspector"],
    ["assets", "inspector"]
  ]
};

const initialLayoutData = {
  windows: [
    {
      id: "preview",
      displayName: "Preview",
      selectedId: "#scene",
      tabs: [{ displayName: "Scene", id: "#scene" }]
    },
    {
      id: "assets",
      displayName: "Preview",
      selectedId: "#project",
      tabs: [
        { displayName: "Project", id: "#project" },
        { displayName: "Hierachy", id: "#hierachy" }
      ]
    },
    {
      id: "inspector",
      displayName: "Inspector",
      selectedId: "#inspector",
      tabs: [
        { displayName: "Inspector", id: "#inspector" },
        { displayName: "Services", id: "#services" }
      ]
    }
  ]
};

const UnityEditor = () => {
  const [currentGridData, setGridData] = useState(initialGridData);
  const [currentLayoutData, _setLayoutData] = useState(initialLayoutData);
  return (
    <Fullscreen>
      {(width, height) => (
        <EditableGrid
          key={`${width}-${height}`}
          width={pixelToNumber(width)}
          height={pixelToNumber(height)}
          spacerSize={8}
          onChangeGridData={data => {
            const compiled = {
              ...data,
              rows: pixelsToFractions(data.rows),
              columns: pixelsToFractions(data.columns)
            };
            setGridData(compiled);
          }}
          {...currentGridData}
        >
          {currentLayoutData.windows.map(win => {
            return (
              <GridArea name={win.id} key={win.id}>
                <WindowsContainer
                  tabs={win.tabs}
                  selectedId={win.selectedId}
                  onSelectTab={(event, id) => {
                    console.log("select");
                  }}
                />
              </GridArea>
            );
          })}
        </EditableGrid>
      )}
    </Fullscreen>
  );
};

const root = document.querySelector(".root");
ReactDOM.render(<UnityEditor />, root);
