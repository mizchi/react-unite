import { WindowData } from "../types";
import React, { useState, useContext } from "react";
import { Pane } from "./Pane";
import { View } from "./View";
import { DragContext } from "../contexts/DragContext";

const DRAGGING_COLOR = "1px solid rgba(0,0,255, 0.8)";
const OVERLAY_COLOR = "1px solid rgba(255,0,0, 0.8)";
const UNOVERLAY_COLOR = "transparent";

export function TabSelector(props: {
  windows: Array<WindowData>;
  selectedId: string | null;
  onSelectTab: (id: string) => (ev: Event) => void;
  onDrop?: (ev: DragEvent) => void;
  onDragOver?: (ev: DragEvent) => void;
  onDragStart?: (ev: DragEvent) => void;
  onDragEnd?: (ev: DragEvent) => void;
  onDragStartTab?: (id: string) => (ev: DragEvent) => void;
  onDragEndTab?: (id: string) => (ev: DragEvent) => void;
  onDragOverTab?: (id: string) => (ev: DragEvent) => void;
  onDropTab?: (id: string) => (ev: DragEvent) => void;
  renderTab: (data: WindowData) => React.ReactNode;
}) {
  const [draggingOver, setDraggingOver] = useState(false);
  const drag = useContext(DragContext);

  return (
    <View
      onDragEnter={() => {
        setDraggingOver(true);
      }}
      onDragLeave={() => {
        setDraggingOver(false);
      }}
      onDragOver={props.onDragOver as any}
      onDragStart={props.onDragStart as any}
      onDragEnd={props.onDragEnd as any}
      onDrop={ev => {
        props.onDrop && props.onDrop(ev as any);
        setDraggingOver(false);
      }}
      style={{
        height: 28,
        alignItems: "left",
        backgroundColor: "#aaa",
        boxSizing: "border-box",
        width: "100%",
        flexDirection: "row",
        border: drag && draggingOver ? OVERLAY_COLOR : UNOVERLAY_COLOR
      }}
    >
      {props.windows.map(window => {
        return (
          <TabButton
            key={window.id}
            id={window.id}
            displayName={window.displayName}
            selected={window.id === props.selectedId}
            onClick={props.onSelectTab(window.id)}
            onDragEnd={props.onDragEndTab && props.onDragEndTab(window.id)}
            onDragOver={props.onDragOverTab && props.onDragOverTab(window.id)}
            onDragStart={
              props.onDragStartTab && props.onDragStartTab(window.id)
            }
            onDrop={props.onDropTab && props.onDropTab(window.id)}
          >
            {props.renderTab(window)}
          </TabButton>
        );
      })}
    </View>
  );
}

function TabButton(props: {
  id: string;
  displayName: string;
  selected?: boolean;
  onClick: (event: Event) => void;
  onDragStart?: (ev: DragEvent) => void;
  onDragEnd?: (ev: DragEvent) => void;
  onDragOver?: (ev: DragEvent) => void;
  onDrag?: (ev: DragEvent) => void;
  onDrop?: (ev: DragEvent) => void;
  children: React.ReactNode;
}) {
  const [dragging, setDragging] = useState(false);
  const [draggingOver, setDraggingOver] = useState(false);

  const drag = useContext(DragContext);

  return (
    <Pane
      draggable
      onClick={props.onClick as any}
      onDragEnter={() => {
        if (drag && drag.windowId !== props.id) setDraggingOver(true);
      }}
      onDragLeave={() => {
        setDraggingOver(false);
      }}
      onDragStart={ev => {
        props.onDragStart && props.onDragStart(ev as any);
        setDragging(true);
        ev.stopPropagation();
      }}
      onDragEnd={ev => {
        props.onDragEnd && props.onDragEnd(ev as any);
        setDragging(false);
        setDraggingOver(false);
      }}
      onDrag={props.onDrag as any}
      onDragOver={ev => {
        props.onDragOver && props.onDragOver(ev as any);
      }}
      onDrop={props.onDrop as any}
      style={{
        borderRight: "1px solid rgba(0,0,0,0.4)",
        minWidth: "50px",
        width: 100, // TODO: Fix
        height: "100%",
        background: props.selected ? "#fff" : "#aaa",
        outline: drag && dragging ? DRAGGING_COLOR : "none",
        border: drag && draggingOver ? OVERLAY_COLOR : UNOVERLAY_COLOR
      }}
    >
      {props.children}
    </Pane>
  );
}
