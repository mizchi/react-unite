import React, { useState, useContext } from "react";
import { WindowData } from "../types";
import { TabSelector } from "./TabSelector";
import {
  DragAndDropContext,
  DragAndDropContextValue
} from "../contexts/DragAndDropContext";

export function Container({
  id,
  windows,
  selectedId,
  renderWindow,
  onSelectTab,
  onDropToTabbar,
  onDropToTab: _onDropToTab,
  onDragStartWindow
}: {
  id: string;
  windows: WindowData[];
  selectedId: string;
  renderWindow: (id: string) => React.ReactNode;
  onSelectTab: (windowId: string) => (ev: Event) => void;
  onDropToTabbar: (windowId: string) => (ev: DragEvent) => void;
  onDropToTab: (windowId: string) => (ev: DragEvent) => void;
  onDragStartWindow: (
    containerId: string
  ) => (windowId: string) => (ev: DragEvent) => void;
}) {
  const dragAndDropDropValue: DragAndDropContextValue = useContext(
    DragAndDropContext
  );
  // TabSelector handlers

  const onDragStart = (_ev: DragEvent) => {
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
      // setDragAndDropContext({ dragging: null });
    }
  };

  // Tab handlers

  // const onDragStartTab = (windowId: string) => (ev: DragEvent) => {
  //   console.log("conatiner:tab:onDragStart", windowId);
  //   if (ev.dataTransfer) {
  //     ev.dataTransfer.effectAllowed = "drop";
  //     ev.dataTransfer.setData("text", windowId);
  //     // setDragAndDropContext({
  //     //   dragging: {
  //     //     windowId,
  //     //     containerId: id
  //     //   }
  //     // });

  //     // setDragging(true);
  //   }
  // };

  const onDragOverTab = (windowId: string) => (ev: DragEvent) => {
    ev.preventDefault();
    console.log("conatiner:tab:onDragStart", windowId);
    // if (ev.dataTransfer) {
    //   ev.dataTransfer.dropEffect = "none";
    // }
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
        onDragStartTab={onDragStartWindow(id)}
        onDragOverTab={onDragOverTab}
        onDragEndTab={onDragEndTab}
      />
      <x-pane style={{ flex: 1, background: "white", overflowY: "auto" }}>
        {renderWindow(selectedId)}
      </x-pane>
    </x-pane>
  );
}
