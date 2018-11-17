import React, { useState } from "react";
import { TabData } from "../types";
import { WindowTabSelector } from "./WindowTabSelector";

export function Window({
  id,
  tabs,
  selectedId,
  renderWindow,
  onSelectTab,
  onDropToTabs
}: {
  id: string;
  tabs: TabData[];
  selectedId: string;
  renderWindow: (id: string) => React.ReactNode;
  onSelectTab: (tabId: string) => (ev: Event) => void;
  onDropToTabs: (tabId: string) => (ev: DragEvent) => void;
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
      const tabId = ev.dataTransfer.getData("text");
      onDropToTabs(tabId)(ev);
    }
  };

  // Tab handlers

  const onDragStartTab = (tabId: string) => (ev: DragEvent) => {
    console.log("onDragStartTab", tabId);

    if (ev.dataTransfer) {
      ev.dataTransfer.effectAllowed = "drop";
      ev.dataTransfer.setData("text", tabId);
      // setDragging(true);
    }
  };

  const onDragEndTab = (_tabId: string) => (_ev: DragEvent) => {
    console.log("onDragEndTab", _tabId);
    // setDragging(false);
  };

  const onDropTab = (_tabId: string) => (_ev: DragEvent) => {
    console.log("onDropTab", _tabId);
    // setDragging(false);
  };

  return (
    <x-pane style={{ flexDirection: "column" }}>
      <WindowTabSelector
        tabs={tabs}
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
