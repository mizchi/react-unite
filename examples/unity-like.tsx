import "./elements/index";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import {
  EditableGrid,
  GridArea,
  pixelToNumber,
  GridData,
  pixelsToFractions,
  Window,
  Windowed,
  LayoutData
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

const AppContext = React.createContext<string | null>(null as any);

const UnityEditor = () => {
  const tabMap = initialLayoutData.tabMap;
  const [grid, setGrid] = useState(initialGridData);
  const [windows, setWindows] = useState(initialLayoutData.windows);

  return (
    <AppContext.Provider value={null}>
      <Windowed>
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
            {windows.map(win => {
              const onDropTab = (tabId: string) => (_ev: DragEvent) => {
                const newWindows = windows.map(w => {
                  let tabs = w.tabs;
                  let selectedId = w.selectedId;
                  if (w.id === win.id) {
                    tabs = w.tabs.includes(tabId) ? w.tabs : [...w.tabs, tabId];
                    selectedId = tabId;
                  } else {
                    tabs = w.tabs.filter(t => t !== tabId);
                    if (tabId === w.selectedId) {
                      selectedId = tabs[0];
                    }
                  }
                  return { ...w, tabs, selectedId };
                });

                // debugger;
                setWindows(newWindows);
              };
              const tabs = win.tabs.map(tid => tabMap[tid]);
              return (
                <GridArea name={win.id} key={win.id}>
                  <Window
                    id={win.id}
                    tabs={tabs}
                    selectedId={win.selectedId}
                    onSelectTab={tabId => _ev => {
                      const newWindows = windows.map(w => {
                        if (win.id === w.id) {
                          return { ...w, selectedId: tabId };
                        } else {
                          return w;
                        }
                      });
                      setWindows(newWindows);
                    }}
                    onDropTab={onDropTab}
                    renderContent={id => {
                      if (id === "#inspector") {
                        const previewData = {
                          tabs: windows.map(w => w.tabs.join("-")),
                          areas: grid.areas,
                          rows: grid.rows,
                          columns: grid.columns
                        };
                        return (
                          <x-view>
                            <h3>LayoutData</h3>
                            <pre>
                              <code>
                                {JSON.stringify(previewData, null, 2)}
                              </code>
                              <code>
                                {JSON.stringify(previewData, null, 2)}
                              </code>
                              <code>
                                {JSON.stringify(previewData, null, 2)}
                              </code>
                              <code>
                                {JSON.stringify(previewData, null, 2)}
                              </code>
                            </pre>
                          </x-view>
                        );
                      }
                      return <x-pane>{id}</x-pane>;
                    }}
                  />
                </GridArea>
              );
            })}
          </EditableGrid>
        )}
      </Windowed>
    </AppContext.Provider>
  );
};

const root = document.querySelector(".root");
ReactDOM.render(<UnityEditor />, root);
