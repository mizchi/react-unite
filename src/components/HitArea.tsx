import React, { useCallback, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";

export function HitArea(props: {
  name: string;
  onDragStart?: any;
  onDragEnd?: any;
  onDrag?: any;
  disabled: boolean;
}) {
  const { uiBaseColor, uiDisabledColor } = useTheme();
  // Use rendering context id
  const [uid] = useState(Math.random().toString());

  const [dragging, setDragging] = useState(false);
  const onDragStart = useCallback(
    ev => {
      setDragging(true);
      props.onDragStart(ev);
    },
    [props.onDragStart]
  );

  const onDragEnd = useCallback(
    ev => {
      setDragging(false);
      props.onDragEnd(ev);
    },
    [props.onDragEnd]
  );

  return (
    <div
      style={{
        gridArea: props.name,
        width: "100%",
        height: "100%",
        outline: "1px solid white",
        boxSizing: "border-box",
        // pointerEvents: props.disabled ? "none" : undefined,
        backgroundColor: props.disabled ? uiDisabledColor : uiBaseColor
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `.${uid}:active{cursor:grabbing}`
        }}
      />
      <div
        className={uid}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDrag={props.onDrag}
        draggable={!props.disabled}
        style={{
          cursor: props.disabled ? undefined : "grab",
          opacity: 0,
          width: "100%",
          height: "100%"
        }}
      />
    </div>
  );
}
