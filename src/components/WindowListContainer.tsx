import React, { useContext } from "react";
import { WindowData } from "../types";
import { TabSelector } from "./TabSelector";
import { DragContext, DragContextValue } from "../contexts/DragContext";
import { Pane } from "./Pane";

export function WindowListContainer({
  containerId,
  windows,
  selectedId,
  renderWindow,
  onSelectTab,
  onDragStartWindow,
  onDropWindow,
  renderTab,
  showTab
}: {
  containerId: string;
  windows: WindowData[];
  selectedId: string | null;
  renderWindow: (id: string | null) => React.ReactNode;
  onSelectTab: (windowId: string) => (ev: Event) => void;
  onDragStartWindow: (
    containerId: string
  ) => (windowId: string) => (ev: DragEvent) => void;
  onDropWindow: (
    dropContainerId: string,
    dropWindowId: string | null
  ) => (ev: DragEvent) => void;
  renderTab: (data: WindowData) => React.ReactNode;
  showTab: boolean;
}) {
  const dragging: DragContextValue = useContext(DragContext);

  const onDragOverTabbar = (ev: DragEvent) => {
    if (dragging) {
      if (dragging.containerId !== containerId) {
        ev.preventDefault();
      }
    }
  };

  const onDragOverTab = (windowId: string) => (ev: DragEvent) => {
    if (dragging) {
      if (dragging.windowId !== windowId) {
        ev.preventDefault();
      }
    }
  };

  const onDropTabbar = (ev: DragEvent) => {
    onDropWindow(containerId, null)(ev);
  };

  const onDropTab = (windowId: string) => (ev: DragEvent) => {
    onDropWindow(containerId, windowId)(ev);
  };

  return (
    <Pane style={{ flexDirection: "column" }}>
      {showTab && (
        <TabSelector
          windows={windows}
          renderTab={renderTab}
          selectedId={selectedId}
          onDragOver={onDragOverTabbar}
          onDrop={onDropTabbar}
          onDropTab={onDropTab}
          onSelectTab={onSelectTab}
          onDragStartTab={onDragStartWindow(containerId)}
          onDragOverTab={onDragOverTab}
        />
      )}
      <Pane style={{ flex: 1, background: "white", overflowY: "auto" }}>
        {selectedId && renderWindow(selectedId)}
      </Pane>
    </Pane>
  );
}
