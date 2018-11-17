import React from "react";
import { WindowData } from "../types";
import { TabSelector } from "./TabSelector";

export function Container({
  id,
  windows,
  selectedId,
  renderWindow,
  onSelectTab,
  onDropToTabs
}: {
  id: string;
  windows: WindowData[];
  selectedId: string;
  renderWindow: (id: string) => React.ReactNode;
  onSelectTab: (windowId: string) => (ev: Event) => void;
  onDropToTabs: (windowId: string) => (ev: DragEvent) => void;
}) {
  // const [dragging, setDragging] = useState<boolean>(false);

  // TabSelector handlers

  const onDragStart = (ev: DragEvent) => {
    console.log("onDragStart");

    // setDragging(false);
  };

  const onDragOver = (ev: DragEvent) => {
    console.log("onDragOver", id);
    // if (!dragging) {
    ev.preventDefault();
    // }
  };

  const onDragEnd = (ev: DragEvent) => {
    console.log("onDragEnd");

    // setDragging(false);
  };

  const onDrop = (ev: DragEvent) => {
    console.log("onDrop");
    if (ev.dataTransfer) {
      const windowId = ev.dataTransfer.getData("text");
      onDropToTabs(windowId)(ev);
    }
  };

  // Tab handlers

  const onDragStartTab = (windowId: string) => (ev: DragEvent) => {
    console.log("onDragStartTab", windowId);

    if (ev.dataTransfer) {
      ev.dataTransfer.effectAllowed = "drop";
      ev.dataTransfer.setData("text", windowId);
      // setDragging(true);
    }
  };

  const onDragEndTab = (_windowId: string) => (_ev: DragEvent) => {
    console.log("onDragEndTab", _windowId);
    // setDragging(false);
  };

  const onDropTab = (_windowId: string) => (_ev: DragEvent) => {
    console.log("onDropTab", _windowId);
    // setDragging(false);
  };

  return (
    <x-pane style={{ flexDirection: "column" }}>
      <TabSelector
        tabs={windows}
        selectedId={selectedId}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        onDrop={onDrop}
        onDropTab={onDropTab}
        onSelectTab={onSelectTab}
        onDragStartTab={onDragStartTab}
        onDragEndTab={onDragEndTab}
      />
      <x-pane style={{ flex: 1, background: "white", overflowY: "auto" }}>
        {renderWindow(selectedId)}
      </x-pane>
    </x-pane>
  );
}
