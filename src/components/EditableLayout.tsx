import React, { useEffect, useState } from "react";
import * as Layout from "../api/layout";
import { pixelsToFractions, pixelToNumber } from "../helpers";
import { GridData, LayoutData, WindowData } from "../types";
import { Container } from "./Container";
import { EditableGrid } from "./EditableGrid";
import { DragContext, DragContextValue } from "../contexts/DragContext";
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
  const [dragContextValue, setDragContext] = useState<DragContextValue>(null);

  // Effect
  useEffect(() => {
    props.onChangeLayout && props.onChangeLayout(layout);
  });

  // Handlers
  const onSelectTab = (containerId: string) => (windowId: string) => (
    _ev: Event
  ) => {
    const newLayout = Layout.selectWindowOnContainer(
      layout,
      windowId,
      containerId
    );
    setLayout(newLayout);
  };

  const onDragStartWindow = (containerId: string) => (windowId: string) => (
    ev: DragEvent
  ) => {
    if (ev.dataTransfer) {
      ev.dataTransfer.effectAllowed = "drop";
      ev.dataTransfer.setData("text", windowId);
      setDragContext({
        containerId,
        windowId
      });
    }
  };

  const onDropWindow = (
    dropContainerId: string,
    dropWindowId: string | null
  ) => (ev: DragEvent) => {
    ev.stopPropagation(); // stop parent tabbar on drop
    if (dragContextValue) {
      const newLayout = Layout.moveWindowToContainer(
        layout,
        dragContextValue.windowId,
        dragContextValue.containerId,
        dropWindowId,
        dropContainerId
      );
      setDragContext(null);
      setLayout(newLayout);
    }
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
    <DragContext.Provider value={dragContextValue}>
      <EditableGrid
        key={`${props.width}-${props.height}`}
        width={pixelToNumber(props.width)}
        height={pixelToNumber(props.height)}
        spacerSize={8}
        onChangeGridData={onChangeGridData}
        {...layout.grid}
      >
        {layout.containers.map(container => {
          const windows = container.windowIds.map(tid => layout.windowMap[tid]);
          return (
            <GridArea name={container.id} key={container.id}>
              <Container
                containerId={container.id}
                windows={windows}
                selectedId={container.selectedId || null}
                onSelectTab={onSelectTab(container.id)}
                onDragStartWindow={onDragStartWindow}
                onDropWindow={onDropWindow}
                renderWindow={(id: string | null) => {
                  if (id) {
                    return props.renderWindow(layout.windowMap[id]);
                  } else {
                    return [];
                  }
                }}
              />
            </GridArea>
          );
        })}
      </EditableGrid>
    </DragContext.Provider>
  );
}
