import React, { useEffect, useState } from "react";
import { moveWindowToContainer, selectWindowOnContainer } from "../api/layout";
import { pixelsToFractions, pixelToNumber } from "../helpers";
import { GridData, LayoutData, WindowData } from "../types";
import { Container } from "./Container";
import { EditableGrid } from "./EditableGrid";
import { GridArea } from "./Grid";

export function EditableLayout(props: {
  width: number | string;
  height: number | string;
  layout: LayoutData;
  renderWindow: (data: WindowData) => React.ReactNode;
  onChangeLayout?: (data: LayoutData) => void;
}) {
  // State
  const [layout, setLayout] = useState(props.layout);

  // Effect
  useEffect(() => {
    props.onChangeLayout && props.onChangeLayout(layout);
  });

  // Handlers
  const onSelectTab = (containerId: string) => (windowId: string) => (
    _ev: Event
  ) => {
    const newLayout = selectWindowOnContainer(layout, windowId, containerId);
    setLayout(newLayout);
  };

  const onChangeGridData = (data: GridData) => {
    const newGrid = {
      ...data,
      rows: pixelsToFractions(data.rows),
      columns: pixelsToFractions(data.columns)
    };
    setLayout({ ...layout, grid: newGrid });
  };

  return (
    <EditableGrid
      key={`${props.width}-${props.height}`}
      width={pixelToNumber(props.width)}
      height={pixelToNumber(props.height)}
      spacerSize={8}
      onChangeGridData={onChangeGridData}
      {...layout.grid}
    >
      {layout.containers.map(container => {
        const onDropTab = (windowId: string) => (_ev: DragEvent) => {
          const newLayout = moveWindowToContainer(
            layout,
            windowId,
            container.id
          );
          setLayout(newLayout);
        };

        const windows = container.windowIds.map(tid => layout.windowMap[tid]);
        return (
          <GridArea name={container.id} key={container.id}>
            <Container
              id={container.id}
              windows={windows}
              selectedId={container.selectedId}
              onSelectTab={onSelectTab(container.id)}
              onDropToTabs={onDropTab}
              renderWindow={id => props.renderWindow(layout.windowMap[id])}
            />
          </GridArea>
        );
      })}
    </EditableGrid>
  );
}
