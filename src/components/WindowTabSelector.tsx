import { TabData } from "../types";
import React from "react";

export function WindowTabSelector(props: {
  tabs: Array<TabData>;
  selectedId: string;
  onSelectTab: (id: string) => (ev: Event) => void;
  onDrop?: (ev: DragEvent) => void;
  onDragOver?: (ev: DragEvent) => void;
  onDragStart?: (ev: DragEvent) => void;
  onDragEnd?: (ev: DragEvent) => void;
  onDragStartTab?: (id: string) => (ev: DragEvent) => void;
  onDragEndTab?: (id: string) => (ev: DragEvent) => void;
  onDragOverTab?: (id: string) => (ev: DragEvent) => void;
  onDropTab?: (id: string) => (ev: DragEvent) => void;
}) {
  return (
    <x-view
      onDragOver={props.onDragOver as any}
      onDragStart={props.onDragStart as any}
      onDragEnd={props.onDragEnd as any}
      onDrop={props.onDrop as any}
      style={{
        height: 30,
        alignItems: "left",
        backgroundColor: "#aaa",
        width: "100%",
        flexDirection: "row"
      }}
    >
      {props.tabs.map(tab => {
        return (
          <WindowTabButton
            key={tab.id}
            id={tab.id}
            displayName={tab.displayName}
            selected={tab.id === props.selectedId}
            onClick={props.onSelectTab(tab.id)}
            onDragEnd={props.onDragEndTab && props.onDragEndTab(tab.id)}
            onDragOver={props.onDragOverTab && props.onDragOverTab(tab.id)}
            onDragStart={props.onDragStartTab && props.onDragStartTab(tab.id)}
            onDrop={props.onDropTab && props.onDropTab(tab.id)}
          />
        );
      })}
    </x-view>
  );
}

function WindowTabButton(props: {
  id: string;
  displayName: string;
  selected?: boolean;
  onClick: (event: Event) => void;
  onDragStart?: (ev: DragEvent) => void;
  onDragEnd?: (ev: DragEvent) => void;
  onDragOver?: (ev: DragEvent) => void;
  onDrag?: (ev: DragEvent) => void;
  onDrop?: (ev: DragEvent) => void;
}) {
  return (
    <x-pane
      onClick={props.onClick as any}
      draggable
      onDragStart={props.onDragStart as any}
      onDragEnd={props.onDragEnd as any}
      onDrag={props.onDrag as any}
      onDragOver={props.onDragOver as any}
      onDrop={props.onDrop as any}
      style={{
        borderRight: "1px solid rgba(0,0,0,0.4)",
        minWidth: "50px",
        width: 100, // TODO: Fix
        height: "100%",
        background: props.selected ? "#fff" : "#aaa",
        borderBottom: "1px solid rgba(0,0,0, 0.4)"
      }}
    >
      {props.displayName}
    </x-pane>
  );
}
