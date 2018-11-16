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
  return (
    <x-pane style={{ flexDirection: "column" }}>
      <WindowTabSelector
        tabs={tabs}
        selectedId={selectedId}
        onSelectTab={onSelectTab}
        onDrop={onDrop}
      />
      <x-pane style={{ flex: 1, background: "white" }}>
        {renderContent(selectedId)}
      </x-pane>
    </x-pane>
  );
}
