import React, { useState, useContext } from "react";
import { WindowData } from "../types";
import { TabSelector } from "./TabSelector";
import { DragContext, DragContextValue } from "../contexts/DragContext";

export function Container({
  containerId,
  windows,
  selectedId,
  renderWindow,
  onSelectTab,
  // onDropToTabbar,
  // onDropToTab: _onDropToTab,
  onDragStartWindow,
  onDropWindow
}: {
  containerId: string;
  windows: WindowData[];
  selectedId: string;
  renderWindow: (id: string) => React.ReactNode;
  onSelectTab: (windowId: string) => (ev: Event) => void;
  // onDropToTabbar: (windowId: string) => (ev: DragEvent) => void;
  // onDropToTab: (windowId: string) => (ev: DragEvent) => void;
  onDragStartWindow: (
    containerId: string
  ) => (windowId: string) => (ev: DragEvent) => void;
  onDropWindow: (
    dropContainerId: string,
    dropWindowId: string | null
  ) => (ev: DragEvent) => void;
}) {
  const dragContextValue: DragContextValue = useContext(DragContext);
  // TabSelector handlers

  // const onDragStart = (_ev: DragEvent) => {
  //   console.log("conatiner:onDragStart");
  // };

  // const onDragEnd = (ev: DragEvent) => {
  //   console.log("conatiner:onDragEnd");

  //   // setDragging(false);
  // };

  const onDragEndTab = (_windowId: string) => (_ev: DragEvent) => {
    console.log("conatiner:tab:onDragEnd", _windowId);
    // setDragging(false);
  };

  // ------- important

  const onDragOverTabbar = (ev: DragEvent) => {
    console.log("conatiner:onDragOver", containerId);
    if (dragContextValue) {
      if (dragContextValue.containerId !== containerId) {
        ev.preventDefault();
      }
    }
  };

  const onDragOverTab = (windowId: string) => (ev: DragEvent) => {
    if (dragContextValue) {
      // other window
      if (dragContextValue.windowId !== windowId) {
        if (dragContextValue.containerId === containerId) {
          // to same container
          ev.preventDefault();
        } else {
          // ignore drag from other container
        }
      }
    }
  };

  const onDropTabbar = (ev: DragEvent) => {
    console.log("conatiner:onDrop");
    if (dragContextValue) {
      // onDropToTabbar(dragContextValue.windowId)(ev);
      console.log("Fire drop as Tabbar");
      onDropWindow(containerId, null)(ev);
    }
  };

  const onDropTab = (windowId: string) => (ev: DragEvent) => {
    if (dragContextValue) {
      console.log("Fire drop as Tab");
      onDropWindow(containerId, windowId)(ev);
    }
  };

  return (
    <x-pane style={{ flexDirection: "column" }}>
      <TabSelector
        tabs={windows}
        selectedId={selectedId}
        // onDragStart={onDragStart}
        onDragOver={onDragOverTabbar}
        // onDragEnd={onDragEnd}
        onDrop={onDropTabbar}
        onDropTab={onDropTab}
        onSelectTab={onSelectTab}
        onDragStartTab={onDragStartWindow(containerId)}
        onDragOverTab={onDragOverTab}
        onDragEndTab={onDragEndTab}
      />
      <x-pane style={{ flex: 1, background: "white", overflowY: "auto" }}>
        {renderWindow(selectedId)}
      </x-pane>
    </x-pane>
  );
}
