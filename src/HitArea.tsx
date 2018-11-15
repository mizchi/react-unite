import React from "react";

export function HitArea(props: {
  name: string;
  onDragStart: any;
  onDragEnd: any;
  onDrag: any;
  color?: string;
}) {
  return (
    <div
      style={{
        gridArea: props.name,
        width: "100%",
        height: "100%",
        outline: "1px solid white",
        boxSizing: "border-box",
        backgroundColor: props.color || "gray"
      }}
    >
      <TranparentHitRegion
        onDragStart={props.onDragStart}
        onDragEnd={props.onDragEnd}
        onDrag={props.onDrag}
      />
    </div>
  );
}

function TranparentHitRegion(props: {
  onDragStart: any;
  onDragEnd: any;
  onDrag: any;
}) {
  return (
    <div
      onDragStart={props.onDragStart}
      onDragEnd={props.onDragEnd}
      onDrag={props.onDrag}
      draggable
      style={{
        opacity: 0,
        cursor: "grab",
        width: "100%",
        height: "100%"
      }}
    />
  );
}
