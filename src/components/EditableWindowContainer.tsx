import React, { useState } from "react";

import { Window } from "./Window";
import { GridArea } from "./Grid";
import { pixelToNumber, pixelsToFractions } from "../helpers";
import { EditableGrid } from "./EditableGrid";
import { GridData, LayoutData } from "../types";

export function EditableWindowContainer(props: {
  width: number | string;
  height: number | string;
  layout: LayoutData;
  grid: GridData;
  renderWindow: (id: string) => React.ReactNode;
}) {
  const tabMap = props.layout.tabMap;
  const [grid, setGrid] = useState(props.grid);
  const [windows, setWindows] = useState(props.layout.containers);

  return (
    <EditableGrid
      key={`${props.width}-${props.height}`}
      width={pixelToNumber(props.width)}
      height={pixelToNumber(props.height)}
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
              onDropToTabs={onDropTab}
              renderWindow={props.renderWindow}
            />
          </GridArea>
        );
      })}
    </EditableGrid>
  );
}
