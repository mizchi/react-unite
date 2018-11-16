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
import { Window, Fullscreen } from "./components";

const initialGridData: GridData = {
  rows: ["40px", "1fr", "1fr"],
  columns: ["1fr", "1fr"],
  areas: [
    ["header", "header"],
    ["preview", "inspector"],
    ["assets", "inspector"]
  ]
};

type TabData = {
  id: string;
  displayName: string;
};

type WindowData = {
  id: string;
  displayName: string;
  selectedId: string;
  tabs: TabData[];
};

type LayoutData = {
  windows: WindowData[];
};

const initialLayoutData: LayoutData = {
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
                .find(tab => tab.id === tabId);

              if (targetTab) {
                const newWindows = layout.windows.map(w => {
                  if (w.id === win.id) {
                    // add
                    const tabs = [...w.tabs, targetTab];
                    return { ...w, tabs };
                  } else {
                    const removedTabs = w.tabs.filter(tab => tab.id !== tabId);
                    return { ...w, tabs: removedTabs };
                  }
                });

                setLayout({ ...layout, windows: newWindows } as any);
              }
            };

            return (
              <GridArea name={win.id} key={win.id}>
                <Window
                  id={win.id}
                  tabs={win.tabs}
                  selectedId={win.selectedId}
                  onSelectTab={tabId => _ev => {
                    const newWindows = layout.windows.map(win => {
                      if (win.id === win.id) {
                        return { ...win, selectedId: tabId };
                      } else {
                        return win;
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
