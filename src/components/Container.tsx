import React from "react";
import { WindowData } from "../types";
import { TabSelector } from "./TabSelector";

export function Container({
  id,
  windows,
  selectedId,
  renderWindow,
  onSelectTab,
  onDropToTabbar,
  onDropToTab: _onDropToTab
}: {
  id: string;
  windows: WindowData[];
  selectedId: string;
  renderWindow: (id: string) => React.ReactNode;
  onSelectTab: (windowId: string) => (ev: Event) => void;
  onDropToTabbar: (windowId: string) => (ev: DragEvent) => void;
  onDropToTab: (windowId: string) => (ev: DragEvent) => void;
}) {
  // const [dragging, setDragging] = useState<boolean>(false);

  // TabSelector handlers

  const onDragStart = (ev: DragEvent) => {
    console.log("conatiner:onDragStart");

    // setDragging(false);
  };

  const onDragOver = (ev: DragEvent) => {
    console.log("conatiner:onDragOver", id);
    // if (!dragging) {
    ev.preventDefault();
    // }
  };

  const onDragEnd = (ev: DragEvent) => {
    console.log("conatiner:onDragEnd");

    // setDragging(false);
  };

  const onDrop = (ev: DragEvent) => {
    console.log("conatiner:onDrop");
    if (ev.dataTransfer) {
      const windowId = ev.dataTransfer.getData("text");
      onDropToTabbar(windowId)(ev);
    }
  };

  // Tab handlers

  const onDragStartTab = (windowId: string) => (ev: DragEvent) => {
    console.log("conatiner:tab:onDragStart", windowId);

    if (ev.dataTransfer) {
      ev.dataTransfer.effectAllowed = "drop";
      ev.dataTransfer.setData("text", windowId);
      // setDragging(true);
    }
  };

  const onDragOverTab = (windowId: string) => (ev: DragEvent) => {
    ev.preventDefault();
    console.log("conatiner:tab:onDragStart", windowId);
    if (ev.dataTransfer) {
      ev.dataTransfer.dropEffect = "none";
    }
    // if (ev.dataTransfer) {
    //   ev.dataTransfer.effectAllowed = "drop";
    //   ev.dataTransfer.setData("text", windowId);
    //   // setDragging(true);
    // }
  };

  const onDragEndTab = (_windowId: string) => (_ev: DragEvent) => {
    console.log("conatiner:tab:onDragEnd", _windowId);
    // setDragging(false);
  };

  const onDropTab = (windowId: string) => (ev: DragEvent) => {
    console.log("conatiner:tab:onDrop", windowId);
    _onDropToTab(windowId)(ev);

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
