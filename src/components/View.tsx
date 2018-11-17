import React from "react";

export function View(props: React.HTMLAttributes<HTMLElement>) {
  const { children, style, ...other } = props;
  return (
    <div
      style={{
        alignItems: "stretch",
        borderWidth: 0,
        borderStyle: "solid",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        margin: 0,
        minHeight: 0,
        minWidth: 0,
        padding: 0,
        position: "relative",
        zIndex: 0,
        ...style
      }}
      {...other}
    >
      {children}
    </div>
  );
}
