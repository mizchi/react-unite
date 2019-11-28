import "./elements";

import React from "react";
import ReactDOM from "react-dom";
import { LayoutData, EditableLayout, useWindowSize } from "../src";

const initialLayoutData: LayoutData = {
  grid: {
    columns: ["1fr", "1fr"],
    rows: ["40px", "1fr", "1fr"],
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

const UniteEditor = () => {
  const { width, height } = useWindowSize();
  return (
    <EditableLayout
      width={width}
      height={height}
      layout={initialLayoutData}
      renderTab={data => {
        return <span>{data.displayName}</span>;
      }}
      renderWindow={win => {
        return (
          <x-pane>
            {win.id}: {win.displayName}
          </x-pane>
        );
      }}
    />
  );
};

const root = document.querySelector(".root");
ReactDOM.render(<UniteEditor />, root);
