import React from "react";

export type GridProps = {
  columns: string[];
  rows: string[];
  areas: string[][];
  children: any;
  width?: string | number;
  height?: string | number;
  style?: any;
  onDragOver?: any;
};

export type GridAreaProps = {
  name: string;
  children: any;
};

// export const Grid: React.ComponentClass<GridProps> = styled.div`
//   display: grid;
//   width: ${(p: GridProps) => p.width || "100%"};
//   height: ${(p: GridProps) => p.height || "100%"};
//   grid-template-columns: ${(p: GridProps) => p.columns.join(" ")};
//   grid-template-rows: ${(p: GridProps) => p.rows.join(" ")};
//   grid-template-areas: ${(p: GridProps) =>
//     p.areas.map(row => "'" + row.join(" ") + "'").join(" ")};
// `;

export const Grid = React.memo(function Grid(props: GridProps) {
  return (
    <div
      onDragOver={props.onDragOver}
      style={{
        ...props.style,
        display: "grid",
        width: props.width || "100%",
        height: props.height || "100%",
        gridTemplateColumns: props.columns.join(" "),
        gridTemplateRows: props.rows.join(" "),
        gridTemplateAreas: props.areas
          .map(row => "'" + row.join(" ") + "'")
          .join(" ")
      }}
    >
      {props.children}
    </div>
  );
});

export const GridArea = React.memo(function GridArea(props: GridAreaProps) {
  return (
    <div
      style={{
        gridArea: props.name,
        overflow: "auto"
      }}
    >
      {props.children}
    </div>
  );
});
