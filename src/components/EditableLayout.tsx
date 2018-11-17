import React, { useState } from "react";

import { Container } from "./Container";
import { GridArea } from "./Grid";
import { pixelToNumber, pixelsToFractions } from "../helpers";
import { EditableGrid } from "./EditableGrid";
import { GridData, LayoutData } from "../types";

export function EditableLayout(props: {
  width: number | string;
  height: number | string;
  layout: LayoutData;
  grid: GridData;
  // TODO: take WindowData
  renderWindow: (id: string) => React.ReactNode;
}) {
  const tabMap = props.layout.windowMap;
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
            let windowIds = w.windowIds;
            let selectedId = w.selectedId;
            if (w.id === win.id) {
              windowIds = w.windowIds.includes(tabId)
                ? w.windowIds
                : [...w.windowIds, tabId];
              selectedId = tabId;
            } else {
              windowIds = w.windowIds.filter(t => t !== tabId);
              if (tabId === w.selectedId) {
                selectedId = windowIds[0];
              }
            }
            return { ...w, windowIds, selectedId };
          });

          setWindows(newWindows);
        };
        const tabs = win.windowIds.map(tid => tabMap[tid]);
        return (
          <GridArea name={win.id} key={win.id}>
            <Container
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
