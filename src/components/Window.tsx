import React from "react";
import { TabData } from "../types";
import { WindowTabSelector } from "./WindowTabSelector";

export function Window({
  tabs,
  selectedId,
  renderContent,
  onSelectTab,
  onDropTab
}: {
  id: string;
  tabs: TabData[];
  selectedId: string;
  renderContent: (id: string) => React.ReactNode;
  onSelectTab: (tabId: string) => (ev: Event) => void;
  onDropTab: (tabId: string) => (ev: DragEvent) => void;
}) {
  const onDrop = (ev: DragEvent) => {
    if (ev.dataTransfer) {
      const tabId = ev.dataTransfer.getData("text");
      onDropTab(tabId)(ev);
    }
  };
  const onDragOver = (ev: DragEvent) => {
    ev.preventDefault();
  };

  const onDragStartTab = (tabId: string) => (ev: DragEvent) => {
    if (ev.dataTransfer) {
      ev.dataTransfer.effectAllowed = "drop";
      ev.dataTransfer.setData("text", tabId);
    }
  };

  return (
    <x-pane style={{ flexDirection: "column" }}>
      <WindowTabSelector
        tabs={tabs}
        selectedId={selectedId}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onSelectTab={onSelectTab}
        onDragStartTab={onDragStartTab}
      />
      <x-pane style={{ flex: 1, background: "white", overflowY: "scroll" }}>
        {renderContent(selectedId)}
      </x-pane>
    </x-pane>
  );
}
