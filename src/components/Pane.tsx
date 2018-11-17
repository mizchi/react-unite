// TODO
import React from "react";
export function Pane(props: React.HTMLAttributes<HTMLElement>) {
  const { children, style, ...other } = props;
  return (
    <div
      style={{
        alignItems: "center",
        borderWidth: 0,
        borderStyle: "solid",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
        margin: 0,
        minHeight: 0,
        minWidth: 0,
        padding: 0,
        position: "relative",
        width: "100%",
        zIndex: 0,
        ...style
      }}
      {...other}
    >
      {children}
    </div>
  );
}
