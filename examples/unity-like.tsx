import "./elements/index";

import React from "react";
import ReactDOM from "react-dom";
import {
  GridData,
  LayoutData,
  Windowed,
  EditableWindowContainer
} from "../src";

const initialGridData: GridData = {
  // rowsResizables: [false, true, true],
  rows: ["40px", "1fr", "1fr"],
  columns: ["1fr", "1fr"],
  areas: [
    ["header", "header"],
    ["preview", "inspector"],
    ["assets", "inspector"]
  ]
};

const initialLayoutData: LayoutData = {
  windowMap: {
    "#scene": { displayName: "Scene", id: "#scene" },
    "#project": { displayName: "Project", id: "#project" },
    "#hierachy": { displayName: "Hierachy", id: "#hierachy" },
    "#inspector": { displayName: "Inspector", id: "#inspector" },
    "#services": { displayName: "Services", id: "#services" }
  },
  containers: [
    {
      id: "preview",
      displayName: "Preview",
      selectedId: "#scene",
      windowIds: ["#scene"]
    },
    {
      id: "assets",
      displayName: "Preview",
      selectedId: "#project",
      windowIds: ["#project", "#hierachy"]
    },
    {
      id: "inspector",
      displayName: "Inspector",
      selectedId: "#inspector",
      windowIds: ["#inspector", "#services"]
    }
  ]
};

const UnityEditor = () => {
  return (
    <Windowed>
      {(width, height) => (
        <EditableWindowContainer
          width={width}
          height={height}
          grid={initialGridData}
          layout={initialLayoutData}
          renderWindow={id => {
            return <x-pane>{id}</x-pane>;
            // if (id === "#inspector") {
            //   const previewData = {
            //     tabs: windows.map(w => w.tabs.join("-")),
            //     areas: grid.areas,
            //     rows: grid.rows,
            //     columns: grid.columns
            //   };
            //   return (
            //     <x-view>
            //       <h3>LayoutData</h3>
            //       <pre>
            //         <code>{JSON.stringify(previewData, null, 2)}</code>
            //       </pre>
            //     </x-view>
            //   );
            // }
            // return <x-pane>{id}</x-pane>;
          }}
        />
      )}
    </Windowed>
  );
};

const root = document.querySelector(".root");
ReactDOM.render(<UnityEditor />, root);
