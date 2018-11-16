import { TabData } from "../types";
import React from "react";

export function WindowTabSelector(props: {
  tabs: Array<TabData>;
  selectedId: string;
  onSelectTab: (id: string) => (ev: Event) => void;
  // onDragStartTab?: (id: string) => (ev: Event) => void;
  // onDragEndTab?: (id: string) => (ev: Event) => void;
  // onDropTab?: (id: string) => (ev: Event) => void;
  onDrop?: (ev: DragEvent) => void;
}) {
  return (
    <x-view
      // onDragEnter={ev => {
      //   console.log("enter target");
      // }}
      // onDragLeave={ev => {
      //   console.log("leave target");
      // }}
      onDragOver={ev => {
        ev.preventDefault();
      }}
      onDrop={props.onDrop as any}
      style={{
        height: 30,
        backgroundColor: "wheat",
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
            onDragStart={ev => {
              if (ev.dataTransfer) {
                ev.dataTransfer.effectAllowed = "drop";
                ev.dataTransfer.setData("text", tab.id);
              }
            }}
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
      onDrop={props.onDrop as any}
      style={{
        borderRight: "1px solid rgba(0,0,0,0.4)",
        minWidth: "50px",
        height: "100%",
        background: props.selected ? "#fff" : "#aaa",
        borderBottom: "1px solid rgba(0,0,0, 0.4)"
      }}
    >
      {props.displayName}
    </x-pane>
  );
}
