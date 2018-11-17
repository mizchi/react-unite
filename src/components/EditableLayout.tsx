import React, { useState } from "react";

import { Container } from "./Container";
import { GridArea } from "./Grid";
import { pixelToNumber, pixelsToFractions } from "../helpers";
import { EditableGrid } from "./EditableGrid";
import { LayoutData, WindowData } from "../types";
import { moveWindowToContainer } from "../api/layout";

export function EditableLayout(props: {
  width: number | string;
  height: number | string;
  layout: LayoutData;
  renderWindow: (data: WindowData) => React.ReactNode;
  onChangeLayout?: (data: LayoutData) => void;
}) {
  const windowMap = props.layout.windowMap; // TODO: editable
  const [grid, setGrid] = useState(props.layout.grid);
  const [containers, setContainers] = useState(props.layout.containers);

  // TODO: Remove this
  const withCurrentLayout = (fn: (newLayout: LayoutData) => void) => {
    const newLayout: LayoutData = {
      ...props.layout,
      containers,
      grid,
      windowMap
    };
    fn(newLayout);
  };

  return (
    <EditableGrid
      key={`${props.width}-${props.height}`}
      width={pixelToNumber(props.width)}
      height={pixelToNumber(props.height)}
      spacerSize={8}
      onChangeGridData={data => {
        const newGrid = {
          ...data,
          rows: pixelsToFractions(data.rows),
          columns: pixelsToFractions(data.columns)
        };
        setGrid(newGrid);
        withCurrentLayout(data => {
          props.onChangeLayout &&
            props.onChangeLayout({ ...data, grid: newGrid });
        });
      }}
      {...grid}
    >
      {containers.map(container => {
        const onDropTab = (windowId: string) => (_ev: DragEvent) => {
          // TODO: Extract moveToOtherContainer
          const newLayout = moveWindowToContainer(
            {
              ...props.layout,
              containers,
              grid,
              windowMap
            },
            windowId,
            container.id
          );
          setContainers(newLayout.containers);
          withCurrentLayout(data => {
            props.onChangeLayout &&
              props.onChangeLayout({
                ...data,
                containers: newLayout.containers
              });
          });
        };

        const windows = container.windowIds.map(tid => windowMap[tid]);
        return (
          <GridArea name={container.id} key={container.id}>
            <Container
              id={container.id}
              windows={windows}
              selectedId={container.selectedId}
              onSelectTab={tabId => _ev => {
                const newContainers = containers.map(c => {
                  if (container.id === c.id) {
                    return { ...c, selectedId: tabId };
                  } else {
                    return c;
                  }
                });
                setContainers(newContainers);
                withCurrentLayout(data => {
                  props.onChangeLayout &&
                    props.onChangeLayout({
                      ...data,
                      containers: newContainers
                    });
                });
              }}
              onDropToTabs={onDropTab}
              renderWindow={id => props.renderWindow(windowMap[id])}
            />
          </GridArea>
        );
      })}
    </EditableGrid>
  );
}
