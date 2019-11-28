import React, { useEffect, useState, useCallback } from "react";
import * as Layout from "../api/layout";
import { pixelsToFractions, pixelToNumber } from "../helpers";
import { GridData, LayoutData, WindowData } from "../types";
import { WindowListContainer } from "./WindowListContainer";
import { EditableGrid } from "./EditableGrid";
import { DragContext, DragContextValue } from "../contexts/DragContext";
import { GridArea } from "./Grid";

export function EditableLayout(props: {
  width: number | string;
  height: number | string;
  layout: LayoutData;
  spacerSize?: number;
  onDragStart?: Function;
  onDragEnd?: Function;
  renderWindow: (data: WindowData) => React.ReactNode;
  renderTab: (data: WindowData) => React.ReactNode;
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
      ev.dataTransfer.effectAllowed = "move";
      ev.dataTransfer.setData("text", windowId);
      setDragContext({
        containerId,
        windowId
      });
    }
  };

  const onDropWindow = useCallback(
    (dropContainerId: string, dropWindowId: string | null) => (
      ev: DragEvent
    ) => {
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
    },
    [layout, dragContextValue]
  );

  const onChangeGridData = useCallback(
    (data: GridData) => {
      const newGrid = {
        ...data,
        rows: pixelsToFractions(data.rows),
        columns: pixelsToFractions(data.columns)
      };
      setLayout({ ...layout, grid: newGrid });
    },
    [layout]
  );

  return (
    <DragContext.Provider value={dragContextValue}>
      <EditableGrid
        key={`${props.width}-${props.height}`}
        width={pixelToNumber(props.width)}
        height={pixelToNumber(props.height)}
        spacerSize={props.spacerSize ?? 8}
        onChangeGridData={onChangeGridData}
        onDragStart={props.onDragStart}
        onDragEnd={props.onDragEnd}
        {...layout.grid}
      >
        {layout.panes.map(pane => {
          const windows = pane.windowIds.map(tid => layout.windows[tid]);
          return (
            <GridArea name={pane.id} key={pane.id}>
              <WindowListContainer
                showTab={pane.showTab ?? true}
                containerId={pane.id}
                windows={windows}
                renderTab={props.renderTab}
                selectedId={pane.selectedId || null}
                onSelectTab={onSelectTab(pane.id)}
                onDragStartWindow={onDragStartWindow}
                onDropWindow={onDropWindow}
                renderWindow={(id: string | null) => {
                  if (id) {
                    return props.renderWindow(layout.windows[id]);
                  } else {
                    return <></>;
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
