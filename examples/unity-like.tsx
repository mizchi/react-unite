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
import {
  Window,
  Fullscreen,
  WindowData,
  TabData,
  LayoutData
} from "./components";

const initialGridData: GridData = {
  rows: ["40px", "1fr", "1fr"],
  columns: ["1fr", "1fr"],
  areas: [
    ["header", "header"],
    ["preview", "inspector"],
    ["assets", "inspector"]
  ]
};

const initialLayoutData: LayoutData = {
  tabMap: {
    "#scene": { displayName: "Scene", id: "#scene" },
    "#project": { displayName: "Project", id: "#project" },
    "#hierachy": { displayName: "Hierachy", id: "#hierachy" },
    "#inspector": { displayName: "Inspector", id: "#inspector" },
    "#services": { displayName: "Services", id: "#services" }
  },
  windows: [
    {
      id: "preview",
      displayName: "Preview",
      selectedId: "#scene",
      tabs: ["#scene"]
    },
    {
      id: "assets",
      displayName: "Preview",
      selectedId: "#project",
      tabs: ["#project", "#hierachy"]
    },
    {
      id: "inspector",
      displayName: "Inspector",
      selectedId: "#inspector",
      tabs: ["#inspector", "#services"]
    }
  ]
};

const UnityEditor = () => {
  const [grid, setGrid] = useState(initialGridData);
  const [layout, setLayout] = useState(initialLayoutData);

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
            setGrid(compiled);
          }}
          {...grid}
        >
          {layout.windows.map(win => {
            const onDropTab = (tabId: string) => (ev: DragEvent) => {
              console.log("dropped", win.id, "-", tabId);
              const targetTab = layout.windows
                .map(w => w.tabs)
                .reduce((acc, tabs) => [...acc, ...tabs], [])
                .find(t => t === tabId);
              if (targetTab) {
                // TODO: Buggy
                const newWindows = layout.windows.map(w => {
                  if (w.id === win.id) {
                    // add
                    const tabs = w.tabs.includes(targetTab)
                      ? w.tabs
                      : [...w.tabs, targetTab];
                    return { ...w, tabs };
                  } else {
                    const removedTabs = w.tabs.filter(t => t !== tabId);
                    return { ...w, tabs: removedTabs };
                  }
                });
                setLayout({ ...layout, windows: newWindows } as any);
              }
            };
            const tabs = win.tabs.map(tid => layout.tabMap[tid]);
            return (
              <GridArea name={win.id} key={win.id}>
                <Window
                  id={win.id}
                  tabs={tabs}
                  selectedId={win.selectedId}
                  onSelectTab={tabId => _ev => {
                    const newWindows = layout.windows.map(w => {
                      if (win.id === w.id) {
                        return { ...w, selectedId: tabId };
                      } else {
                        return w;
                      }
                    });
                    setLayout({ ...layout, windows: newWindows });
                  }}
                  onDropTab={onDropTab}
                  renderContent={id => {
                    return <x-pane>{id}</x-pane>;
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
